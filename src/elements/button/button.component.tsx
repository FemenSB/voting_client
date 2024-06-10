import styles from './button.style.module.css';

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
  const buttonIcon = icon ? addClassName(icon, styles['button-icon']) : null;
  const buttonClasses = classNames({
      [styles.reverse]: reverse,
      [styles.pill]: pill,
  })
  return (
    <button id={styles['button-element']} className={buttonClasses}
        onClick={onClick}>
      {buttonIcon}
      {children}
    </button>
  );
}
