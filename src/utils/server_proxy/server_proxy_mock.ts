import sleep from '../sleep';
import {IServerProxy, VotingData, VotingResults} from './server_proxy';

export default class ServerProxyMock implements IServerProxy {
  async getStaticData(): Promise<VotingData> {
    await sleep(1500);
    return {
      name: 'Class president',
      candidates: [
        'Brandt',
        'Adrianna',
        'Avis',
        'Jones',
        'Rochelle',
        'Carmella',
      ],
      endTime: new Date(new Date().getTime() + 5*60*1000)
    };
  }

  async sendVote(orderedCandidates: string[]): Promise<void> {
    return sleep(1000);
  }

  async getResults(): Promise<VotingResults> {
    await sleep(1500);
    return {
      name: 'Class president',
      orderedCandidates: [
        'Avis',
        'Brandt',
        'Adrianna',
        'Jones',
        'Rochelle',
        'Carmella',
      ]
    };
  }
}
