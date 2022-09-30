import React from 'react';
import { Link } from 'react-router-dom';

import * as FaIcons from 'react-icons/fa';
import * as MdIcons from 'react-icons/md';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';

import PropTypes from 'prop-types';

import { UserContext } from '../../context/UserContext';
import ContentLayout from '../content/ContentLayout';
import ContentList from '../content/ContentList';
import LoadingEllipsis from '../loading-ellipsis/LoadingEllipsis';
import UpdateLikedContent from '../content/UpdateLikedContent';
import FetchData from '../fetch-functions/FetchData';
import Api from '../../Api';

import './Profile.css';
import '../content/Content.css';

const ICONS = {
  albums: (<IoIcons.IoMdAlbums className='icon'/>),
  tracks: (<MdIcons.MdAudiotrack className='icon'/>),
  playlists: (<RiIcons.RiPlayListFill className='icon'/>)
}

const URLS = {
  albums: Api.UsersAlbums,
  tracks: Api.UsersTracks,
  playlists: Api.UsersPlaylists
}

const LAYOUT = 2;

const Profile = ({ hasLibrary }) => {
    /* User Context */
    const { user } = React.useContext(UserContext);
    const isLoggedIn = user.userId !== undefined;

    /* Layout */
    const [layout, setLayout] = React.useState(LAYOUT);

    /* Content type */
    const [contentType, setContentType] = React.useState('albums');

    /* Content */
    const [contentList, setContentList] = React.useState([]);
    const [isContentLoading, setIsContentLoading] = React.useState(true);
    const [isContentNotFound, setIsContentNotFound] = React.useState(false);

    const handleLikedContent = async (id) => {
        if (isLoggedIn) {
            const content = await UpdateLikedContent(URLS[contentType], user.userId, id, contentList);
            setContentList(content);
        }
    }

    // [Render] Content list
    React.useEffect(() => {
        if (isLoggedIn) {
            FetchData(URLS[contentType], setContentList);
        }
    }, [user.userId, contentType])

    // [Render] Is content loading / Is content not found
    React.useEffect(() => {
        setIsContentLoading(!isLoggedIn && contentList.length < 1);
        setIsContentNotFound(contentList.length < 1);
    }, [contentList])

    return (
        <div className='profile-container'>
            <div className='profile-header'>
                <RiIcons.RiAccountCircleFill size={256}/>
                <div>{user.username}</div>
            </div>

            <hr/>

            {hasLibrary && 
            <>
                <div className='profile-content-header'>
                    <MdIcons.MdLibraryMusic size={36}/>
                    <div className='profile-content-header-title'>My Library</div>

                    <div className='group-container right'>
                        <ContentLayout 
                            layout={layout} 
                            handleLayout={setLayout}
                            buttonGroupClass='profile-content-layout'
                            buttonClass='profile-layout-button'
                            iconClass='profile-layout-icon'
                        />
                    </div>
                </div>

                <div className='profile-content-navbar'>
                    <Link to='#' onClick={() => setContentType('albums')}>
                        {ICONS.albums}
                        <div className='profile-content-navbar-title'>Albums</div>
                    </Link>
                    <Link to='#' onClick={() => setContentType('tracks')}>
                        {ICONS.tracks}
                        <div className='profile-content-navbar-title'>Tracks</div>
                    </Link>
                    <Link to='#' onClick={() => setContentType('playlists')}>
                        {ICONS.playlists}
                        <div className='profile-content-navbar-title'>Playlists</div>
                    </Link>
                </div>

                {isContentLoading && 
                    <h4 className='profile-content-loading'>
                        <LoadingEllipsis/>
                    </h4>
                }

                {isContentNotFound && 
                    <h4 className='profile-content-not-found'>
                        <FaIcons.FaSearchMinus size={72}/><br/>
                        <div>No {contentType} were found.</div><br/>
                        <Link to={`/${contentType}`}>
                            {ICONS[contentType]} Find {contentType}
                        </Link>
                    </h4>
                }

                <div className='content-list'>
                    <ContentList
                        name={contentType.slice(0,-1)}
                        icon={ICONS[contentType]}
                        layout={layout}
                        content={contentList}
                        likedContent={contentList}
                        handleLikedContent={handleLikedContent}
                    />
                </div>
            </>
            }
        </div>
    );
}

Profile.propTypes = {
    hasLibrary: PropTypes.bool
}

Profile.defaultProps = {
    hasLibrary: false
}

export default Profile;