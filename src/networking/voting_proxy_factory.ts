import { IVotingProxy } from './voting_proxy'

export default interface IVotingProxyFactory {
  forVoting(code: string): IVotingProxy;
}
