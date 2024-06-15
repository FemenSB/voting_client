import Button from '../../elements/button/button.component';
import { ReactComponent as CheckIcon } from '../../icons/check.svg';
import { ReactComponent as ClockIcon } from '../../icons/clock.svg'
import { ReactComponent as PencilIcon } from '../../icons/pencil_line.svg';
import { ReactComponent as PersonIcon } from '../../icons/person.svg'
import { VoterStatus } from '../../utils/server_proxy/server_proxy';
import styles from './floating_panel.style.module.css';
import { useEffect, useRef, useState } from 'react';

function computeRemainingTime(from: Date, until: Date): string {
  const remainingMiliseconds = until.getTime() - from.getTime();
  const remainingSeconds = remainingMiliseconds / 1000;
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = Math.floor(remainingSeconds - minutes*60);
  return `${twoDigits(minutes)}:${twoDigits(seconds)}`;

  function twoDigits(integer: number): string {
    return integer.toLocaleString('en-US',
        {minimumIntegerDigits: 2, useGrouping:false});
  }
}

type SidePanelProps = {
  endTime: Date;
  voters: VoterStatus[];
};

export default function FloatingPanel({ endTime, voters }: SidePanelProps) {
  const [showing, setShowing] = useState(false);
  const [remainingTime, setRemainingTime] =
      useState(computeRemainingTime(new Date(), endTime));
  const timerInterval = useRef<any>(null);

  useEffect(() => {
    // We need to clearInterval before setting it because React runs this
    // function twice, so the second run overrides the reference to the first
    // interval
    clearInterval(timerInterval.current);
    timerInterval.current = setInterval(() => {
      const now = new Date();
      if (now < endTime) {
        setRemainingTime(computeRemainingTime(now, endTime));
      } else {
        setRemainingTime(computeRemainingTime(endTime, endTime));
        clearTimeout(timerInterval.current);
      }
      return () => clearInterval(timerInterval.current);
    }, 1000);
  }, [endTime]);

  function onToggleClick() {
    setShowing(value => !value);
  }

  return (
    <div id={styles['side-panel-container']}>
      <div id={styles['button-container']}>
        <div id={styles['timer-container']}>
          <ClockIcon className={styles.icon} />
          <p id={styles.timer}>
            {remainingTime}
          </p>
        </div>
        <Button pill reverse bordered icon={<PersonIcon />}
            onClick={onToggleClick}>
          voters
        </Button>
      </div>
      <div id={styles['side-panel']} className={showing ? styles.showing : ''}>
        {voters.map((voter, i) => (
          <div key={i}
              className={`${styles.voter} ${voter.done ? styles.done : ''}`}
              title={voter.done ?
                  `${voter.nickname} is done voting`
                  : `${voter.nickname} is still voting`}>
            {voter.nickname}
            {voter.done ? <CheckIcon /> : <PencilIcon />}
          </div>
        ))}
      </div>
    </div>
  );
}
