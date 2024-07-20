import axios from 'axios';

export default async function localRequest(
	endpoint: string,
	dataIn: Object = {},
	port: number = 4848,
): Promise<any> {
	axios.defaults.baseURL = `http://localhost:${port}`;
	const response = await axios.post(endpoint, null, {
		params: dataIn,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
	});
	return response.data;
}
