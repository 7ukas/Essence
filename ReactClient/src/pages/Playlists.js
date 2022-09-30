import React from 'react';
import * as RiIcons from 'react-icons/ri';

import Api from '../Api';
import Content from '../components/content/Content';

const Albums = () => {
  return (
    <div className='page-container'>
      <Content
        contentName='playlist'
        icon={<RiIcons.RiPlayListFill className='icon' size={36}/>}
        contentUrl={Api.Playlists}
        usersContentUrl={Api.UsersPlaylists}
      />
    </div>
  );
}

export default Albums;