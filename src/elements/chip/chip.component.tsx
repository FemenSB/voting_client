import { ReactComponent as XIcon } from '../../icons/x_mark_small.svg';
import styles from './chip.style.module.css';

type ChipProps = {
  value: string;
  onRemoved?: (value: string) => void;
};

export default function Chip({ value, onRemoved }: ChipProps) {
  function onRemoveClick() {
    onRemoved?.(value);
  }

  return (
    <div id={styles.chip}>
      <span id={styles.value}>
        {value}
      </span>
      {onRemoved &&
        <div id={styles.remove} title='Remove' onClick={onRemoveClick}>
          <XIcon />
        </div>}
    </div>
  )
}
