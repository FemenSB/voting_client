import styles from './text_field.style.module.css'
import { ChangeEvent, Fragment, MutableRefObject, useRef, useState, KeyboardEvent } from 'react';

type TextFieldProps = {
  placeholder?: string;
  buttonLabel?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onAction?: () => void;
  boundRef?: MutableRefObject<string>;
  autoFocus?: boolean;
};

export default function TextField({ placeholder, buttonLabel, onAction,
      onChange, boundRef, autoFocus}: TextFieldProps) {
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

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    if (boundRef) {
      boundRef.current = e.target.value;
    }
    onChange?.(e);
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
            onChange={onInputChange} onKeyDown={onKeyDown} ref={inputElement}
            autoFocus={autoFocus}/>
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
