import sleep from '../sleep';
import {IServerProxy, VotingData} from './server_proxy';

export default class ServerProxyMock implements IServerProxy {
  async getStaticData(): Promise<VotingData> {
    await sleep(1500);
    return {
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
}
