import { IVotingProxy } from './voting_proxy';
import IVotingProxyFactory from './voting_proxy_factory';
import VotingProxyMock from './voting_proxy_mock';
import VotingProxyImpl from './voting_proxy_impl';

export default class VotingProxyFactoryMock implements IVotingProxyFactory {
  forVoting(code: string): IVotingProxy {
    return new VotingProxyImpl(code);
  }
}
