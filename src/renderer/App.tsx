// Packages
import React from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import {
	Typography,
	Stack,
	Button,
	TextField,
	MenuItem,
	Select,
	InputLabel,
	FormControl,
	SelectChangeEvent,
	Paper,
	CircularProgress,
	CssBaseline,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Hooks
import localRequest from '../hooks/localRequest';

// Styles
import './App.css';

const theme = createTheme({
	palette: {
		mode: 'dark',
		primary: {
			main: '#ee0915',
		},
	},
});

function Demo() {
	const [evaluator, setEvaluator] = React.useState<
		'Python' | 'NodeJS' | 'Shell'
	>('Python');
	const [evaluatorInput, setEvaluatorInput] = React.useState<string>('');
	const [wlEvaluatorInput, setWLEvaluatorInput] = React.useState<string>('');
	const [result, setResult] = React.useState<string | null>(null);
	const [isReady, setIsReady] = React.useState<boolean>(false);
	const [isWLActive, setIsWLActive] = React.useState<boolean>(false);

	// eslint-disable-next-line consistent-return
	const aliveQ = async () => {
		const resp = await localRequest('aliveQ').then(
			(res) => res,
			() => {
				// eslint-disable-next-line no-console
				console.log('ping WL failed');
			},
		);
		const wait = () =>
			new Promise((resolve) => {
				setTimeout(() => {
					resolve('');
				}, 250);
			});
		if (!resp) {
			setIsWLActive(false);
			await wait();
			aliveQ();
			return;
		}
		// eslint-disable-next-line no-console
		console.log('ping WL succeeded');
		setIsWLActive(true);
		setIsReady(true);
	};
	React.useEffect(() => {
		const intervalId = setInterval(() => {
			if (!isReady) {
				aliveQ();
			}
		}, 1000);
		return () => clearInterval(intervalId);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleEvaluatorChange = (e: SelectChangeEvent): void => {
		setEvaluator(e.target.value as 'Python' | 'NodeJS' | 'Shell');
	};
	const handleEvaluatorInputChange = (
		e: React.ChangeEvent<HTMLInputElement>,
	): void => {
		setEvaluatorInput(e.target.value as string);
	};
	const handleEvaluatorClick = async (): Promise<void> => {
		await localRequest(`/evaluate-${evaluator}`, {
			in: evaluatorInput,
		})
			.then((res) => setResult(res))
			// eslint-disable-next-line no-console
			.catch((err) => console.log(err));
	};

	const handleWLEvaluateClick = async (): Promise<void> => {
		await localRequest(`/evaluate`, {
			in: wlEvaluatorInput,
		})
			.then((res) => setResult(res))
			// eslint-disable-next-line no-console
			.catch((err) => console.log(err));
	};
	const handleWLInputChange = (
		e: React.ChangeEvent<HTMLInputElement>,
	): void => {
		setWLEvaluatorInput(e.target.value as string);
	};

	if (!isReady) {
		return (
			<Stack
				className="Hello"
				direction="column"
				spacing={2}
				sx={{ textAlign: 'center', alignContent: 'center' }}
				justifyContent="center"
			>
				<Typography variant="h3">Loading...</Typography>
				<CircularProgress size={60} />
			</Stack>
		);
	}

	return (
		<Stack
			className="Hello"
			direction="column"
			spacing={2}
			sx={{ textAlign: 'center', alignContent: 'center' }}
			justifyContent="center"
		>
			<Typography variant="h2">
				Electron + ReactTS + WolframLanguage
			</Typography>
			<Stack spacing={2} direction="row">
				<TextField
					variant="filled"
					label="WL Input"
					color="primary"
					sx={{ width: 450 }}
					onChange={handleWLInputChange}
				/>
				<Button
					variant="contained"
					onClick={handleWLEvaluateClick}
					disabled={!isWLActive}
				>
					Evaluate
				</Button>
			</Stack>
			<Stack spacing={2} direction="row">
				<FormControl>
					<InputLabel id="evaluator-label">Evaluator</InputLabel>
					<Select
						labelId="evaluator-label"
						label="Evaluator"
						sx={{ width: 130 }}
						value={evaluator}
						onChange={handleEvaluatorChange}
					>
						<MenuItem value="Python">Python</MenuItem>
						<MenuItem value="NodeJS">NodeJS</MenuItem>
						<MenuItem value="Shell">Shell</MenuItem>
					</Select>
				</FormControl>
				<TextField
					variant="filled"
					label="External Input"
					color="primary"
					sx={{ width: 300 }}
					onChange={handleEvaluatorInputChange}
				/>
				<Button
					variant="contained"
					onClick={handleEvaluatorClick}
					disabled={!isWLActive}
				>
					Evaluate
				</Button>
			</Stack>
			{result && typeof result !== 'object' ? (
				<Paper sx={{ maxWidth: '50%', p: 2 }} variant="outlined">
					{result}
				</Paper>
			) : null}
		</Stack>
	);
}

export default function App() {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Router>
				<Routes>
					<Route path="/" element={<Demo />} />
				</Routes>
			</Router>
		</ThemeProvider>
	);
}
