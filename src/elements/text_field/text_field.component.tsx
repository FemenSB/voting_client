import { ReactComponent as ExclamationIcon } from '../../icons/exclamation_circle.svg';
import { classNames } from '../../utils/class_name';
import styles from './text_field.style.module.css'
import { ChangeEvent, forwardRef, Fragment, MutableRefObject, useImperativeHandle, useRef, useState, KeyboardEvent } from 'react';

export type TextFieldHandle = {
  setValue: (value: string) => void;
};

type TextFieldProps = {
  label?: string;
  placeholder?: string;
  buttonLabel?: string;
  errorMessage?: string;
  onChange?: (value: string) => void;
  onAction?: () => void;
  boundRef?: MutableRefObject<string>;
  autoFocus?: boolean;
};

const TextField = forwardRef<TextFieldHandle, TextFieldProps>(
    function TextField(props: TextFieldProps, ref) {
  const [focused, setFocused] = useState(false);
  const inputElement = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => {
    return {
      setValue(value: string) {
        setValue(value);
        if (inputElement.current) {
          inputElement.current.value = value;
        }
      }
    }
  });

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
    setValue(e.target.value);
  }

  function setValue(value: string) {
    if (props.boundRef) {
      props.boundRef.current = value;
    }
    props.onChange?.(value);
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' && props.onAction) {
      props.onAction();
    }
  }

  const containerClasses = classNames({
    [styles.focused]: focused,
    [styles.error]: props.errorMessage,
  });

  return (
    <div>
      {props.label && <p id={styles.label}>{props.label}</p>}
      <div id={styles['text-field-container']}
          className={containerClasses}>
        <div id={styles['text-field-input-container']}
            className={styles['text-field-section']}
            onClick={onInputContainerClick}>
          <input id={styles['text-field-input']} placeholder={props.placeholder}
              onFocus={onInputFocus} onBlur={onInputBlur} autoComplete='off'
              onChange={onInputChange} onKeyDown={onKeyDown} ref={inputElement}
              autoFocus={props.autoFocus} />
        </div>
        {props.errorMessage && (
            <ExclamationIcon className={styles.icon} />
        )}
        {props.buttonLabel && (
            <Fragment>
              <div className={styles['text-field-section-separator']} />
              <div onClick={props.onAction}
                  id={styles['text-field-action-button']}
                  className={styles['text-field-section']}>
                {props.buttonLabel}
              </div>
            </Fragment>
        )}
      </div>
      {props.errorMessage &&
          <p id={styles['error-message']}>{props.errorMessage}</p>}
    </div>
  );
});

export default TextField;
