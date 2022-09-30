import React from 'react';
import { Link } from 'react-router-dom';
import * as AiIcons from 'react-icons/ai';
import * as MdIcons from 'react-icons/md';

import PropTypes from 'prop-types'

import { UserContext } from "../../context/UserContext";
import { ModalContext } from "../../context/ModalContext";
import { PopUpContext } from '../../context/PopUpContext';

import './Content.css'

const ContentList = ({ name, icon, layout, content, likedContent, handleLikedContent }) => {
    /* Content conditions */
    const isPlaylist = name.toLowerCase() === 'playlist';
    const isTrack = name.toLowerCase() === 'track';
    const isLiked = (itemId) => { 
      return likedContent.find(liked => liked.id === itemId) 
    };

    /* User, Modal & Pop Up - Context */
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
          {layout === 1 &&
            <ul className='layout-large-container'>
              {content.map(item => (
                <li className='layout-large' key={item.id}>
                  
                  <Link to='#' 
                    className={
                      isLiked(item.id) ? 'heart heart-pressed' : 'heart heart-unpressed'
                    }
                    onClick={() => {
                      if (isLoggedIn) {
                        if (!isPlaylist || user.userId !== item.ownerId) {
                          handleLikedContent(item.id);
                          setPopUp(isLiked(item.id) ?
                            { pop: true, notification: `Disliked ${name} "${item.title}".` } :
                            { pop: true, notification: `Liked ${name} "${item.title}".` }
                          );
                        }
                      } else showLoginModal();
                    }}
                  ><AiIcons.AiFillHeart className='card-heart'/></Link>
                  
                  {isTrack && 
                    <Link to='#' 
                      className='ms-2'
                      onClick={() => handlePlaylistsModal(item.id, item.title)}
                    ><MdIcons.MdPlaylistAdd className='card-playlists'/></Link>
                  }
           
                  {icon}

                  <Link to={`/${name}s/${item.id}`} title={item.title} className='content-title'>{item.title}</Link>

                  {!isPlaylist ? 
                    <Link to={`/artists/${item.artistId}`} title={item.artist}>{item.artist}</Link> : 
                    <Link to='#' title={item.owner}>{item.owner}</Link>
                  }
                </li>
              ))}
            </ul>  
          }

          {(layout === 2 || layout === 3) &&
            <ul>
              {content.map(item => (
                <li className={layout === 2 ? 'layout-medium' : 'layout-small'} key={item.id}>
                  {layout === 2 && icon}

                  <Link to={`/${name}s/${item.id}`} title={item.title}>{item.title}</Link>

                  {!isPlaylist ? 
                    <Link to={`/artists/${item.artistId}`} title={item.artist}>{item.artist}</Link> : 
                    <Link to='#' title={item.owner}>{item.owner}</Link>
                  }

                  <div title={item.genre}>{item.genre}</div>

                  <div className='group-container right me-3'>
                    <Link to='#' 
                      className={
                        isLiked(item.id) ? 'heart heart-pressed' : 'heart heart-unpressed'
                      }
                      onClick={() => {
                        if (isLoggedIn) {
                          if (!isPlaylist || user.userId !== item.ownerId) {
                            handleLikedContent(item.id);
                            setPopUp(isLiked(item.id) ?
                              { pop: true, notification: `Disliked ${name} "${item.title}".` } :
                              { pop: true, notification: `Liked ${name} "${item.title}".` }
                            );
                          }
                        } else showLoginModal();
                      }}
                    ><AiIcons.AiFillHeart size={26}/></Link>
                    
                    {isTrack && 
                      <Link to='#' 
                        className='ms-2'
                        onClick={() => handlePlaylistsModal(item.id, item.title)}
                      ><MdIcons.MdPlaylistAdd size={30}/></Link>
                    }
                  </div>
                </li>
              ))}
            </ul>  
          }
        </>
    );
}

ContentList.propTypes = {
  name: PropTypes.string.isRequired,
  icon: PropTypes.object.isRequired,
  layout: PropTypes.number.isRequired,
  handleLikedContent: PropTypes.func.isRequired,

  content: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    artistId: PropTypes.number,
    artist: PropTypes.string,
    owner: PropTypes.string,
    genre: PropTypes.string
  })).isRequired,

  likedContent: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired
  })).isRequired
}

export default ContentList;