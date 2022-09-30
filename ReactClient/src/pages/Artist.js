import React from 'react';
import { useParams } from 'react-router-dom';
import * as IoIcons from 'react-icons/io';
import * as BsIcons from 'react-icons/bs';

import Api from '../Api';
import SingularContent from '../components/singular-content/SingularContent';

const Artist = () => {
  const { id } = useParams();

  return (
    <div className='page-container'>
      <SingularContent
        id={id}
        icon={<BsIcons.BsFillPersonFill className='icon' size={36}/>}
        subIcon={<IoIcons.IoMdAlbums className='icon' size={26}/>}
        contentName='Artist' subContentName='Albums'
        contentUrl={Api.Artists} usersContentUrl={Api.UsersAlbums}
      />
    </div>
  );
}

export default Artist;