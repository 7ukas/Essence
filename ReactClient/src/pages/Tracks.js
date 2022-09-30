import React from 'react';
import * as MdIcons from 'react-icons/md';

import Api from '../Api';
import Content from '../components/content/Content';

const Tracks = () => {
  return (
    <div className='page-container'>
      <Content
        contentName='track'
        icon={<MdIcons.MdAudiotrack className='icon' size={36}/>}
        contentUrl={Api.Tracks}
        usersContentUrl={Api.UsersTracks}
      />
    </div>
  );
}

export default Tracks;