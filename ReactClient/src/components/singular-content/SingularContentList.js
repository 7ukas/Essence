import React from 'react';
import { Link } from 'react-router-dom';
import * as AiIcons from 'react-icons/ai';
import * as MdIcons from 'react-icons/md';

import PropTypes from 'prop-types'

import { UserContext } from "../../context/UserContext";
import { ModalContext } from "../../context/ModalContext";
import { PopUpContext } from '../../context/PopUpContext';

import './SingularContent.css';
import '../content/Heart.css';

const SingularContentList = ({ name, icon, layout, content, likedContent, handleLikedContent }) => {
  /* Content conditions */
  const isPlaylist = content.ids === undefined;
  const isTrack = name === 'tracks';
  const isLiked = (contentId) => { return likedContent.find(liked => liked.id === contentId) };
  
  /* Modal & Pop Up - Context */
  const { user } = React.useContext(UserContext);
  const { setModal } = React.useContext(ModalContext);
  const { setPopUp } = React.useContext(PopUpContext);

  const isLoggedIn = user.userId !== undefined;

  const handlePlaylistsModal = (trackId, trackName) => {
    setModal({
      show: 'playlists',
      track: { 
        id: trackId,
        name: trackName
      }
    })
  }

  const showLoginModal = () => {
    setModal({ show: 'login' });
  }
  
  return (
      <>
        {((layout === 2 || layout === 3) && !isPlaylist) &&
          <ul>
            {[...Array(content.ids.length).keys()].map(i =>
              <li className={layout === 2 ? 'layout-medium' : 'layout-small'} key={i}>
                {layout === 2 && icon}

                <Link to={`../${name}/${content.ids[i]}`} title={content.titles[i]}>{content.titles[i]}</Link>

                <div title={content.durations[i]}>{content.durations[i]}</div>

                <div className='group-container right me-3'>
                  <Link to='#' 
                    className={ isLiked(content.ids[i]) ? 'heart heart-pressed' : 'heart heart-unpressed' }
                    onClick={() => {
                      if (isLoggedIn) {
                        handleLikedContent(content.ids[i]);
                        setPopUp(isLiked(content.ids[i]) ?
                          { pop: true, notification: `Disliked ${name.slice(0,-1)} "${content.titles[i]}".` } :
                          { pop: true, notification: `Liked ${name.slice(0,-1)} "${content.titles[i]}".` }
                        );
                      } else showLoginModal();
                    }}
                  ><AiIcons.AiFillHeart size={26}/></Link>
                  
                  {isTrack && 
                    <Link to='#' 
                      className='ms-2'
                      onClick={() => handlePlaylistsModal(content.ids[i], content.titles[i])}
                    ><MdIcons.MdPlaylistAdd size={30}/></Link>
                  }
                </div>
              </li>
            )}
          </ul>  
        }
        
        {(layout === 2 || layout === 3) &&
          <ul>
            {Array.isArray(content) ?
            [...Array(content.length).keys()].map(i =>
              <li
                className={layout === 2 ? 
                  'layout-medium medium-playlist-grid' : 
                  'layout-small small-playlist-grid'
                }
                key={i}
              >
                {layout === 2 && icon}

                <Link to={`../${name}/${content[i].id}`} title={content[i].title}>{content[i].title}</Link>

                <Link to={`../artists/${content[i].artistId}`} title={content[i].artist}>{content[i].artist}</Link>
                
                <div title={content[i].duration}>{content[i].duration}</div>
                
                <div className='group-container right me-3'>
                  <Link to='#' 
                    className={ isLiked(content[i].id) ? 'heart heart-pressed' : 'heart heart-unpressed' }
                    onClick={() => {
                      if (isLoggedIn) {
                        handleLikedContent(content[i].id);
                        setPopUp(isLiked(content[i].id) ?
                          { pop: true, notification: `Disliked ${name.slice(0,-1)} "${content[i].title}".` } :
                          { pop: true, notification: `Liked ${name.slice(0,-1)} "${content[i].title}".` }
                        );
                      } else showLoginModal();
                    }}
                  ><AiIcons.AiFillHeart size={26}/></Link>
                  
                  {isTrack && 
                    <Link to='#' 
                      className='ms-2'
                      onClick={() => handlePlaylistsModal(content[i].id, content[i].title)}
                    ><MdIcons.MdPlaylistAdd size={30}/></Link>
                  }
                </div>
              </li>
            ) : null}
          </ul>  
        }
      </>
    );
}

SingularContentList.propTypes = {
  name: PropTypes.string.isRequired,
  icon: PropTypes.object.isRequired,
  layout: PropTypes.number.isRequired,
  handleLikedContent: PropTypes.func.isRequired,

  content: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]),

  likedContent: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired
  })).isRequired
}

export default SingularContentList;