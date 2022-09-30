import React from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Col, Row } from 'react-bootstrap';
import * as FaIcons from 'react-icons/fa';
import * as MdIcons from 'react-icons/md';

import PropTypes from 'prop-types';
import axios from 'axios';

import { UserContext } from '../../context/UserContext';
import { PopUpContext } from '../../context/PopUpContext';
import FetchData from '../fetch-functions/FetchData';
import Api from '../../Api';
import Regex from '../../Regex';

import '../content/Content.css'
import './Modal.css'

const PlaylistModal = ({ track, setModal }) => {
    /* User Context */
    const { user } = React.useContext(UserContext);
    const [playlists, setPlaylists] = React.useState([]);

    const isLoggedIn = user.userId !== undefined;

    /* Modal Context */
    const showLoginModal = () => {
        setModal({ show: 'login' })
    }

    const closeModal = () => {
      setModal({ show: '' })
    }

    /* Pop Up Context */
    const { setPopUp } = React.useContext(PopUpContext);

    // Render user's playlists
    React.useEffect(() => {
        if (isLoggedIn) {
            const playlistsUrl = `${Api.UsersPlaylists}?isOwner=true`;
            FetchData(playlistsUrl, setPlaylists);
        } else showLoginModal()
    }, [user.userId])

    // Add/remove tracks
    const updatePlaylist = async (playlistId, post) => {
        const postUrl = Api.PlaylistsTracks;
        const deleteUrl = `${Api.PlaylistsTracks}/${track.id}?playlistId=${playlistId}`;
        
        // If track have not been added yet - POST, if it has been - DELETE */
        if (post) {
            await axios.post(postUrl, { 
                playlistId: playlistId, id: track.id 
            });
        } else await axios.delete(deleteUrl, { withCredentials: true });
    }

    /* "Create new playlist" Form */
    const [newPlaylist, setNewPlaylist] = React.useState(false);

    const nameRef = React.useRef();
    const [name, setName] = React.useState('');
    const [validName, setValidName] = React.useState(false);
    const [nameFocus, setNameFocus] = React.useState(false);
    const [visibility, setVisibility] = React.useState('Private');
    
    React.useEffect(() => {
      setValidName(Regex.PlaylistName.test(name));
    }, [name])
    
    React.useEffect(() => {
        if (newPlaylist) nameRef.current.focus();
    }, [newPlaylist])
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        // re-check for validation
        if (!Regex.PlaylistName.test(name)) {
            return;
        }

        // POST new playlist
        const postUrl = `${Api.Playlists}`;
        
        const { playlistId } = await axios.post(postUrl, {
          ownerId: user.userId,
          title: name,
          description: '',
          visibility: visibility
        }, { withCredentiald: true })
        .then(response => {return response.data});

        // Add track to the new playlist
        updatePlaylist(playlistId, true);
        setPopUp({ pop: true, notification: `Added track "${track.name}" to "${name}".` });

        closeModal();
    }

    return (
        <div className='form-container'>
            <Form className='form-playlist' onSubmit={handleSubmit}>
                <div className='form-header form-header-playlist'>
                    <MdIcons.MdPlaylistAdd className='me-2' size={36}/>
                    Save to playlist
                    <Button className='form-close-button' size='sm' onClick={() => closeModal()}
                    >X</Button>
                </div>

                <div className='form-playlists-container'>
                    {playlists.length <= 0 &&
                        <div className='form-playlists-not-found'>
                            <FaIcons.FaSearchMinus size={48}/><br/>
                            No playlists were found.
                        </div>
                    }

                    {playlists.map(item => (
                        <Row className='mt-2' key={item.id}>
                            <Form.Group>
                                <Form.Check
                                    inline
                                    type='checkbox'
                                    id={item.id}
                                    name='playlist'
                                    defaultChecked={false}
                                    onClick={(e) => {
                                        updatePlaylist(item.id, e.target.checked);
                                        setPopUp(e.target.checked ?
                                            { pop: true, notification: `Added track "${track.name}" to "${item.title}".` } :
                                            { pop: true, notification: `Removed track "${track.name}" from "${item.title}".` }
                                        );
                                    }}
                                />

                                <Form.Label className='form-checkbox-label' title={item.title}>
                                    {item.title}

                                    {item.visibility === 'Public' ?
                                        <MdIcons.MdPublic size={24} title={item.visibility}/> :
                                        <MdIcons.MdPublicOff size={24} title={item.visibility}/>
                                    }
                                </Form.Label>
                            </Form.Group>
                        </Row>
                    ))}
                </div>
                
                {!newPlaylist ? 
                    <Link to='#' onClick={() => setNewPlaylist(true)}>
                        <div className='form-footer-playlist'>
                            <MdIcons.MdAdd className='me-2 mb-1' size={28}/>
                            <div className='d-inline'>Create new playlist</div>
                        </div>
                    </Link> :
                    <div className='form-footer-playlist-content'>
                        <Row className='mt-3'>
                            <Form.Group>
                                <Form.Label>Name:</Form.Label>
                                <Form.Control
                                    required
                                    type='text'
                                    id='name'
                                    ref={nameRef}
                                    autoComplete='off'
                                    placeholder='Enter playlist name'
                                    onChange={(e) => setName(e.target.value)}
                                    value={name}
                                    aria-invalid={validName ? 'false' : 'true'}
                                    onFocus={() => setNameFocus(true)}
                                    onBlur={() => setNameFocus(false)}
                                    isInvalid={nameFocus && !validName}
                                />
                                <Form.Control.Feedback type='invalid'>
                                  4 to 32 characters
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>

                        <Col className='my-3'>
                            <Form.Label>Visibility:</Form.Label>
                            <Row>
                                <Form.Group>
                                    <Form.Check 
                                        required inline
                                        type='radio'
                                        id='public'
                                        name='visibility'
                                        label={<MdIcons.MdPublic size={24} title='Public'/>}
                                        onClick={() => setVisibility('Public')}
                                        value={visibility}
                                    />
                                    <Form.Check
                                        required inline
                                        type='radio'
                                        id='private'
                                        name='visibility'
                                        defaultChecked={true}
                                        label={<MdIcons.MdPublicOff size={24} title='Private'/>}
                                        onClick={() => setVisibility('Private')}
                                        value={visibility}
                                    />
                                </Form.Group>
                            </Row>
                        </Col>
              
                        <Button disabled={!validName} className='form-submit-button mb-2' type='submit'>
                            Create new playlist
                        </Button>
                    </div>
                }
            </Form>
        </div>
  );
}

PlaylistModal.propTypes = {
    track: PropTypes.exact({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired
    }).isRequired,
    setModal: PropTypes.func.isRequired
}

export default PlaylistModal;