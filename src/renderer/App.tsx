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
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import localRequest from '../hooks/localRequest';

// import icon from '../../assets/icon.svg';
import './App.css';

const theme = createTheme({
	palette: {
		mode: 'dark',
	},
});

function Demo() {
	const [evaluator, setEvaluator] = React.useState<
		'Python' | 'NodeJS' | 'Shell'
	>('Python');
	const [evaluatorInput, setEvaluatorInput] = React.useState<string>('');
	const [wlEvaluatorInput, setWLEvaluatorInput] = React.useState<string>('');
	const [result, setResult] = React.useState<string | null>(null);
	const [isWLReady, setIsWLReady] = React.useState<boolean>(false);

	// eslint-disable-next-line consistent-return
	const aliveQ = async () => {
		const resp = await localRequest('aliveQ').then(
			(res) => res,
			(err) => {
				console.log(err);
			},
		);
		const wait = () =>
			new Promise((resolve) => {
				setTimeout(() => {
					resolve('');
				}, 500);
			});
		if (!resp) {
			console.log('ping WL socket failed');
			await wait();
			aliveQ();
			return;
		}
		console.log('ping WL succeeded');
		setIsWLReady(true);
	};
	React.useEffect(() => {
		aliveQ();
	});

	const handleEvaluatorChange = (e: SelectChangeEvent): void => {
		setEvaluator(e.target.value as 'Python' | 'NodeJS' | 'Shell');
	};
	const handleEvaluatorInputChange = (
		e: React.ChangeEvent<HTMLInputElement>,
	): void => {
		setEvaluatorInput(e.target.value as string);
	};
	const handleEvaluatorClick = async (): Promise<void> => {
		const res = await localRequest(`/evaluate-${evaluator}`, {
			in: evaluatorInput,
		});
		setResult(res);
	};

	const handleWLEvaluateClick = async (): Promise<void> => {
		const res = await localRequest(`/evaluate`, {
			in: wlEvaluatorInput,
		});
		setResult(res);
	};
	const handleWLInputChange = (
		e: React.ChangeEvent<HTMLInputElement>,
	): void => {
		setWLEvaluatorInput(e.target.value as string);
	};

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
					// eslint-disable-next-line react/jsx-props-no-spreading
					{...(!isWLReady ? { disabled: true } : {})}
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
					// eslint-disable-next-line react/jsx-props-no-spreading
					{...(!isWLReady ? { disabled: true } : {})}
				>
					Evaluate
				</Button>
			</Stack>
			{result ? (
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
