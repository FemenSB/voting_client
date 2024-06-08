import './button.style.css';

import { addClassName, classNames } from '../../utils/class_name';
import { MouseEventHandler, ReactElement } from 'react';

type ButtonProps = {
  icon?: ReactElement;
  children?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  reverse?: boolean;
  pill?: boolean;
};

export default function Button(
    { icon, children, onClick, reverse, pill }: ButtonProps) {
  const buttonIcon = icon ? addClassName(icon, 'button-icon') : null;
  const buttonClasses = classNames({
      reverse: reverse,
      pill: pill,
  })
  return (
    <button id='button-element' onClick={onClick} className={buttonClasses}>
      {buttonIcon}
      {children}
    </button>
  );
}
