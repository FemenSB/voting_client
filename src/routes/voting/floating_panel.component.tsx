import Button from '../../elements/button/button.component';
import { ReactComponent as ClockIcon } from '../../icons/clock.svg'
import { ReactComponent as PersonIcon } from '../../icons/person.svg'
import styles from './floating_panel.style.module.css';
import { useEffect, useRef, useState } from 'react';

function computeRemainingTime(until: Date): string {
  const now = new Date();
  const remainingMiliseconds = until.getTime() - now.getTime();
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
};

export default function FloatingPanel({ endTime }: SidePanelProps) {
  const [showing, setShowing] = useState(false);
  const [remainingTime, setRemainingTime] =
      useState(computeRemainingTime(endTime));
  const timerInterval = useRef<any>(null);

  useEffect(() => {
    timerInterval.current = setInterval(() => {
      setRemainingTime(computeRemainingTime(endTime));
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
        <Button pill icon={<PersonIcon />} onClick={onToggleClick}>
          voters
        </Button>
      </div>
      <div id={styles['side-panel']} className={showing ? styles.showing : ''}>
      </div>
    </div>
  );
}
