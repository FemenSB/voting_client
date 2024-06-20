import Button from '../../elements/button/button.component';
import Dialog from '../../elements/dialog/dialog.component';
import Loading from '../../elements/loading/loading.component';
import TextField from '../../elements/text_field/text_field.component';
import { ReactComponent as CheckIcon } from '../../icons/check.svg';
import { ReactComponent as PencilIcon } from '../../icons/pencil.svg';
import { VoterStatus, VotingData } from '../../utils/server_proxy/voting_proxy';
import IVotingProxyFactory from '../../utils/server_proxy/voting_proxy_factory';
import useInitialize from '../../utils/useInitialize';
import CandidateList from './candidate_list.component';
import FloatingPanel from './floating_panel.component';
import styles from  './page.style.module.css';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

type VotingPageProps = {
  votingProxyFactory: IVotingProxyFactory;
};

export default function VotingPage({ votingProxyFactory }: VotingPageProps) {
  const { id } = useParams();
  const [votingData, setVotingData] = useState<VotingData|null>(null);
  const [showNicknameDialog, setShowNicknameDialog] = useState(true);
  const [showConfirmDoneDialog, setShowConfirmDoneDialog] = useState(false);
  const [voters, setVoters] = useState<VoterStatus[]>([]);
  const [doneVoting, setDoneVoting] = useState(false);
  const nickname = useRef('');
  const votingProxy = useRef(votingProxyFactory.forVoting(id!));
  const orderedCandidates = useRef<string[]>([]);
  const votingEndTimeout = useRef<any>();
  const navigate = useNavigate();

  const initialize = useCallback(async () => {
    const data = await votingProxy.current.getStaticData();
    setVotingData(data);
  }, []);

  const initialized = useInitialize(initialize);

  useEffect(() => {
    if (!votingData) return;
    setVotingEndTimeout();

    function setVotingEndTimeout() {
      clearTimeout(votingEndTimeout.current);
      const timeUntilEnding = votingData!.endTime.getTime() - Date.now();
      votingEndTimeout.current = setTimeout(endVoting, timeUntilEnding);
    }

    async function endVoting() {
      await votingProxy.current.sendVote(orderedCandidates.current);
      navigate(`/results/${id}`);
    }
  }, [votingData, id, navigate]);

  function onNicknameConfirm() {
    if (!nickname.current) return;
    votingProxy.current.connectSocket(nickname.current,
        onVotersChanged, onVotingEndedEarly);
    setShowNicknameDialog(false);
  }

  function onVotersChanged(voters: VoterStatus[]) {
    setVoters(voters);
  }

  function onVotingEndedEarly() {
    navigate(`/results/${id}`);
  }

  function onReordered(candidates: string[]) {
    orderedCandidates.current = candidates;
  }

  function onDoneClick() {
    if (doneVoting) {
      setDone(false);
    } else {
      setShowConfirmDoneDialog(true);
    }
  }

  function onDoneConfirmed() {
    votingProxy.current.sendVote(orderedCandidates.current);
    setDone(true);
    setShowConfirmDoneDialog(false);
  }

  function setDone(done: boolean) {
    setDoneVoting(done);
    votingProxy.current.setDone(done);
  }

  function onDoneCanceled() {
    setShowConfirmDoneDialog(false);
  }

  return (
    <div id={styles['candidate-list-container']}>
      {initialized ?
        <Fragment>
          <div className='margin-centralize'>
            <h1 id={styles['voting-name']}>{votingData!.name}</h1>
            <CandidateList locked={doneVoting} onReordered={onReordered}
                candidates={votingData!.candidates} />
          </div>
          <div id={styles['side-panel-container']}>
            <FloatingPanel endTime={votingData!.endTime} voters={voters} />
          </div>
          <div id={styles['done-button-container']}>
            <Button pill trailingIcon onClick={onDoneClick}
                icon={doneVoting ? <PencilIcon /> : <CheckIcon />}>
              {doneVoting ? 'Edit votes' : 'Send votes'}
            </Button>
          </div>
          <Dialog open={showNicknameDialog}
              title={`Joining '${votingData!.name}'`}
              description='Set your nickname to continue'
              primaryButton={
                  {label: 'Continue', onClick: onNicknameConfirm}}>
            <TextField autoFocus placeholder='Nickname' boundRef={nickname}
                onAction={onNicknameConfirm} />
          </Dialog>
          <Dialog open={showConfirmDoneDialog}
              title='Are you done voting?'
              description={'Your votes will be registered.'
                  + ' Voting will end early if all voters are done'}
              primaryButton={{label: 'Continue', onClick: onDoneConfirmed}}
              secondaryButton={{label: 'Cancel', onClick: onDoneCanceled}} />
        </Fragment>
        :
        <div className='margin-centralize'>
          <Loading />
        </div>
        }
    </div>
  );
}
