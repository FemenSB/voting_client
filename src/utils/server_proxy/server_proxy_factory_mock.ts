import { IServerProxy } from './server_proxy';
import IServerProxyFactory from './server_proxy_factory';
import ServerProxyMock from './server_proxy_mock';

export default class ServerProxyFactoryMock implements IServerProxyFactory {
  forVoting(code: string): IServerProxy {
    return new ServerProxyMock();
  }
}
