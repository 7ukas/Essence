import React from 'react';
import { Link } from 'react-router-dom';

import axios from 'axios';
import PropTypes from 'prop-types';

import { ModalContext } from '../../context/ModalContext';
import Api from '../../Api';

const CONTENT_CLASS = 'profile-menu-content';
const SEPERATOR_CLASS = 'profile-menu-seperator'

const ProfileMenuContent = ({ handleShowMenu }) => {
  let content = [
    {
      path: '/profile',
      class: CONTENT_CLASS,
      title: 'Profile'
    },
    {
      path: '/profile/library',
      class: CONTENT_CLASS,
      title: 'My Library'
    },
    { 
      path: '#', 
      class: SEPERATOR_CLASS, 
      title: '' 
    },
    {
      path: '#',
      class: CONTENT_CLASS,
      title: 'Settings',
      settings: true
    },
    {
      path: '/',
      class: CONTENT_CLASS,
      title: 'Log out',
      logout: true
    },
  ];

  /* User & Modal Context */
  const { setModal } = React.useContext(ModalContext);

  const showSettingsModal = () => {
    setModal({ show: 'register', update: true });
  }

  const logout = async () => {
    const logoutUrl = `${Api.Users}/logout`;
    await axios.delete(logoutUrl, { withCredentials: true });
    
    window.location.reload();
  }

  return (
    <ul className='w-100 p-0' onMouseLeave={() => handleShowMenu(false)}>
      {content.map((item, index) => {
        return (
          <li key={index} className={item.class} onClick={() => handleShowMenu(false)}>
            <Link to={item.path} 
              onClick={() => {
                if (item.settings) showSettingsModal();
                else if (item.logout) logout();
              }}
            >
              <span className='ms-2'>{item.title}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  )
}

ProfileMenuContent.propTypes = {
  handleShowMenu: PropTypes.func.isRequired
}

export default ProfileMenuContent;