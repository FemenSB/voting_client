import Loading from '../../elements/loading/loading.component';
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
  const [orderedCandidates, setOrderedCandidates] = useState<string[]>([]);

  const initialize = useCallback(async () => {
    console.log('initializing results');
    const data = await serverProxy.current.getResults();
    setOrderedCandidates(data.orderedCandidates);
  }, []);
  const initialized = useInitialize(initialize);


  return (
    <div id={styles.main}>
      {initialized ?
          <div className='margin-centralize'>
            <table id={styles.table}>
              <tbody id={styles.body}>
                {orderedCandidates.map((name, i) =>
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
