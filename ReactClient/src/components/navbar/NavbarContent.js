import React from 'react';
import { Link } from 'react-router-dom';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';
import * as MdIcons from 'react-icons/md';

import { UserContext } from '../../context/UserContext';
import { ModalContext } from '../../context/ModalContext';

import './Navbar.css';

const ICON_SIZE = 26;

const NavbarContent = () => {
  let content = [
    {
      path: '#',
      icon: <RiIcons.RiLoginBoxFill size={ICON_SIZE}/>,
      title: 'Register / Log in',
      modal: 'login'
    },
    {
      path: '/',
      icon: <AiIcons.AiFillHome size={ICON_SIZE}/>,
      title: 'Home'
    },
    {
      path: '/albums',
      icon: <IoIcons.IoMdAlbums size={ICON_SIZE}/>,
      title: 'Albums'
    },
    {
      path: '/tracks',
      icon: <MdIcons.MdAudiotrack size={ICON_SIZE}/>,
      title: 'Tracks'
    },
    {
      path: '/playlists',
      icon: <RiIcons.RiPlayListFill size={ICON_SIZE}/>,
      title: 'Playlists'
    }
  ];

  const { user } = React.useContext(UserContext);

  if (user.userId !== undefined) {
    content = content.slice(1);
  }

  /* Modal Context */
  const { setModal } = React.useContext(ModalContext);

  const handleModal = (modal) => {
    setModal({ show: modal })
  }

  return (
    <ul className='w-100 p-0'>
      {content.map(item => (
        <li key={item.title} className='navbar-menu-content'>
          <Link 
            to={item.path} 
            onClick={() => {
              if (item.modal !== undefined) {
                handleModal(item.modal);
              }
            }}
          >
            {item.icon}
            <span className='ms-3'>{item.title}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default NavbarContent;