import './App.css';

import AboutPage from './routes/about/page.component';
import BallotSetupPage from './routes/ballot_setup/page.component';
import GuidePage from './routes/guide/page.component';
import Navigation from './routes/navigation/navigation.component';
import ResultsPage from './routes/results/page.component';
import VotingPage from './routes/voting/page.component';
import { Route, Routes } from 'react-router-dom';
import VotingProxyFactoryMock from './networking/voting_proxy_factory_mock';

const votingProxyFactory = new VotingProxyFactoryMock();

function App() {
  return (
    <Routes>
      <Route path='/' element={<Navigation />}>
        <Route index element={<BallotSetupPage />} />
        <Route path='guide' element={<GuidePage />} />
        <Route path='about' element={<AboutPage />} />
        <Route path=':id' element={
            <VotingPage votingProxyFactory={votingProxyFactory} />} />
        <Route path='results/:id' element={
            <ResultsPage votingProxyFactory={votingProxyFactory} />} />
      </Route>
    </Routes>
  );
}

export default App;
