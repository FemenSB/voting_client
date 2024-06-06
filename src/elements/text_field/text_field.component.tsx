import './text_field.style.css'
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
    <div id='text-field-container' className={`${focused ? 'focused' : ''}`}>
      <div id='text-field-input-container' className={'text-field-section'}
          onClick={onInputContainerClick}>
        <input id='text-field-input' placeholder={placeholder}
            onFocus={onInputFocus} onBlur={onInputBlur} autoComplete='off'
            onChange={onChange} onKeyDown={onKeyDown} ref={inputElement} />
      </div>
      {buttonLabel && (
        <Fragment>
          <div className="text-field-section-separator" />
          <div id='text-field-action-button' className='text-field-section' 
              onClick={onAction}>
            {buttonLabel}
          </div>
        </Fragment>
      )}
    </div>
  );
}
