import { SERVER_URL } from './constants';

export type Voting = {
  name: string;
  candidates: string[];
};

export default async function createVoting(voting: Voting): Promise<string> {
  const request = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(voting),
  };
  const response = await fetch(SERVER_URL, request);
  if (!response.ok) {
    throw new Error('Voting creation request failed');
  }
  const responseData = await response.json();
  return responseData.code;
}
