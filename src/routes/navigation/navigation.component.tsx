import './navigation.style.css';

import TextField from '../../elements/text_field/text_field.component';
import { ReactComponent as BookIcon } from '../../icons/book.svg'
import { ReactComponent as PersonIcon } from '../../icons/person.svg'
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
      <nav id='nav-bar'>
        <Link to='/' className='nav-bar-button'>
          <h1>Ranked Voting</h1>
        </Link>
        <Link to='/guide' className='nav-bar-button'>
          <BookIcon className='nav-bar-button-icon' />
          Guide
        </Link>
        <Link to='/about' className='nav-bar-button'>
          <PersonIcon className='nav-bar-button-icon' />
          About
        </Link>
        <div id='nav-bar-end-container'>
          <TextField placeholder='vote code' buttonLabel='join'
              onChange={onCodeInputChange} onAction={joinInputCode} />
        </div>
      </nav>
      <Outlet/>
    </Fragment>
  );
}
