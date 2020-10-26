import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import auth from '../utils/auth';

function Register(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const resetForm = () => {
    setEmail('');
    setPassword('');
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   auth
  //     .register({ email, password })
  //     .then((res, data) => {
  //       if (!data) {
  //         props.handleToolTip('error');
  //         throw new Error(`400 - ${res.message ? res.message : res.error}`);
  //       }
  //     })
  //     .then((res) => {
  //       history.push('/signin');
  //       return res;
  //     })
  //     .then((res) => {
  //       props.handleToolTip('success');
  //       return res;
  //     })
  //     .then(resetForm)
  //     .then(() => {
  //       history.push('/signin');
  //       props.onSuccess();
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    auth
      .register({ email, password })
      .then(resetForm)
      .then(() => {
        history.push('/signin');
        props.onSuccess();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div className='auth__container'>
        <h2 className='auth__title'>Sign up</h2>
        <form
          action='#'
          className='auth'
          title='Sign up'
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
            onSubmit={handleSubmit}
            to='/main'
          >
            Sign up
          </button>
        </form>
        <Link className='auth__link' to='/signin'>
          Already a member? Log in here!
        </Link>
      </div>
    </>
  );
}
export default Register; 


// import React from 'react';
// import { Link, withRouter } from 'react-router-dom';
// import api from '../utils/Api';

// class Register extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       email: '',
//       password: ''
//     };
//     this.handleChange = this.handleChange.bind(this);
//     this.handleSubmit = this.handleSubmit.bind(this);
//   }
//   handleChange = (e) => {
//     const { name, value } = e.target;
//     this.setState({
//       [name]: value
//     });
//   }
//   handleSubmit = (e) => {
//     e.preventDefault();
//       auth
//         .register(
//           this.state.email,
//           this.state.password,
//         )
//         .then((res) => {
//           if (res) {
//             this.props.history.push('/login');
//           } else {
//             console.log('Something went wrong.');
//           }
//         });  
//     }
//   render(){
//     return (
//       <div className='register'>
//         <p className='register__welcome'>Sign up</p>
//         <form onSubmit={this.handleSubmit} className='register__form'>
//           <label for='email'>Email:</label>
//           <input
//             id='email'
//             name='email'
//             type='email'
//             value={this.state.email}
//             onChange={this.handleChange}
//           />
//           <label for='password'>Password:</label>
//           <input
//             id='password'
//             name='password'
//             type='password'
//             value={this.state.password}
//             onChange={this.handleChange}
//           />
//           <div className='register__button-container'>
//             <button
//               type='submit'
//               onSubmit={this.handleSubmit}
//               className='register__link'
//             >
//               Sign up
//             </button>
//           </div>
//         </form>

//         <div className='register__signin'> 
//           <Link to='login' className='register__login-link'>
//             Already a member? Log in here!
//           </Link>
//         </div>
//       </div>
//     );
//   }
// }

// export default withRouter(Register);