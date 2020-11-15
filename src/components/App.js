import React, { useState, useEffect } from 'react';
import { Route, Switch, withRouter, useHistory, Redirect } from 'react-router-dom';
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
        .then((data) => {
          if (data) {
            setCards((cards) => [...cards, ...data]);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [loggedIn]);

function handleLogin() {
  setLoggedIn(true);
}

function handleLogout() {
  localStorage.removeItem('token');
  setLoggedIn(false);
  history.push('/signin');
}

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      auth
        .getContent(token)
        .then((res) => {
          setLoggedIn(true);
          setUserEmail(res.data.email);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setLoggedIn(false);
    }
  }, [loggedIn, userEmail]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Switch>
        <Route exact path='/signin'>
          <Header
            loggedIn={loggedIn}
            link={{ description: 'Sign up', to: '/signup' }}
          />
          <Login
            loggedIn={loggedIn}
            success={tooltipMode}
            handleLogin={handleLogin}
            onLogout={handleLogout}
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
        <Route exact path='/signup'>
          <Header
            userEmail={userEmail}
            loggedIn={loggedIn}
            link={{ description: 'Log in', to: '/signin' }}
          />
          <Register
            handleLogin={handleLogin}
            setUserEmail={setUserEmail}
            handleToolTip={handleToolTip}
          />
          <InfoToolTip
            isOpen={isInfoToolTipOpen}
            success={tooltipMode}
            onClose={closeAllPopups}
            loggedIn={loggedIn}
          />
        </Route>
        <Route exact path='/'>
          {loggedIn ? <Redirect to='/main' /> : <Redirect to='/signin' />}
        </Route>
        <Route path='/main'>
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

          <Header
            loggedIn={loggedIn}
            userEmail={userEmail}
            link={{ description: 'Log out', to: '/signin' }}
            onLogout={handleLogout}
          />
          <ProtectedRoute
            path='/main'
            loggedIn={loggedIn}
            component={Main}
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
            cards={cards}
          />
        </Route>
      </Switch>

      {loggedIn && <Footer />}
    </CurrentUserContext.Provider>
  );
}

export default withRouter(App);