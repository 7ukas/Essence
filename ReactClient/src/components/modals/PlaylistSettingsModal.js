import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Col, Row } from 'react-bootstrap';
import * as MdIcons from 'react-icons/md';

import PropTypes from 'prop-types';
import axios from 'axios';

import { UserContext } from '../../context/UserContext';
import { PopUpContext } from '../../context/PopUpContext';
import Api from '../../Api';
import Regex from '../../Regex';

import '../content/Content.css'
import './Modal.css'

const PlaylistSettingsModal = ({ playlist, setModal }) => {
    /* User Context */
    const { user } = React.useContext(UserContext);
    const { setPopUp } = React.useContext(PopUpContext);

    const isLoggedIn = user.userId !== undefined;

    /* Modal Context */
    const closeModal = () => {
      setModal({ show: '' })
    }

    /* "Playlist settings" Form */
    const navigate = useNavigate();
    const [deleteButton, setDeleteButton] = React.useState(false);

    const nameRef = React.useRef();
    const [name, setName] = React.useState(playlist.title);
    const [validName, setValidName] = React.useState(false);
    const [nameFocus, setNameFocus] = React.useState(false);

    const [description, setDescription] = React.useState(playlist.description);
    const [validDescription, setValidDescription] = React.useState(false);
    const [descriptionFocus, setDescriptionFocus] = React.useState(false);

    const [visibility, setVisibility] = React.useState(playlist.visibility);
    
    React.useEffect(() => {
      setValidName(Regex.PlaylistName.test(name));
    }, [name])

    React.useEffect(() => {
      setValidDescription(Regex.PlaylistDescription.test(description));
    }, [description])
    
    React.useEffect(() => {
        nameRef.current.focus();
    }, [])

    const handleDelete = async () => {
        const deleteUrl = `${Api.Playlists}/${playlist.id}`;
        await axios.delete(deleteUrl, { withCredentials: true });
        
        setPopUp({
            pop: true,
            notification: `Playlist "${playlist.title}" deleted.`
        })

        closeModal();
        navigate('/');
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        // re-check for validation
        if (!Regex.PlaylistName.test(name) || !Regex.PlaylistDescription.test(description)) {
            return;
        }

        // PUT playlist settings
        const putUrl = `${Api.Playlists}/${playlist.id}`;
        if (isLoggedIn) {
            await axios.put(putUrl, {
              title: name,
              description: description,
              visibility: visibility
            }, { withCredentials: true });
        }

        setPopUp({
            pop: true,
            notification: `Playlist "${playlist.title}" settings saved.`
        });

        closeModal();

        setTimeout(() => {
            window.location.reload(false); // refresh page
        }, 1000)
    }

    return (
        <div className='form-container'>
            <Form className='form-register' onSubmit={handleSubmit}>
                <div className='form-header form-header-playlist'>
                    <MdIcons.MdSettings className='me-2' size={36}/>
                    Playlist settings
                    <Button className='form-close-button' size='sm' onClick={() => closeModal()}
                    >X</Button>
                </div>

                <div className='form-content-container'>
                    <Col>
                        <Form.Group className='my-3'>
                            <Form.Label>Name:</Form.Label>
                            <Form.Control
                                required
                                type='text'
                                id='name'
                                placeholder='Enter playlist name'
                                autoComplete='off'
                                ref={nameRef}
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                                aria-invalid={validName ? "false" : "true"}
                                onFocus={() => setNameFocus(true)}
                                onBlur={() => setNameFocus(false)}
                                isInvalid={nameFocus && !validName}
                            />
                            <Form.Control.Feedback type='invalid'>
                                4 to 32 characters
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>

                    <Col>
                        <Form.Group className='my-3'>
                            <Form.Label>Description:</Form.Label>
                            <Form.Control
                                type='text'
                                id='description'
                                placeholder='Enter description'
                                autoComplete='off'
                                onChange={(e) => setDescription(e.target.value)}
                                value={description}
                                aria-invalid={validDescription ? "false" : "true"}
                                onFocus={() => setDescriptionFocus(true)}
                                onBlur={() => setDescriptionFocus(false)}
                                isInvalid={descriptionFocus && !validDescription}
                            />
                            <Form.Control.Feedback type='invalid'>
                                Cannot exceed 100 characters
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>

                    <Col className='my-3'>
                        <Form.Label>Visibility:</Form.Label>
                        <Row>
                            <Form.Group>
                                <Form.Check 
                                    required inline
                                    type='radio'
                                    id='public'
                                    name='visibility'
                                    defaultChecked={visibility === 'Public'}
                                    label={<MdIcons.MdPublic size={24} title='Public'/>}
                                    onClick={() => setVisibility('Public')}
                                    value={visibility}
                                />
                                <Form.Check
                                    required inline
                                    type='radio'
                                    id='private'
                                    name='visibility'
                                    defaultChecked={visibility === 'Private'}
                                    label={<MdIcons.MdPublicOff size={24} title='Private'/>}
                                    onClick={() => setVisibility('Private')}
                                    value={visibility}
                                />
                            </Form.Group>
                        </Row>
                    </Col>
              
                    <Button disabled={!validName || !validDescription} className='form-submit-button mb-2' type='submit'>
                        Save settings
                    </Button>

                    {!deleteButton ? 
                        <Button className='form-submit-button pre-submit mb-2'>
                            <Link to='#' onClick={() => setDeleteButton(true)}>
                                Delete playlist ?
                            </Link>
                        </Button> :
                        <Button className='form-submit-button submit mb-2'>
                            <Link to='#' onClick={handleDelete}>
                                Delete playlist
                            </Link>
                        </Button>
                    }
                </div>
            </Form>
        </div>
  );
}

PlaylistSettingsModal.propTypes = {
    playlist: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string,
        description: PropTypes.string,
        visibility: PropTypes.string
    }),
    setModal: PropTypes.func.isRequired
}

PlaylistSettingsModal.defaultProps = {
    playlist: {
        title: '',
        description: '',
        visibility: 'Private'
    }
}

export default PlaylistSettingsModal;