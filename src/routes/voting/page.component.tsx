import Loading from '../../elements/loading/loading.component';
import IServerProxyFactory from '../../utils/server_proxy/server_proxy_factory';
import useInitialize from '../../utils/useInitialize';
import CandidateList from './candidate_list.component';
import FloatingPanel from './floating_panel.component';
import styles from  './page.style.module.css';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

type VotingPageProps = {
  serverProxyFactory: IServerProxyFactory;
};

export default function VotingPage({ serverProxyFactory }: VotingPageProps) {
  const { id } = useParams();
  const [candidates, setCandidates] = useState<string[]>([]);
  const [endTime, setEndTime] = useState<Date>(new Date());
  const serverProxy = useRef(serverProxyFactory.forVoting(id!));
  const orderedCandidates = useRef<string[]>([]);
  const votingEndTimeout = useRef<any>();
  const navigate = useNavigate();

  console.log(id);

  const initialize = useCallback(async () => {
    console.log('initializing voting');
    const data = await serverProxy.current.getStaticData();
    setCandidates(data.candidates);
    orderedCandidates.current = data.candidates;
    setEndTime(data.endTime);
  }, []);

  const initialized = useInitialize(initialize);

  useEffect(() => {
    if (!initialized) return;
    setVotingEndTimeout();

    function setVotingEndTimeout() {
      clearTimeout(votingEndTimeout.current);
      const timeUntilEnding = endTime.getTime() - Date.now();
      votingEndTimeout.current = setTimeout(endVoting, timeUntilEnding);
    }

    async function endVoting() {
      await serverProxy.current.sendVote(orderedCandidates.current);
      navigate(`/results/${id}`);
    }
  }, [initialized, endTime, id, navigate]);

  function onReordered(candidates: string[]) {
    orderedCandidates.current = candidates;
  }

  return (
    <div id={styles['candidate-list-container']}>
      {initialized ?
        <Fragment>
          <div className='margin-centralize'>
            <CandidateList candidates={candidates} onReordered={onReordered} />
          </div>
          <div id={styles['side-panel-container']}>
            <FloatingPanel endTime={endTime} />
          </div>
        </Fragment>
        :
        <div className='margin-centralize'>
          <Loading />
        </div>
        }
    </div>
  );
}
