import Loading from '../../elements/loading/loading.component';
import { VotingResults } from '../../utils/server_proxy/server_proxy';
import IServerProxyFactory from '../../utils/server_proxy/server_proxy_factory';
import useInitialize from '../../utils/useInitialize';
import styles from './page.style.module.css';
import { useCallback, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

type ResultsPageProps = {
  serverProxyFactory: IServerProxyFactory;
};

export default function ResultsPage({ serverProxyFactory }: ResultsPageProps) {
  const { id } = useParams();
  const serverProxy = useRef(serverProxyFactory.forVoting(id!));
  const [votingResults, setVotingResults] = useState<VotingResults|null>(null);

  const initialize = useCallback(async () => {
    const data = await serverProxy.current.getResults();
    setVotingResults(data);
  }, []);
  const initialized = useInitialize(initialize);


  return (
    <div id={styles.main}>
      {initialized ?
          <div className='margin-centralize'>
            <h1 id={styles['voting-name-container']}>
              <span id={styles['voting-name']}>{votingResults!.name}</span>
              <span> results</span>
            </h1>
            <table id={styles.table}>
              <tbody id={styles.body}>
                {votingResults!.orderedCandidates.map((name, i) =>
                  <tr key={i} className={styles.row}>
                    <td className={styles.index}>{i+1}</td>
                    <td className={styles.name}>{name}</td>
                  </tr>
                )}
            </tbody>
          </table>
          </div>
          :
          <div className='margin-centralize'>
            <Loading />
          </div>}
    </div>
);
}
