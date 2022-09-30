import React from 'react';
import { Link } from 'react-router-dom';
import * as MdIcons from 'react-icons/md';

import PropTypes from 'prop-types';

import { UserContext } from '../../context/UserContext';
import { ModalContext } from '../../context/ModalContext';
import ContentLayout from '../content/ContentLayout';
import UpdateLikedContent from '../content/UpdateLikedContent';
import LoadingEllipsis from '../loading-ellipsis/LoadingEllipsis';
import FetchData from '../fetch-functions/FetchData';
import ContentTable from './SingularContentTable';
import ContentList from './SingularContentList'

import './SingularContent.css'

const LAYOUT = 2;

const SingularContent = ({ 
  id, 
  icon, subIcon,
  contentName, subContentName,
  contentUrl, subContentUrl, usersContentUrl 
}) => {
  /* Content conditions */
  const isPlaylist = contentName === 'Playlist';
  const isTrack = contentName === 'Track'

  const [isPlaylistOwner, setIsPlaylistOwner] = React.useState(false);
  
  /* User Context */
  const { user } = React.useContext(UserContext);
  const { setModal } = React.useContext(ModalContext);

  const isLoggedIn = user.userId !== undefined;

  const showPlaylistSettingsModal = (playlist) => {
    setModal({ 
      show: 'playlist-settings', 
      playlist: { 
        id: playlist.id, 
        title: playlist.title, 
        description: playlist.description,
        visibility: playlist.visibility
      }
    });
  }

  /* Layout */
  const [layout, setLayout] = React.useState(LAYOUT);

  /* Content */
  const [content, setContent] = React.useState({});
  const [subContent, setSubContent] = React.useState([]);
  const [isContentLoading, setIsContentLoading] = React.useState(true);

  const showContentList = contentName !== 'Track';

  // Render loading screen
  React.useEffect(() => {
    if (!isPlaylist) {
      setIsContentLoading(content.length < 1);
    } else {
      setIsContentLoading(content.length < 1 && subContent.length < 1);
      setIsPlaylistOwner(user.userId === content.ownerId);
    }
  }, [content])

  // Render content once
  React.useEffect(() => {
    const url = `${contentUrl}/${id}`;
    FetchData(url, setContent);
  
    if (isPlaylist) {
      const playlistTracksUrl = `${subContentUrl}/${id}`;
      FetchData(playlistTracksUrl, setSubContent);
    }
  }, [])

  /* Render Hearts - Get all the liked content to set hearts to liked/not */
  const [likedContent, setLikedContent] = React.useState([]);

  // Update hearts
  const handleLikedContent = async (id) => {
    if (isLoggedIn && !isTrack) {
      const content = await UpdateLikedContent(usersContentUrl, user.userId, id, likedContent);
      setLikedContent(content);
    }
  }

  // Render hearts once
  React.useEffect(() => {
    if (isLoggedIn && !isTrack) {
      const likedContentUrl = `${usersContentUrl}`;
      FetchData(likedContentUrl, setLikedContent);
    }
  }, [user.userId])



  return (
    <div className='singular-content-container'>
      <div className='singular-content-header'>
        {icon}
        <span>{contentName}</span>
        {(isPlaylist && isPlaylistOwner) &&
          <span >
            <Link to='#' 
              className='singular-content-playlist-settings' 
              onClick={() => showPlaylistSettingsModal(content)}
            ><MdIcons.MdSettings size={36}/></Link>
          </span>
        }
      </div>

      {isContentLoading && 
        <h4 className='singular-content-loading'>
          <LoadingEllipsis/>
        </h4>
      }

      {!isContentLoading &&
        <div>
          <div className='singular-content-table'>
            <ContentTable
              content={content}
              icon={icon}
            />
          </div>

          {showContentList &&
            <div>
              <div className='singular-content-sub-header'>
                <div>
                  {subIcon}
                  <span>{subContentName}</span>
                </div>

                <div className='group-container right'>
                  <ContentLayout 
                    layout={layout} 
                    handleLayout={setLayout}
                    excludeLayout={1}
                    buttonGroupClass='singular-content-layout'
                    buttonClass='singular-layout-button'
                    iconClass='singular-layout-icon'
                  />
                </div>
              </div>

              <div className='singular-content-list'>
                <ContentList
                  name={subContentName.toLowerCase()}
                  icon={icon}
                  layout={layout}
                  content={!isPlaylist ? content : subContent}
                  likedContent={likedContent}
                  handleLikedContent={handleLikedContent}
                />
              </div>
            </div>
          }
        </div>
      }
    </div>
  );
}

SingularContent.propTypes = {
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired, 
  icon: PropTypes.object.isRequired, 
  subIcon: PropTypes.object, 
  
  contentName: PropTypes.string.isRequired, 
  subContentName: PropTypes.string, 
  
  contentUrl: PropTypes.string.isRequired, 
  subContentUrl: PropTypes.string,
  usersContentUrl: PropTypes.string
}

export default SingularContent;