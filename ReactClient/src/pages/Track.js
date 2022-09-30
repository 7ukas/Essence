import React from 'react';
import { useParams } from 'react-router-dom';
import * as MdIcons from 'react-icons/md';

import Api from '../Api';
import SingularContent from '../components/singular-content/SingularContent';

const Track = () => {
  const { id } = useParams();

  return (
    <div className='page-container'>
      <SingularContent
        id={id}
        icon={<MdIcons.MdAudiotrack className='icon' size={36}/>}
        contentName='Track'
        contentUrl={Api.Tracks}
      />
    </div>
  );
}

export default Track;