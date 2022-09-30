import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import axios from 'axios';

import { UserContext } from "./context/UserContext";
import { ModalContext } from "./context/ModalContext";
import { PopUpContext } from "./context/PopUpContext";

import LoginModal from './components/modals/LoginModal';
import RegisterModal from './components/modals/RegisterModal';
import PlaylistsModal from './components/modals/PlaylistsModal';
import PlaylistSettingsModal from './components/modals/PlaylistSettingsModal';

import PopUp from './components/pop-up/PopUp';
import Header from './components/header/Header';
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import Api from './Api';

import ErrorPage from './pages/Error';
import ProfileOverview from './pages/ProfileOverview';
import ProfileMyLibrary from './pages/ProfileMyLibrary';
import Home from './pages/Home';
import Artist from './pages/Artist';
import Albums from './pages/Albums';
import Album from './pages/Album';
import Tracks from './pages/Tracks';
import Track from './pages/Track';
import Playlists from './pages/Playlists';
import Playlist from './pages/Playlist';

import './App.css';

const App = () => {
  /* Navbar Menu */
  const [isMenuExpanded, setIsMenuExpanded] = React.useState(false);

  const handleIsMenuExpanded = (value) => {
    setIsMenuExpanded(value);
  }

  /* User Context */
  const [user, setUser] = React.useState({});
  
  const fetchUser = async () => {
    const url = `${Api.Users}/login`;

    const userData = 
      await axios.get(url, { withCredentials: true })
      .then(response => {return response.data;});
    
    setUser(userData);
  }

  React.useEffect(() => {
    fetchUser();
  }, [])

  const userObject = React.useMemo(() => ({ user, setUser }), [user]);

  /* Modal Context */
  const [modal, setModal] = React.useState({ show: '' })

  const modalObject = React.useMemo(() => ({ modal, setModal }), [modal]);

  /* Pop Up Context */
  const [popUp, setPopUp] = React.useState({
    pop: false,
    notification: ''
  });

  const popUpObject = React.useMemo(() => ({ popUp, setPopUp }), [popUp]);

  return (
    <>
      <Router>
        <UserContext.Provider value={userObject}>
          <ModalContext.Provider value={modalObject}>
            <PopUpContext.Provider value={popUpObject}>

              <Header/>
              <Navbar handleIsMenuExpanded={handleIsMenuExpanded}/>

              <div className={isMenuExpanded ? 'page-margin expanded' : 'page-margin'}>
                <Routes>
                  <Route path='/' exact element={<Home/>} />
                  <Route path='/profile' element={<ProfileOverview/>} />
                  <Route path='/profile/library' element={<ProfileMyLibrary/>} />
                  <Route path='/artists/:id' element={<Artist/>} />
                  <Route path='/albums' element={<Albums/>} />
                  <Route path='/albums/:id' element={<Album/>} />
                  <Route path='/tracks' element={<Tracks/>} />
                  <Route path='/tracks/:id' element={<Track/>} />
                  <Route path='/playlists' element={<Playlists/>} />
                  <Route path='/playlists/:id' element={<Playlist/>} />
                  <Route path='/*' element={<ErrorPage/>} />
                </Routes>

                <Footer/>
              </div>


              {modal.show === 'login' && <LoginModal setModal={setModal}/>}
              {modal.show === 'register' && <RegisterModal update={modal.update} setModal={setModal}/>}
              {modal.show === 'playlists' && <PlaylistsModal track={modal.track} setModal={setModal}/>}
              {modal.show === 'playlist-settings' && <PlaylistSettingsModal playlist={modal.playlist} setModal={setModal}/>}

              {popUp.pop && <PopUp notification={popUp.notification} setPopUp={setPopUp}/>}

            </PopUpContext.Provider>
          </ModalContext.Provider>
        </UserContext.Provider>
      </Router>
    </>
  );
}

export default App;