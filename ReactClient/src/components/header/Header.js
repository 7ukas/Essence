import React from 'react';
import { Link } from 'react-router-dom';
import * as BsIcons from 'react-icons/bs';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';
import * as MdIcons from 'react-icons/md';

import { useDebounce } from 'use-lodash-debounce';


import { UserContext } from '../../context/UserContext';
import { ModalContext } from '../../context/ModalContext';
import ProfileMenuContent from './ProfileMenuContent';
import SearchBar from '../search-bar/SearchBar';
import FetchData from '../fetch-functions/FetchData';
import Api from '../../Api';

import './Header.css';

const ICONS = {
  artists: (<BsIcons.BsFillPersonFill size={24}/>),
  albums: (<IoIcons.IoMdAlbums size={24}/>),
  tracks: (<MdIcons.MdAudiotrack size={24}/>),
  playlists: (<RiIcons.RiPlayListFill size={24}/>)
}

const Header = () => {
  /* User & Modal Context */
  const { user } = React.useContext(UserContext);
  const { setModal } = React.useContext(ModalContext);

  const isLoggedIn = user.userId !== undefined;

  const showLoginModal = () => {
    setModal({ show: 'login' });
  }

  const [profileMenu, setProfileMenu] = React.useState(false);

  /* Search */
  const [searchMenu, setSearchMenu] = React.useState(false);
  const [searchBarFocused, setSearchBarFocused] = React.useState(false);
  const [menuActive, setMenuActive] = React.useState(false);

  const [searchedWord, setSearchedWord] = React.useState('');
  const debounceSearch = useDebounce(searchedWord, 400);

  const [content, setContent] = React.useState([]);
  const [contentType, setContentType] = React.useState('artists');
  
  const handleSearch = (value) => {
    setSearchedWord(value);
  }

  const closeSearchMenu = () => {
    setSearchedWord('');
    setSearchMenu(false);

    setTimeout(() => {
      window.location.reload();
    }, 1000)
  }

  React.useEffect(() => {
    if (searchedWord.length > 1) {
      const contentUrl = `${Api.Music}?q=${searchedWord}`;
      FetchData(contentUrl, setContent);
    }
  }, [debounceSearch])
  
  React.useEffect(() => {
      setSearchMenu(
        searchedWord.length > 1 &&
        Object.keys(content).length > 0 &&
        (searchBarFocused || menuActive)
      );
  }, [searchedWord, searchBarFocused, menuActive, content])

  return(
    <header>
      <div className='header'>
        <SearchBar 
          className='header-search-bar'
          searchedWord={searchedWord} 
          placeholder={'Search artists, albums, tracks, playlists'}
          handleSearch={handleSearch}
          handleFocus={setSearchBarFocused}
        />

        {searchMenu &&
          <div className='search-menu active'>
            <ul 
              className='w-100 p-0' 
              onMouseEnter={() => setMenuActive(true)}
              onMouseLeave={() => setMenuActive(false)}
            >
              <li className='search-menu-header'>
                <Link to='#' onClick={() => setContentType('artists')}>{ICONS.artists}</Link>
                <Link to='#' onClick={() => setContentType('albums')}>{ICONS.albums}</Link>
                <Link to='#' onClick={() => setContentType('tracks')}>{ICONS.tracks}</Link>
                <Link to='#' onClick={() => setContentType('playlists')}>{ICONS.playlists}</Link>
              </li>

              {Object.keys(content).filter(key => key.includes(contentType)).map(key => (
                [...Array(content[key].length).keys()].map(i => (
                    <li key={`${content[key][i].id}-${content[key][i].name}`} className='search-menu-content'>
                      <Link to={`${key}/${content[key][i].id}`} onClick={closeSearchMenu}>
                        {ICONS[key]}
                        <span className='ms-2'>{content[key][i].name}</span>
                      </Link>
                    </li>
                ))
              ))}
            </ul>
          </div>
        }

        <Link className='title' to='/'>
          <span>essence</span>
        </Link>

        {isLoggedIn ? 
          <>
          <Link className='profile-menu-button' to='#' 
            onMouseEnter={() => setProfileMenu(true)}
          >
            <RiIcons.RiAccountCircleFill size={42} className='profile-picture'/>
          </Link>

          {profileMenu && 
            <div className='profile-menu active'>
              <ProfileMenuContent handleShowMenu={setProfileMenu}/>
            </div>
          }
          </> : 
          <Link to='#' className='login-button' onClick={showLoginModal}>
            <span className='ms-3'>Register / Log in</span>
            <RiIcons.RiLoginBoxFill size={26}/>
          </Link>
        }
      </div>
    </header>
  )
}

export default Header;