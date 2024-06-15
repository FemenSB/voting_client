import Button from '../button/button.component';
import styles from './dialog.style.module.css';
import { Fragment, MouseEventHandler, ReactElement } from 'react';

type DialogButtonProps = {
  label: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

type DialogProps = {
  open: boolean;
  title: string;
  description: string;
  children?: ReactElement;
  primaryButton: DialogButtonProps;
  secondaryButton?: DialogButtonProps;
  verticalButtons?: boolean;
};

export default function Dialog(props: DialogProps) {
  const { open, title, description, children, primaryButton, secondaryButton}
      = props;
  let { verticalButtons } = props;
  verticalButtons = verticalButtons || !secondaryButton;
  return (
    <Fragment>
      <div id={styles.background} hidden={!open} />
      <dialog open={open} id={styles.dialog}>
        <h1 id={styles.title}>{title}</h1>
        <p id={styles.description}>
          {description}
        </p>
        <div id={styles['children-container']}>
          {children}
        </div>
        <div id={styles['button-container']}
            className={verticalButtons ? styles.vertical : ''}>
          <Button onClick={primaryButton.onClick}>
            {primaryButton.label}
          </Button>
          {secondaryButton &&
              <Fragment>
                <div className={styles['button-separator']} />
                <Button reverse bordered onClick={secondaryButton.onClick}>
                  {secondaryButton.label}
                </Button>
              </Fragment>
              }
        </div>
      </dialog>
    </Fragment>
  )
}
