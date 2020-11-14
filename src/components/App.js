import React, { useState, useEffect } from 'react';
import { Route, Switch, withRouter, useHistory } from 'react-router-dom';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import Login from './Login';
import Register from './Register';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import PopupWithImage from './PopupWithImage';
import PopupWithForm from './PopupWithForm';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import api from '../utils/Api';
import auth from '../utils/auth';
import ProtectedRoute from './ProtectedRoute';
import InfoToolTip from './InfoToolTip';

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isInfoToolTipOpen, setIsInfoToolTipOpen] = useState(false);
  const [success, setSuccess] = useState(true);

  const [selectedCard, setSelectedCard] = useState();
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [tooltipMode, setTooltipMode] = useState(false);
  const history = useHistory();

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }
  function handleCardClick(card) {
    setSelectedCard(card);
  }
  function closeAllPopups() {
    setIsAddPlacePopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setSelectedCard(null);
    setIsInfoToolTipOpen(false);
  }

  function handleToolTip(success) {
    setTooltipMode(success);
    setIsInfoToolTipOpen(true);
  }

  function handleUpdateUser({ name, about }) {
    api
      .updateProfile(name, about)
      .then((updateProfile) => {
        setCurrentUser(updateProfile);
        setIsEditProfilePopupOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleUpdateAvatar({ avatar }) {
    api
      .updateAvatar(avatar)
      .then((updateProfile) => {
        setCurrentUser(updateProfile);
        setIsEditAvatarPopupOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleCardLike(card) {
    // Check one more time if this card was already liked
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    // Send a request to the API and getting the updated card data
    api
      .changeLikeCardStatus(card._id, isLiked)
      .then((newCard) => {
        // Create a new array based on the existing one and putting a new card into it
        const newCards = cards.map((c) => (c._id === card._id ? newCard : c));
        // Update the state
        setCards(newCards);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleCardDelete(card) {
    // const isOwn = card.owner._id === currentUser._id;
    api
      .deleteCard(card._id)
      .then(() => {
        setCards(cards.filter((c) => c._id !== card._id));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleAddPlace({ title, link }) {
    api.addNewCard({ title, link }).then((newCard) => {
      setCards([...cards, newCard]);
    });
    closeAllPopups();
  }

  useEffect(tokenCheck, []);

  useEffect(() => {
    if (loggedIn) {
      api
        .getUserInfo()
        .then((userProfile) => {
          setCurrentUser(userProfile);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [loggedIn]);

  useEffect(() => {
    if (loggedIn) {
      api
        .getInitialCards()
        .then((cards) => {
          setCards(cards);
        })
        // .then((data) => {
        //   setCards((cards) => [...cards, ...data]);
        // })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [loggedIn]);

  function handleSignup(email, password) {
    auth
      .register(email, password)
      .then((res) => {
        if (res && res.data) {
          setIsInfoToolTipOpen(true);
          setSuccess(true);
          setLoggedIn(true);
          setUserEmail(res.data.email);
          history.push('/');
        }
      })
      .catch((err) => {
        setIsInfoToolTipOpen(true);
        setSuccess(false);
      });
  }

  // function handleLogin({ email, password }) {
  //   auth
  //     .authorize(email, password)
  //     .then((data) => {
  //       if (data.token) {
  //         setLoggedIn(true);
  //         localStorage.setItem('token', data.token);
  //         history.push('/');
  //         tokenCheck();
  //       }
  //     })
  //     .catch((err) => {
  //       setIsInfoToolTipOpen(true);
  //       setSuccess(false);
  //     });
  // }
function handleLogin() {
  setLoggedIn(true);
}

  function handleLogout() {
    setLoggedIn(false);
    localStorage.removeItem('token');
    history.push('/signin');
  }

  function tokenCheck() {
    const token = localStorage.getItem('token');
    if (token) {
      auth
        .getContent(token)
        .then((res) => {
          if (res && res.data) {
            setLoggedIn(true);
            setUserEmail(res.data.email);
            history.push('/');
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  // useEffect(() => {
  //   if (!loggedIn) {
  //     const token = localStorage.getItem('token');
  //     if (token) {
  //       auth
  //         .getContent(token)
  //         .then((res) => {
  //           if (res) {
  //             setLoggedIn(true);
  //             setUserEmail(res.data.email);
  //             history.push('/');
  //           }
  //         })
  //         .catch((err) => {
  //           console.log(err);
  //         });
  //     }
  //   }
  // }, [history, loggedIn, userEmail]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Switch>
        <Route path='/signin'>
          <Header
            userEmail={userEmail}
            loggedIn={loggedIn}
            onLogout={handleLogout}
            link={{ description: 'Sign up', to: '/signup' }}
          />
          <Login
            loggedIn={loggedIn}
            success={tooltipMode}
            handleLogin={handleLogin}
            onLogout={handleLogout}
            userEmail={userEmail}
            setUserEmail={setUserEmail}
            isOpen={isInfoToolTipOpen}
            handleToolTip={handleToolTip}
          />
          <InfoToolTip
            isOpen={isInfoToolTipOpen}
            success={tooltipMode}
            onClose={closeAllPopups}
            loggedIn={loggedIn}
          />
        </Route>
        <Route path='/signup'>
          <Header
            userEmail={userEmail}
            loggedIn={loggedIn}
            link={{ description: 'Log in', to: '/signin' }}
          />
          <Register
            handleSignup={handleSignup}
            // handleLogin={handleLogin}
            // onLogout={handleLogout}
            handleToolTip={handleToolTip}
          />
          <InfoToolTip
            isOpen={isInfoToolTipOpen}
            success={tooltipMode}
            onClose={closeAllPopups}
            loggedIn={loggedIn}
          />
        </Route>
        <ProtectedRoute exact path='/' loggedIn={loggedIn}>
          <Header
            loggedIn={loggedIn}
            userEmail={userEmail}
            link={{ description: 'Log out', to: '#' }}
            // onLogout={handleLogout}
            // handleSignup={handleSignup}
            // success={tooltipMode}
            // handleLogin={handleLogin}
            // setUserEmail={setUserEmail}
            // isOpen={isInfoToolTipOpen}
          />
          <Main
            exact
            path='/'
            cards={cards}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            onCardClick={handleCardClick}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
            onClose={closeAllPopups}
            isEditProfilePopupOpen={isEditProfilePopupOpen}
            isAddPlacePopupOpen={isAddPlacePopupOpen}
            isEditAvatarPopupOpen={isEditAvatarPopupOpen}
            selectedCard={selectedCard}
            userEmail={userEmail}
            onLogout={handleLogout}
          />
        </ProtectedRoute>
      </Switch>

      {loggedIn && <Footer />}

      <EditProfilePopup
        isOpen={isEditProfilePopupOpen}
        onClose={closeAllPopups}
        onUpdateUser={handleUpdateUser}
      />
      <EditAvatarPopup
        isOpen={isEditAvatarPopupOpen}
        onClose={closeAllPopups}
        onUpdateAvatar={handleUpdateAvatar}
      />
      <AddPlacePopup
        isOpen={isAddPlacePopupOpen}
        onClose={closeAllPopups}
        onAddPlace={handleAddPlace}
      />
      <PopupWithForm
        name='confirmation'
        title='Are you sure?'
        isOpen={false}
        onClose={closeAllPopups}
      />
      <PopupWithImage onClose={closeAllPopups} card={selectedCard} />
    </CurrentUserContext.Provider>
  );
}

export default withRouter(App);


// import React, { useState, useEffect } from 'react';
// import { Route, Switch, withRouter, useHistory } from 'react-router-dom';
// import Header from './Header';
// import Main from './Main';
// import Footer from './Footer';
// import Login from './Login';
// import Register from './Register';
// import EditProfilePopup from './EditProfilePopup';
// import EditAvatarPopup from './EditAvatarPopup';
// import AddPlacePopup from './AddPlacePopup';
// import PopupWithImage from './PopupWithImage';
// import PopupWithForm from './PopupWithForm';
// import { CurrentUserContext } from '../contexts/CurrentUserContext';
// import api from '../utils/Api';
// // import auth from '../utils/auth';
// import * as auth from '../utils/auth';
// import ProtectedRoute from './ProtectedRoute';
// import InfoToolTip from './InfoToolTip';

// function App(props) {
//   const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
//   const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
//   const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
//   const [isInfoToolTipOpen, setIsInfoToolTipOpen] = useState(false);
//   const [success, setSuccess] = useState(true);

//   const [selectedCard, setSelectedCard] = useState();
//   const [currentUser, setCurrentUser] = useState({});
//   const [cards, setCards] = useState([]);
//   const [loggedIn, setLoggedIn] = useState(false);
//   const [userEmail, setUserEmail] = useState('');
//   const [tooltipMode, setTooltipMode] = useState(false);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [message, setMessage] = useState('');
//   const history = useHistory();

//   function handleEditProfileClick() {
//     setIsEditProfilePopupOpen(true);
//   }
//   function handleAddPlaceClick() {
//     setIsAddPlacePopupOpen(true);
//   }
//   function handleEditAvatarClick() {
//     setIsEditAvatarPopupOpen(true);
//   }
//   function handleCardClick(card) {
//     setSelectedCard(card);
//   }
//   function closeAllPopups() {
//     setIsAddPlacePopupOpen(false);
//     setIsEditProfilePopupOpen(false);
//     setIsEditAvatarPopupOpen(false);
//     setSelectedCard(null);
//     setIsInfoToolTipOpen(false);
//   }

//   function handleToolTip(success) {
//     setTooltipMode(success);
//     setIsInfoToolTipOpen(true);
//   }

//   function handleLogout() {
//     setLoggedIn(false);
//     localStorage.removeItem('token');
//     history.push('/signin');
//   }

//   function handleLogin() {
//     setLoggedIn(true);
//     setUserEmail(email);
//   }

//   function handleUpdateUser({ name, about }) {
//     api
//       .updateProfile(name, about)
//       .then((updateProfile) => {
//         setCurrentUser(updateProfile);
//         setIsEditProfilePopupOpen(false);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   function handleUpdateAvatar({ avatar }) {
//     api
//       .updateAvatar(avatar)
//       .then((updateProfile) => {
//         setCurrentUser(updateProfile);
//         setIsEditAvatarPopupOpen(false);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   function handleCardLike(card) {
//     // Check one more time if this card was already liked
//     const isLiked = card.likes.some((i) => i._id === currentUser._id);

//     // Send a request to the API and getting the updated card data
//     api
//       .changeLikeCardStatus(card._id, isLiked)
//       .then((newCard) => {
//         // Create a new array based on the existing one and putting a new card into it
//         const newCards = cards.map((c) => (c._id === card._id ? newCard : c));
//         // Update the state
//         setCards(newCards);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   function handleCardDelete(card) {
//     // const isOwn = card.owner._id === currentUser._id;
//     api
//       .deleteCard(card._id)
//       .then(() => {
//         setCards(cards.filter((c) => c._id !== card._id));
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   function handleAddPlace({ title, link }) {
//     api.addNewCard({ title, link }).then((newCard) => {
//       setCards([...cards, newCard]);
//     });
//     closeAllPopups();
//   }

//   // useEffect(tokenCheck, []);

//   useEffect(() => {
//     if (loggedIn) {
//       api
//         .getUserInfo()
//         .then((userProfile) => {
//           setCurrentUser(userProfile);
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     }
//   }, [loggedIn]);

//   useEffect(() => {
//     if (loggedIn) {
//       api
//         .getInitialCards()
//         .then((data) => {
//           setCards((cards) => [...cards, ...data]);
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     }
//   }, [loggedIn]);

//   const resetForm = () => {
//     setEmail('');
//     setPassword('');
//     setMessage('');
//   };

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       auth
//         .getContent(token)
//         .then((res) => {
//           if (res) {
//             setLoggedIn(true);
//             setUserEmail(res.data.email);
//             // history.push('/');
//           }
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     } else {
//       setLoggedIn(false);
//     }
//   }, []);

//   const handleRegisterSubmit = (e) => {
//     // const [email, password] = [e.target.email.value, e.target.password.value];

//     e.preventDefault();
//     auth
//       .register(email, password)
//       .then((res) => {
//             if (!res.data) {
//                 handleToolTip('error');
//                 throw new Error(`${res.message ? res.message : res.error}`);
//               }})
//               .then((res) => {
//                 setSuccess(true);
//                 history.push('/signin');
//               })
//               .then((res) => {
//                 handleToolTip('success');
//                 return res;
//               })
//             // .then(resetForm)
//             .catch(err => {
//               setIsInfoToolTipOpen(true);
//               setSuccess(false);
//               console.log(err)
//             });
//       // .then((res) => {
//       //   if (res && res.data) {
//       //     setIsInfoToolTipOpen(true);
//       //     setSuccess(true);
//       //     setLoggedIn(true);
//       //     setUserEmail(res.data.email);
//       //     history.push('/');
//       //   }
//       // })
//       // .catch((err) => {
//       //   setIsInfoToolTipOpen(true);
//       //   setSuccess(false);
//       // });
//   }

//   const handleLoginSubmit = (e) => {
//         e.preventDefault();
//         // const [email, password] = [e.target.email.value, e.target.password.value];

//     auth
//       .authorize(email, password)
//       .then((data) => {
//         if (data) {
//           handleLogin();
//           history.push('/');
//         } else {
//           resetForm();
//           if (!email || !password) {
//             throw new Error(
//               '400 - one or more of the fields were not provided'
//             );
//           }
//           if (!data) {
//             throw new Error(
//               '401 - the user with the specified email not found'
//             );
//           }
//         }
//       })
//       .catch((err) => setMessage(err.message));
//       // .then((data) => {
//       //   if (data.token) {
//       //     setLoggedIn(true);
//       //     localStorage.setItem('token', data.token);
//       //     history.push('/');
//       //     tokenCheck();
//       //   }
//       // })
//       // .catch((err) => {
//       //   setIsInfoToolTipOpen(true);
//       //   setSuccess(false);
//       // });
//   }




//   // function tokenCheck() {
//   //   const token = localStorage.getItem('token');
//   //   if (token) {
//   //     auth
//   //       .getContent(token)
//   //       .then((res) => {
//   //         if (res && res.data) {
//   //           setLoggedIn(true);
//   //           setUserEmail(res.data.email);
//   //           history.push('/');
//   //         }
//   //       })
//   //       .catch((err) => {
//   //         console.log(err);
//   //       });
//   //   }
//   // }

//   // useEffect(() => {
//   //   if (!loggedIn) {
//   //     const token = localStorage.getItem('token');
//   //     if (token) {
//   //       auth
//   //         .getContent(token)
//   //         .then((res) => {
//   //           if (res) {
//   //             setLoggedIn(true);
//   //             setUserEmail(res.data.email);
//   //             history.push('/');
//   //           }
//   //         })
//   //         .catch((err) => {
//   //           console.log(err);
//   //         });
//   //     }
//   //   }
//   // }, [history, loggedIn, userEmail]);

//   return (
//     <CurrentUserContext.Provider value={currentUser}>
//       <Switch>
//         <Route path='/signin'>
//           <Header
//             userEmail={userEmail}
//             loggedIn={loggedIn}
//             onLogout={handleLogout}
//             link={{ description: 'Sign up', to: '/signup' }}
//           />
//           <Login
//             loggedIn={loggedIn}
//             success={tooltipMode}
//             handleLogin={handleLogin}
//             handleLoginSubmit={handleLoginSubmit}
//             onLogout={handleLogout}
//             userEmail={userEmail}
//             setUserEmail={setUserEmail}
//             isOpen={isInfoToolTipOpen}
//             handleToolTip={handleToolTip}
//             password={password}
//             setPassword={setPassword}
//             setSuccess={setSuccess}
//           />
//           <InfoToolTip
//             isOpen={isInfoToolTipOpen}
//             success={tooltipMode}
//             onClose={closeAllPopups}
//             loggedIn={loggedIn}
//           />
//         </Route>
//         <Route path='/signup'>
//           <Header
//             userEmail={userEmail}
//             loggedIn={loggedIn}
//             link={{ description: 'Log in', to: '/signin' }}
//           />
//           <Register
//             handleRegisterSubmit={handleRegisterSubmit}
//             handleLogin={handleLogin}
//             success={tooltipMode}
//             onLogout={handleLogout}
//             handleToolTip={handleToolTip}
//             userEmail={userEmail}
//             setUserEmail={setUserEmail}
//             email={email}
//             password={password}
//             setPassword={setPassword}
//             setSuccess={setSuccess}
//           />
//           <InfoToolTip
//             isOpen={isInfoToolTipOpen}
//             success={tooltipMode}
//             onClose={closeAllPopups}
//             loggedIn={loggedIn}
//           />
//         </Route>
//         <ProtectedRoute exact path='/' loggedIn={loggedIn}>
//           <Header
//             loggedIn={loggedIn}
//             userEmail={userEmail}
//             link={{ description: 'Log out', to: '#' }}
//             // onLogout={handleLogout}
//             // handleSignup={handleSignup}
//             // success={tooltipMode}
//             // handleLogin={handleLogin}
//             // setUserEmail={setUserEmail}
//             // isOpen={isInfoToolTipOpen}
//           />
//           <Main
//             exact
//             path='/'
//             cards={cards}
//             onEditProfile={handleEditProfileClick}
//             onAddPlace={handleAddPlaceClick}
//             onEditAvatar={handleEditAvatarClick}
//             onCardClick={handleCardClick}
//             onCardLike={handleCardLike}
//             onCardDelete={handleCardDelete}
//             onClose={closeAllPopups}
//             isEditProfilePopupOpen={isEditProfilePopupOpen}
//             isAddPlacePopupOpen={isAddPlacePopupOpen}
//             isEditAvatarPopupOpen={isEditAvatarPopupOpen}
//             selectedCard={selectedCard}
//             userEmail={userEmail}
//             onLogout={handleLogout}
//           />
//         </ProtectedRoute>
//       </Switch>

//       {loggedIn && <Footer />}

//       <EditProfilePopup
//         isOpen={isEditProfilePopupOpen}
//         onClose={closeAllPopups}
//         onUpdateUser={handleUpdateUser}
//       />
//       <EditAvatarPopup
//         isOpen={isEditAvatarPopupOpen}
//         onClose={closeAllPopups}
//         onUpdateAvatar={handleUpdateAvatar}
//       />
//       <AddPlacePopup
//         isOpen={isAddPlacePopupOpen}
//         onClose={closeAllPopups}
//         onAddPlace={handleAddPlace}
//       />
//       <PopupWithForm
//         name='confirmation'
//         title='Are you sure?'
//         isOpen={false}
//         onClose={closeAllPopups}
//       />
//       <PopupWithImage onClose={closeAllPopups} card={selectedCard} />
//     </CurrentUserContext.Provider>
//   );
// }

// export default withRouter(App);


// import React, { useState, useEffect } from 'react';
// import { Route, Switch, withRouter, useHistory } from 'react-router-dom';
// import Header from './Header';
// import Main from './Main';
// import Footer from './Footer';
// import Login from './Login';
// import Register from './Register';
// import EditProfilePopup from './EditProfilePopup';
// import EditAvatarPopup from './EditAvatarPopup';
// import AddPlacePopup from './AddPlacePopup';
// import PopupWithImage from './PopupWithImage';
// import PopupWithForm from './PopupWithForm';
// import { CurrentUserContext } from '../contexts/CurrentUserContext';
// import api from '../utils/Api';
// import auth from '../utils/auth';
// import ProtectedRoute from './ProtectedRoute';
// import InfoToolTip from './InfoToolTip';

// function App() {
//   const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
//   const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
//   const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
//   const [isInfoToolTipOpen, setIsInfoToolTipOpen] = useState(false);
//   const [success, setSuccess] = useState(true);

//   const [selectedCard, setSelectedCard] = useState();
//   const [currentUser, setCurrentUser] = useState({});
//   const [cards, setCards] = useState([]);
//   const [loggedIn, setLoggedIn] = useState(false);
//   const [userEmail, setUserEmail] = useState('');
//   const [tooltipMode, setTooltipMode] = useState(false);
//   const history = useHistory();

//   function handleEditProfileClick() {
//     setIsEditProfilePopupOpen(true);
//   }
//   function handleAddPlaceClick() {
//     setIsAddPlacePopupOpen(true);
//   }
//   function handleEditAvatarClick() {
//     setIsEditAvatarPopupOpen(true);
//   }
//   function handleCardClick(card) {
//     setSelectedCard(card);
//   }
//   function closeAllPopups() {
//     setIsAddPlacePopupOpen(false);
//     setIsEditProfilePopupOpen(false);
//     setIsEditAvatarPopupOpen(false);
//     setSelectedCard(null);
//     setIsInfoToolTipOpen(false);
//   }

//   function handleToolTip(mode) {
//     setTooltipMode(mode);
//     setIsInfoToolTipOpen(true);
//   }

//   function handleUpdateUser({ name, about }) {
//     api
//       .updateProfile(name, about)
//       .then((updateProfile) => {
//         setCurrentUser(updateProfile);
//         setIsEditProfilePopupOpen(false);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   function handleUpdateAvatar({ avatar }) {
//     api
//       .updateAvatar(avatar)
//       .then((updateProfile) => {
//         setCurrentUser(updateProfile);
//         setIsEditAvatarPopupOpen(false);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   function handleCardLike(card) {
//     // Check one more time if this card was already liked
//     const isLiked = card.likes.some((i) => i._id === currentUser._id);

//     // Send a request to the API and getting the updated card data
//     api
//       .changeLikeCardStatus(card._id, isLiked)
//       .then((newCard) => {
//         // Create a new array based on the existing one and putting a new card into it
//         const newCards = cards.map((c) => (c._id === card._id ? newCard : c));
//         // Update the state
//         setCards(newCards);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   function handleCardDelete(card) {
//     // const isOwn = card.owner._id === currentUser._id;
//     api
//       .deleteCard(card._id)
//       .then(() => {
//         setCards(cards.filter((c) => c._id !== card._id));
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   function handleAddPlace({ title, link }) {
//     api.addNewCard({ title, link }).then((newCard) => {
//       setCards([...cards, newCard]);
//     });
//     closeAllPopups();
//   }

//   useEffect(tokenCheck, []);

//   useEffect(() => {
//     if (loggedIn) {
//       api
//         .getUserInfo()
//         .then((userProfile) => {
//           setCurrentUser(userProfile);
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     }
//   }, [loggedIn]);

//   useEffect(() => {
//     if (loggedIn) {
//       api
//         .getInitialCards()
//         .then((data) => {
//           setCards((cards) => [...cards, ...data]);
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     }
//   }, [loggedIn]);

//   function handleSignup({ email, password }) {
//     auth
//       .signup(email, password)
//       .then((res) => {
//         if (res && res.data) {
//           setIsInfoToolTipOpen(true);
//           setSuccess(true);
//           setLoggedIn(true);
//           setUserEmail(res.data.email);
//           history.push('/');
//         }
//       })
//       .catch((err) => {
//         setIsInfoToolTipOpen(true);
//         setSuccess(false);
//       });
//   }

//   function handleLogin({ email, password }) {
//     auth
//       .authorize(email, password)
//       .then((data) => {
//         if (data.token) {
//           setLoggedIn(true);
//           localStorage.setItem('token', data.token);
//           history.push('/');
//           tokenCheck();
//         }
//       })
//       .catch((err) => {
//         setIsInfoToolTipOpen(true);
//         setSuccess(false);
//       });
//   }

//   function handleLogout() {
//     setLoggedIn(false);
//     localStorage.removeItem('token');
//     history.push('/signin');
//   }

//   function tokenCheck() {
//     const token = localStorage.getItem('token');
//     if (token) {
//       auth
//         .getContent(token)
//         .then((res) => {
//           if (res && res.data) {
//             setLoggedIn(true);
//             setUserEmail(res.data.email);
//             history.push('/');
//           }
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     }
//   }

//   // useEffect(() => {
//   //   if (!loggedIn) {
//   //     const token = localStorage.getItem('token');
//   //     if (token) {
//   //       auth
//   //         .getContent(token)
//   //         .then((res) => {
//   //           if (res) {
//   //             setLoggedIn(true);
//   //             setUserEmail(res.data.email);
//   //             history.push('/');
//   //           }
//   //         })
//   //         .catch((err) => {
//   //           console.log(err);
//   //         });
//   //     }
//   //   }
//   // }, [history, loggedIn, userEmail]);

//   return (
//     <CurrentUserContext.Provider value={currentUser}>
//       <Switch>
//         <Route path='/signin'>
//           <Header
//             userEmail={userEmail}
//             loggedIn={loggedIn}
//             onLogout={handleLogout}
//             link={{ description: 'Sign up', to: '/signup' }}
//           />
//           <Login
//             loggedIn={loggedIn}
//             mode={tooltipMode}
//             handleLogin={handleLogin}
//             onLogout={handleLogout}
//             userEmail={userEmail}
//             setUserEmail={setUserEmail}
//             isOpen={isInfoToolTipOpen}
//             handleToolTip={handleToolTip}
//           />
//           <InfoToolTip
//             isOpen={isInfoToolTipOpen}
//             mode={tooltipMode}
//             onClose={closeAllPopups}
//             loggedIn={loggedIn}
//           />
//         </Route>
//         <Route path='/signup'>
//           <Header
//             userEmail={userEmail}
//             loggedIn={loggedIn}
//             link={{ description: 'Log in', to: '/signin' }}
//           />
//           <Register
//             handleSignup={handleSignup}
//             // handleLogin={handleLogin}
//             // onLogout={handleLogout}
//             handleToolTip={handleToolTip}
//           />
//           <InfoToolTip
//             isOpen={isInfoToolTipOpen}
//             mode={tooltipMode}
//             onClose={closeAllPopups}
//             loggedIn={loggedIn}
//           />
//         </Route>
//         <ProtectedRoute exact path='/' loggedIn={loggedIn}>
//           <Header
//             loggedIn={loggedIn}
//             userEmail={userEmail}
//             link={{ description: 'Log out', to: '#' }}
//             // onLogout={handleLogout}
//             // handleSignup={handleSignup}
//             // mode={tooltipMode}
//             // handleLogin={handleLogin}
//             // setUserEmail={setUserEmail}
//             // isOpen={isInfoToolTipOpen}
//           />
//           <Main
//             exact
//             path='/'
//             cards={cards}
//             onEditProfile={handleEditProfileClick}
//             onAddPlace={handleAddPlaceClick}
//             onEditAvatar={handleEditAvatarClick}
//             onCardClick={handleCardClick}
//             onCardLike={handleCardLike}
//             onCardDelete={handleCardDelete}
//             onClose={closeAllPopups}
//             isEditProfilePopupOpen={isEditProfilePopupOpen}
//             isAddPlacePopupOpen={isAddPlacePopupOpen}
//             isEditAvatarPopupOpen={isEditAvatarPopupOpen}
//             selectedCard={selectedCard}
//           />
//         </ProtectedRoute>
//       </Switch>

//       {loggedIn && <Footer />}

//       <EditProfilePopup
//         isOpen={isEditProfilePopupOpen}
//         onClose={closeAllPopups}
//         onUpdateUser={handleUpdateUser}
//       />
//       <EditAvatarPopup
//         isOpen={isEditAvatarPopupOpen}
//         onClose={closeAllPopups}
//         onUpdateAvatar={handleUpdateAvatar}
//       />
//       <AddPlacePopup
//         isOpen={isAddPlacePopupOpen}
//         onClose={closeAllPopups}
//         onAddPlace={handleAddPlace}
//       />
//       <PopupWithForm
//         name='confirmation'
//         title='Are you sure?'
//         isOpen={false}
//         onClose={closeAllPopups}
//       />
//       <PopupWithImage onClose={closeAllPopups} card={selectedCard} />
//     </CurrentUserContext.Provider>
//   );
// }

// export default withRouter(App);