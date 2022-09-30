import React from 'react';
import { useParams } from 'react-router-dom';
import * as IoIcons from 'react-icons/io';
import * as MdIcons from 'react-icons/md';

import Api from '../Api';
import SingularContent from '../components/singular-content/SingularContent';

const Album = () => {
  const { id } = useParams();

  return (
    <div className='page-container'>
      <SingularContent
        id={id}
        icon={<IoIcons.IoMdAlbums className='icon' size={36}/>}
        subIcon={<MdIcons.MdAudiotrack className='icon' size={26}/>}
        contentName='Album' subContentName='Tracks'
        contentUrl={Api.Albums} usersContentUrl={Api.UsersTracks}
      />
    </div>
  );
}

export default Album;