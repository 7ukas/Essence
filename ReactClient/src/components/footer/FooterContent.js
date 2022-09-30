import React from 'react';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';
import * as MdIcons from 'react-icons/md';

const ICON_SIZE = 16;

export const FooterContent = [
  {
    path: '/',
    icon: <AiIcons.AiFillHome size={ICON_SIZE}/>,
    title: 'Home',
  },
  {
    path: '/albums',
    icon: <IoIcons.IoMdAlbums size={ICON_SIZE}/>,
    title: 'Albums',
  },
  {
    path: '/tracks',
    icon: <MdIcons.MdAudiotrack size={ICON_SIZE}/>,
    title: 'Tracks',
  },
  {
    path: '/playlists',
    icon: <RiIcons.RiPlayListFill size={ICON_SIZE}/>,
    title: 'Playlists',
  }
];