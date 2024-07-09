import axios from 'axios';

export default async function localRequest(
  endpoint: string,
  dataIn: any = {},
  port: number = 4848,
) {
  axios.defaults.baseURL = `http://localhost:${port}`;
  const response = await axios.post(endpoint, null, {
    params: dataIn,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return response.data;
}
