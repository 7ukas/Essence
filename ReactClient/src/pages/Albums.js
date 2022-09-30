import React from 'react';
import * as IoIcons from 'react-icons/io';

import Api from '../Api';
import Content from '../components/content/Content';

const Albums = () => {
  return (
    <div className='page-container'>
      <Content
        contentName='album'
        icon={<IoIcons.IoMdAlbums className='icon' size={36}/>}
        contentUrl={Api.Albums}
        usersContentUrl={Api.UsersAlbums}
      />
    </div>
  );
}

export default Albums;