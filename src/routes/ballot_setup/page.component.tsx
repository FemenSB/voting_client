import Button from '../../elements/button/button.component';
import Chip from '../../elements/chip/chip.component';
import TextField, { TextFieldHandle } from '../../elements/text_field/text_field.component';
import createVoting from '../../networking/create_voting';
import styles from './page.style.module.css';

import { Fragment, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

enum candidateInputState {
  VALID,
  BLANK,
  DUPLICATED,
}

const candidateStateToMessage = {
  [candidateInputState.VALID]: '',
  [candidateInputState.BLANK]: 'Candidate name cannot be blank',
  [candidateInputState.DUPLICATED]: 'Candidate already added',
};

export default function BallotSetupPage() {
  const [candidates, setCandidates] = useState<string[]>([]);
  const [votingName, setVotingName] = useState('');
  const candidateName = useRef('');
  const [candidateErrorMessage, setCandidateErrorMessage] = useState('');
  const candidateInputRef = useRef<TextFieldHandle>(null);
  const navigate = useNavigate();

  function addCandidate() {
    const candidateState = getCandidateInputState();
    setCandidateErrorMessage(candidateStateToMessage[candidateState]);
    if (candidateState !== candidateInputState.VALID) return;
    setCandidates([...candidates, candidateName.current]);
    candidateInputRef.current?.setValue('');
  }

  function getCandidateInputState(): candidateInputState {
    if (!candidateName.current) {
      return candidateInputState.BLANK;
    }
    if (candidates.includes(candidateName.current)) {
      return candidateInputState.DUPLICATED;
    }
    return candidateInputState.VALID;
  }

  function removeCandidate(removed: string) {
    setCandidates(candidates.filter(candidate => candidate !== removed));
  }

  async function onStartClick() {
    const votingCode = await createVoting({
      name: votingName,
      candidates: candidates,
    });
    navigate(votingCode);
  }

  const disableStart = !votingName || candidates.length < 2;

  return (
    <Fragment>
      <div id={styles.forms} className='margin-centralize'>
        <h1>Start a voting!</h1>
        <TextField label='Name your voting 'placeholder='Voting name'
            onChange={setVotingName} />
        <TextField label='Add candidates' placeholder='Candidate name'
            buttonLabel='add' boundRef={candidateName} onAction={addCandidate}
            errorMessage={candidateErrorMessage} ref={candidateInputRef} />
      </div>
      <div id={styles.candidates} className='margin-centralize'>
        {candidates.map(candidate =>
          <Chip value={candidate} key={candidate}
              onRemoved={removeCandidate} />)}
      </div>
      <div id={styles.start} className='margin-centralize'>
        <Button pill onClick={onStartClick} disabled={disableStart}>
          Start
        </Button>
      </div>
    </Fragment>
  );
}
