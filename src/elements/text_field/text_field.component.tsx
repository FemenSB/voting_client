import styles from './text_field.style.module.css'
import { ChangeEvent, Fragment, useRef, useState, KeyboardEvent } from 'react';

type TextFieldProps = {
  placeholder?: string;
  buttonLabel?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onAction?: () => void;
};

export default function TextField(
    { placeholder, buttonLabel, onAction, onChange }: TextFieldProps) {
  const [focused, setFocused] = useState(false);
  const inputElement = useRef<HTMLInputElement>(null);

  function onInputFocus() {
    setFocused(true);
  }
  
  function onInputBlur() {
    setFocused(false);
  }

  function onInputContainerClick() {
    inputElement.current!.focus();
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' && onAction) {
      onAction();
    }
  }

  return (
    <div id={styles['text-field-container']}
        className={focused ? styles.focused : ''}>
      <div id={styles['text-field-input-container']}
          className={styles['text-field-section']}
          onClick={onInputContainerClick}>
        <input id={styles['text-field-input']} placeholder={placeholder}
            onFocus={onInputFocus} onBlur={onInputBlur} autoComplete='off'
            onChange={onChange} onKeyDown={onKeyDown} ref={inputElement} />
      </div>
      {buttonLabel && (
        <Fragment>
          <div className={styles['text-field-section-separator']} />
          <div onClick={onAction} id={styles['text-field-action-button']}
              className={styles['text-field-section']}>
            {buttonLabel}
          </div>
        </Fragment>
      )}
    </div>
  );
}
