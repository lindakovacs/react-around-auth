import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import auth from '../utils/auth';

function Login(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  // const resetForm = () => {
  //   setEmail('');
  //   setPassword('');
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    auth
      .authorize(email, password)
      .then((data) => {
        if (!email || !password) {
          throw new Error('400 - one or more of the fields were not provided');
        }
        if (!data) {
          throw new Error('401 - the user with the specified email not found');
        }
        if (data.token) {
          props.handleLogin();
        }
      })
      .then(() => history.push('/main'))
      // .then(resetForm)
      .catch((err) => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    if (props.loggedIn) {
      history.push('/main');
    }
  });

  return (
    <>
      <div className='auth__container'>
        <h2 className='auth__title'>Log in</h2>
        <form
          action='#'
          className='auth'
          title='Log in'
          onSubmit={handleSubmit}
          to='/main'
        >
          <input
            className='form__input-dark'
            placeholder='Email'
            type='email'
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className='form__input-dark'
            placeholder='Password'
            type='password'
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type='submit'
            className='form__submit-button_dark'
            onClick={handleSubmit}
          >
            Log in
          </button>
        </form>
        <Link className='auth__link' to='/signup'>
          Not a member yet? Sign up here!
        </Link>
      </div>
    </>
  );
}
export default Login; 