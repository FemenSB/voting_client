import './App.css';

import AboutPage from './routes/about/page.component';
import BallotSetupPage from './routes/ballot_setup/page.component';
import GuidePage from './routes/guide/page.component';
import Navigation from './routes/navigation/navigation.component';
import ResultsPage from './routes/results/page.component';
import VotingPage from './routes/voting/page.component';
import { Route, Routes } from 'react-router-dom';
import ServerProxyFactoryMock from './utils/server_proxy/server_proxy_factory_mock';

const serverProxyFactory = new ServerProxyFactoryMock();

function App() {
  return (
    <Routes>
      <Route path='/' element={<Navigation />}>
        <Route index element={<BallotSetupPage />} />
        <Route path='guide' element={<GuidePage />} />
        <Route path='about' element={<AboutPage />} />
        <Route path=':id' element={
            <VotingPage serverProxyFactory={serverProxyFactory} />} />
        <Route path='results/:id' element={
            <ResultsPage serverProxyFactory={serverProxyFactory} />} />
      </Route>
    </Routes>
  );
}

export default App;
