import React from 'react';
import { useParams } from 'react-router-dom';
import * as RiIcons from 'react-icons/ri';
import * as MdIcons from 'react-icons/md';

import Api from '../Api';
import SingularContent from '../components/singular-content/SingularContent';

const Playlist = () => {
  const { id } = useParams();

  return (
    <div className='page-container'>
      <SingularContent
        id={id}
        icon={<RiIcons.RiPlayListFill className='icon' size={36}/>}
        subIcon={<MdIcons.MdAudiotrack className='icon' size={26}/>}
        contentName='Playlist' subContentName='Tracks'
        contentUrl={Api.Playlists} subContentUrl={Api.PlaylistsTracks} usersContentUrl={Api.UsersTracks}
      />
    </div>
  );
}

export default Playlist;