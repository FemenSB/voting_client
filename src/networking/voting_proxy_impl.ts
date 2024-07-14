import { assertNotReached } from '../utils/assert';
import { sleep } from '../utils/do_nothing';
import { SERVER_URL } from './constants';
import { IVotingProxy, VoterStatus, VotingData, VotingResults } from './voting_proxy';

import ShortUniqueId from 'short-unique-id';

const { randomUUID } = new ShortUniqueId({ length: 6 });

export default class VotingProxyImpl implements IVotingProxy {
  private votingCode_: string;
  private voterId_: string = randomUUID();

  constructor(votingCode: string) {
    this.votingCode_ = votingCode;
  }

  async getStaticData(): Promise<VotingData> {
    const response = await fetch(`${SERVER_URL}/${this.votingCode_}`);
    const data = await response.json();
    return {
      name: data.name,
      candidates: data.candidates,
      endTime: new Date(data.endTime),
    };
  }

  async sendVote(orderedCandidates: string[]): Promise<void> {
    const requestBody = JSON.stringify({
      voterId: this.voterId_,
      vote: orderedCandidates,
    });
    const request = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: requestBody,
    };
    const votingUrl = `${SERVER_URL}/${this.votingCode_}`;
    await fetch(votingUrl, request);
  }

  async getResults(): Promise<VotingResults> {
    const response = await this.awaitForResults_();
    const data = await response.json();
    return {
      name: data.voting.name,
      orderedCandidates: data.orderedCandidates,
    };
  }

  private async awaitForResults_(): Promise<Response> {
    const maxAttempts = 4;
    for (let i = 0; i < maxAttempts; i++) {
      const response = await fetch(`${SERVER_URL}/results/${this.votingCode_}`);
      if (response.ok) return response;
      await sleep(500);
    }
    assertNotReached('Exceeded maximum attempts to fetch results');
  }

  async connectSocket(nickname: string,
      votersChangedCallback: (voters: VoterStatus[]) => void,
      votingEndedCallback: () => void): Promise<void> {

  }

  async setDone(done: boolean): Promise<void> {

  }

}
