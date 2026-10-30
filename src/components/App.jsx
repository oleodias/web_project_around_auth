import { useEffect, useState } from 'react';
import Header from './Header/Header.jsx';
import Main from './Main/Main.jsx';
import Footer from './Footer/Footer.jsx';
import api from '../utils/api.js';
import CurrentUserContext from '../contexts/CurrentUserContext.js';

function App() {
  // O tipo inicial é o mesmo dos dados que vão chegar: um objeto para o
  // usuário, um array para os cartões, null para "nenhum pop-up aberto".
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [popup, setPopup] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // [] = só na montagem: uma solicitação de cada, nunca a cada renderização.
  useEffect(() => {
    api
      .getUserInfo()
      .then((userData) => setCurrentUser(userData))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    api
      .getInitialCards()
      .then((cardsData) => setCards(cardsData))
      .catch((error) => console.error(error));
  }, []);

  // selectedPopup, e não popup: o mesmo nome esconderia o estado acima.
  function handleOpenPopup(selectedPopup) {
    setPopup(selectedPopup);
  }

  function handleClosePopup() {
    setPopup(null);
  }

  function handleCardLike(card) {
    // card.isLiked é o estado atual; a API devolve o cartão atualizado, que
    // entra no lugar do antigo. map cria um array novo: nada é mutado.
    api
      .changeLikeStatus(card._id, card.isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((currentCard) =>
            currentCard._id === card._id ? newCard : currentCard,
          ),
        );
      })
      .catch((error) => console.error(error));
  }

  function handleCardDelete(card) {
    setIsLoading(true);
    api
      .deleteCard(card._id)
      .then(() => {
        // currentCard, e não card: o mesmo nome esconderia o cartão excluído,
        // e a comparação daria sempre false (a lista inteira sumiria).
        setCards((state) =>
          state.filter((currentCard) => currentCard._id !== card._id),
        );
        handleClosePopup();
      })
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false));
  }

  function handleUpdateUser(data) {
    setIsLoading(true);
    api
      .setUserInfo(data)
      .then((newData) => {
        setCurrentUser(newData);
        handleClosePopup();
      })
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false));
  }

  function handleUpdateAvatar(data) {
    setIsLoading(true);
    api
      .setUserAvatar(data)
      .then((newData) => {
        setCurrentUser(newData);
        handleClosePopup();
      })
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false));
  }

  function handleAddPlaceSubmit(data) {
    setIsLoading(true);
    api
      .addCard(data)
      .then((newCard) => {
        // O cartão novo entra no início, como no projeto anterior. A forma de
        // função usa a lista mais recente, mesmo que ela tenha mudado
        // enquanto a solicitação estava a caminho.
        setCards((state) => [newCard, ...state]);
        handleClosePopup();
      })
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false));
  }

  return (
    <CurrentUserContext.Provider
      value={{ currentUser, handleUpdateUser, handleUpdateAvatar, isLoading }}
    >
      <div className='page__content'>
        <Header />
        <Main
          cards={cards}
          popup={popup}
          onOpenPopup={handleOpenPopup}
          onClosePopup={handleClosePopup}
          onCardLike={handleCardLike}
          onCardDelete={handleCardDelete}
          onAddPlaceSubmit={handleAddPlaceSubmit}
        />
        <Footer />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
