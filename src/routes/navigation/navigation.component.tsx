import Button from '../../elements/button/button.component';
import TextField from '../../elements/text_field/text_field.component';
import { ReactComponent as BookIcon } from '../../icons/book.svg'
import { ReactComponent as BuildingIcon } from '../../icons/building.svg'
import styles from './navigation.style.module.css';
import { ChangeEvent, Fragment, useRef } from 'react';
import { Link, Outlet } from 'react-router-dom';
 
export default function Navigation() {
  const codeToJoin = useRef('');

  function onCodeInputChange(e: ChangeEvent<HTMLInputElement>) {
    codeToJoin.current = e.target.value;
  }

  function joinInputCode() {
    window.location.pathname = codeToJoin.current;
  }

  return (
    <Fragment>
      <nav id={styles['nav-bar']}>
        <Link to='/' className={styles['nav-bar-button']}>
          <h1>Ranked Voting</h1>
        </Link>
        <Link to='/guide' className={styles['nav-bar-button']}>
          <Button icon={<BookIcon />} reverse>
            Guide
          </Button>
        </Link>
        <Link to='/about' className={styles['nav-bar-button']}>
          <Button icon={<BuildingIcon />} reverse>
          About
          </Button>
        </Link>
        <div id={styles['nav-bar-end-container']}>
          <TextField placeholder='vote code' buttonLabel='join'
              onChange={onCodeInputChange} onAction={joinInputCode} />
        </div>
      </nav>
      <Outlet/>
    </Fragment>
  );
}
