// import React, { useState } from 'react';
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import auth from '../utils/auth';

function Login(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const resetForm = () => {
    setEmail('');
    setPassword('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      return;
    }
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
      .then((data) => {
        localStorage.setItem('token', data.token);
        props.handleLogin(email);
      })
      .then(() => {
        resetForm();
      })
      .then(() => history.push('/'))
      .catch((err) => {
        console.log(err.message);
      });
  };

  // useEffect(() => {
  //   if (props.loggedIn) {
  //     history.push('/');
  //   }
  // });

	useEffect(() => {
    if (localStorage.getItem('token')) {
      history.push('/');
    }
  }, [history]);

  return (
    <>
      <div className='auth__container'>
        <h2 className='auth__title'>Log in</h2>
        <form
          action='#'
          className='auth'
          title='Log in'
          onSubmit={handleSubmit}
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
            to='/main'
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



// import React, { useState } from 'react';
// import { Link, useHistory } from 'react-router-dom';
// import auth from '../utils/auth';

// function Login(props) {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const history = useHistory();

//   const resetForm = () => {
//     setEmail('');
//     setPassword('');
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     auth.authorize(email, password)
//     .then((data) => {
//       if (!email || !password) {
//         throw new Error('400 - one or more of the fields were not provided');
//       }
//       if (!data) {
//         throw new Error('401 - the user with the specified email not found');
//       }
//       if (data.token) {
//         props.handleLogin();
//       }
//       })
//       .then((data) => {
//         localStorage.setItem('token', data.token);
//         props.onLogin(email);
//       })
//       .then(() => {
//         resetForm();
//       })
//       .then(() => history.push('/'))
//       .catch((err) => {
//         console.log(err);
//       });
//   };

//   return (
//     <>
//       <div className='auth__container'>
//         <h2 className='auth__title'>Log in</h2>
//         <form
//           action='#'
//           className='auth'
//           title='Log in'
//           onSubmit={handleSubmit}
//         >
//           <input
//             className='form__input-dark'
//             placeholder='Email'
//             type='email'
//             required
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//           <input
//             className='form__input-dark'
//             placeholder='Password'
//             type='password'
//             required
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//           <button
//             type='submit'
//             className='form__submit-button_dark'
//             onClick={handleSubmit}
//             to='/main'
//           >
//             Log in
//           </button>
//         </form>
//         <Link className='auth__link' to='/signup'>
//           Not a member yet? Sign up here!
//         </Link>
//       </div>
//     </>
//   );
// }
// export default Login; 



// import React from 'react';
// import { Link, withRouter } from 'react-router-dom';
// import auth from '../utils/auth';

// class Login extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       email: '',
//       password: '',
//     };
//     this.handleChange = this.handleChange.bind(this);
//     this.handleSubmit = this.handleSubmit.bind(this);
//   }
//   handleChange(e) {
//     const { name, value } = e.target;
//     this.setState({
//       [name]: value,
//     });
//   }
//   handleSubmit(e) {
//     e.preventDefault();
//     if (!this.state.email || !this.state.password) {
//       return;
//     }
//     auth
//       .authorize(this.state.email, this.state.password)
//       .then((data) => {
//         if (data.token) {
//           this.setState({ email: '', password: '' }, () => {
//             this.props.handleLogin();
//             this.props.history.push('/main');
//           });
//         }
//       })
//       .catch((err) => console.log(err));
//   }
//   render() {
//     return (
//       <div className='login'>
//         <p className='login__title'>Log in</p>
//         <form onSubmit={this.handleSubmit} className='login__form'>
//           <label for='email'>Email:</label>
//           <input
//             class='login__input'
//             required
//             id='email'
//             name='email'
//             type='email'
//             value={this.state.email}
//             onChange={this.handleChange}
//           />
//           <label for='password'>Password:</label>
//           <input
//             class='login__input'
//             required
//             id='password'
//             name='password'
//             type='password'
//             value={this.state.password}
//             onChange={this.handleChange}
//           />
//           <div className='login__button-container'>
//             <button
//               type='submit'
//               onSubmit={this.handleSubmit}
//               className='login__link'
//             >
//               Log in
//             </button>
//           </div>
//         </form>

//         <div className='login__signup'>
//           <Link to='/signup' className='signup__link'>
//             Not a member yet? Sign up here!
//           </Link>
//         </div>
//       </div>
//     );
//   }
// }

// export default withRouter(Login);