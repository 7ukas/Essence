import React from 'react';

import Profile from '../components/profile/Profile';

const ProfileMyLibrary = () => {
  return (
    <div className='page-container'>
      <Profile hasLibrary={true} />
    </div>
  );
}

export default ProfileMyLibrary;