import Loading from '../../elements/loading/loading.component';
import IServerProxyFactory from '../../utils/server_proxy/server_proxy_factory';
import CandidateList from './candidate_list.component';
import styles from  './page.style.module.css';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

type VotingPageProps = {
  serverProxyFactory: IServerProxyFactory;
};

export default function VotingPage({ serverProxyFactory }: VotingPageProps) {
  const { id } = useParams();
  const [initialized, setInitialized] = useState(false);
  const [candidates, setCandidates] = useState<string[]>([]);
  const serverProxy = useRef(serverProxyFactory.forVoting(id!));

  console.log(id);

  useEffect(() => {
    initialize();
    async function initialize() {
      const data = await serverProxy.current.getStaticData();
      setCandidates(data.candidates);
      setInitialized(true);
    }
  }, []);  

  return (
    <div id={styles['candidate-list-container']}>
      {initialized ? (<CandidateList candidates={candidates}/>) : <Loading />}
    </div>
  );
}
