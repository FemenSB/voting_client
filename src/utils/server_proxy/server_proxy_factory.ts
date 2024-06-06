import { IServerProxy } from './server_proxy'

export default interface IServerProxyFactory {
  forVoting(code: string): IServerProxy;
}
