import React from 'react';
import { Link } from 'react-router-dom';
import { Form, Row, Col, Button } from 'react-bootstrap';
import * as BsIcons from 'react-icons/bs';

import PropTypes from 'prop-types';
import axios from 'axios';
import moment from 'moment';

import { UserContext } from '../../context/UserContext';
import Api from '../../Api';
import Regex from '../../Regex';

import './Modal.css';

const RegisterModal = ({ update, setModal }) => {
  /* User Context */
  const { user, setUser } = React.useContext(UserContext);
  const isLoggedIn = user.userId !== undefined;

  React.useEffect(() => {
    if (update && isLoggedIn) {
      setEmail(user.email);
      setUsername(user.username);
      setBirthDate(moment(user.birthDate).format('YYYY-MM-DD'));
      setSex(user.sex);
    }
  }, [user.userId])

  /* Login & Register (Modals) - Context */
  const handleModal = (login, register) => {
    setModal({ 
      show: login || register ? 
        (login ? 'login' : register ? 'register' : '') : ''
    })
  }

  const showLoginModal = (login) => { handleModal(login, false) }
  const showRegisterModal = (register) => { handleModal(false, register) }

  /* Refs */
  const emailRef = React.useRef();
  const errorRef = React.useRef();
  const currentPasswordRef = React.useRef();

  React.useEffect(() => {
    emailRef.current.focus();
  }, [])

  /* Email */
  const [email, setEmail] = React.useState('');
  const [validEmail, setValidEmail] = React.useState(false);
  const [emailFocus, setEmailFocus] = React.useState(false);

  React.useEffect(() => {
    setValidEmail(Regex.Email.test(email));
  }, [email])

  /* Username */
  const [username, setUsername] = React.useState('');
  const [validUsername, setValidUsername] = React.useState(false);
  const [usernameFocus, setUsernameFocus] = React.useState(false);

  React.useEffect(() => {
    setValidUsername(Regex.Username.test(username));
  }, [username])

  /* Password and password's match */
  const [password, setPassword] = React.useState('');
  const [validPassword, setValidPassword] = React.useState(false);
  const [passwordFocus, setPasswordFocus] = React.useState(false);

  const [passwordMatch, setPasswordMatch] = React.useState('');
  const [validPasswordMatch, setValidPasswordMatch] = React.useState(false);
  const [passwordMatchFocus, setPasswordMatchFocus] = React.useState(false);

  const [currentPassword, setCurrentPassword] = React.useState('');
  const [currentPasswordInput, setCurrentPasswordInput] = React.useState(false);
  const [validCurrentPassword, setValidCurrentPassword] = React.useState(false);
  const [currentPasswordFocus, setCurrentPasswordFocus] = React.useState(false);

  React.useEffect(() => {
    if (currentPasswordInput) {
      currentPasswordRef.current.focus();
    }
  }, [currentPasswordInput])
  
  React.useEffect(() => {
    setValidPassword(Regex.Password.test(password));
    setValidPasswordMatch(password === passwordMatch);
    setValidCurrentPassword(Regex.Password.test(currentPassword));
  }, [password, passwordMatch, currentPassword])

  /* Birth date */
  const [birthDate, setBirthDate] = React.useState('');
  const [validBirthDate, setValidBirthDate] = React.useState(false);
  const [birthDateFocus, setBirthDateFocus] = React.useState(false);

  React.useEffect(() => {
    const today = moment(new Date()); 
    const yearsDiff = moment.duration(today.diff(birthDate)).asYears();
   
    setValidBirthDate(yearsDiff >= 13 && yearsDiff <= 118);
  }, [birthDate])

  /* Sex */
  const [sex, setSex] = React.useState('Male');

  React.useEffect(() => {
    setSex(sex);
  }, [sex])

  /* Form Submit */
  const [errorMessage, setErrorMessage] = React.useState('');
  const [registered, setRegistered] = React.useState(false);

  React.useEffect(() => {
    setErrorMessage('');
  }, [username, password, passwordMatch, currentPassword])

  const handleUpdate = async (e) => {
    e.preventDefault();

    // re-check for validation
    if (!Regex.Username.test(username) || !Regex.Password.test(password)) {
      return;
    }

    try {
      // Check if current password correct (for verification)
      const checkUrl = `${Api.Users}/check`;

      const checkResponse = await axios.post(checkUrl, {
        email: user.email,
        password: currentPassword
      }, { withCredentials: true });

      // If verified - update settings, log out and redirect to login modal
      if (checkResponse.status === 200) {
        // Update
        const putUrl = Api.Users;
        
        await axios.put(putUrl, {
          email: user.email,
          password: password,
          username: username,
          birthDate: birthDate,
          sex: sex
        }, { withCredentials: true });

        // Clear user context
        setUser({...user, userId: user.userId });

        // Log out
        const logoutUrl = `${Api.Users}/logout`;
        await axios.delete(logoutUrl, { withCredentials: true });

        // Reload page
        window.location.reload();
      }
    } catch (error) {
      if (error.response?.status === 404) {
          setErrorMessage('Password is incorrect!');
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // re-check for validation
    if (!Regex.Username.test(username) || !Regex.Password.test(password)) {
      return;
    }

    try {
      const postUrl = `${Api.Users}/register`;
      
      await axios.post(postUrl, {
        email: email,
        password: password,
        username: username,
        birthDate: birthDate,
        sex: sex
      });

      setRegistered(true);
    } catch (error) {
      if (error.response?.status === 409) {
          setErrorMessage('Email/Username already exists!');
      }

      errorRef.current.focus();
    }
  }

  return (
      <div className='form-container'>
        {registered && 
          <Form className='form-register'>
            <div className='form-header small-header login-header'>
              Registration succesful!
              <Button className='form-close-button' size='sm' onClick={() => showRegisterModal(false)}>X</Button>
            </div>
              
            <div className='form-login-container'>
              <Col>
                <Form.Group>
                  <Row><BsIcons.BsCheckCircleFill size={48}/></Row>
                  Congratulations, your account is<br/>registered succesfully.
                  <Row>
                    <Button>
                      <Link to='#' onClick={() => showLoginModal(true)}>Login now</Link>
                    </Button>
                  </Row>
                </Form.Group>
              </Col>
            </div>
          </Form>
        }

        {!registered &&
          <Form className='form-register' onSubmit={!update ? handleSubmit : handleUpdate}>
            <div className={!update ? 'form-header' : ''}>
              <div className={!update ? 
                'form-header-login' : 'form-header form-header-playlist'
              }>
                {!update ? 'Sign up' : 'Profile settings'}
                <Button className='form-close-button' size='sm' onClick={() => {showRegisterModal(false);}}>X</Button>
              </div>
              {!update && 
                <div className='form-header-register'>
                  <span>Are you a member? </span>
                  <Link to='#' onClick={() => showLoginModal(true)}>Login now</Link>
                </div>
              }
            </div>

            <div className='form-content-container'>
              <Col>
                {errorMessage.length > 0 &&
                  <Form.Group className='mt-4'>
                    <Form.Label className='form-error-message' ref={errorRef}>{errorMessage}</Form.Label>
                  </Form.Group>
                }

                <Form.Group className='my-3'>
                  <Form.Label>Email Address:</Form.Label>
                  <Form.Control
                    disabled={update}
                    required
                    type='email'
                    id='email'
                    placeholder='Email'
                    autoComplete='off'
                    ref={emailRef}
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    aria-invalid={validEmail ? "false" : "true"}
                    aria-describedby="uidnote"
                    onFocus={() => setEmailFocus(true)}
                    onBlur={() => setEmailFocus(false)}
                    isInvalid={emailFocus && email && !validEmail}
                    isValid={validEmail}
                  />
                  <Form.Control.Feedback type='invalid'>
                    E-mail address is invalid
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col>
                <Form.Group className='my-3'>
                  <Form.Label>{update && 'New '}Password:</Form.Label>
                  <Form.Control
                    disabled={currentPasswordInput}
                    required
                    type='password'
                    id='password'
                    placeholder='Password'
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    aria-invalid={validPassword ? 'false' : 'true'}
                    onFocus={() => setPasswordFocus(true)}
                    onBlur={() => setPasswordFocus(false)}
                    isInvalid={passwordFocus && password && !validPassword}
                    isValid={validPassword}
                  />
                  <Form.Control.Feedback type='invalid'>
                    8 to 24 characters
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col>
                <Form.Group className='my-3'>
                  <Form.Control
                    disabled={currentPasswordInput}
                    required
                    type='password'
                    id='confirmPassword'
                    placeholder='Confirm password'
                    onChange={(e) => setPasswordMatch(e.target.value)}
                    value={passwordMatch}
                    aria-invalid={validPasswordMatch ? 'false' : 'true'}
                    onFocus={() => setPasswordMatchFocus(true)}
                    onBlur={() => setPasswordMatchFocus(false)}
                    isInvalid={passwordMatchFocus && !validPasswordMatch}
                    isValid={validPassword && validPasswordMatch}
                  />
                  <Form.Control.Feedback type='invalid'>
                    Must match the first password.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col>
                <Form.Group className='mb-3'>
                  <Form.Label>Username:</Form.Label>
                  <Form.Control
                    disabled={currentPasswordInput}
                    required
                    type='text'
                    id='username'
                    placeholder='Username'
                    autoComplete='off'
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                    aria-invalid={validUsername ? "false" : "true"}
                    onFocus={() => setUsernameFocus(true)}
                    onBlur={() => setUsernameFocus(false)}
                    isInvalid={usernameFocus && username && !validUsername}
                    isValid={validUsername}
                  />
                  <Form.Control.Feedback type='invalid'>
                    4 to 24 characters<br/>
                    Must begin with a letter<br/>
                    Only letters and numbers are allowed
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            
              <Col>
                <Form.Group className='mb-3'>
                  <Form.Label>Date of birth:</Form.Label>
                  <Form.Control
                    disabled={currentPasswordInput}
                    required
                    type='date'
                    id='birthDate'
                    onChange={(e) => setBirthDate(e.target.value)}
                    value={birthDate}
                    aria-invalid={validBirthDate ? "false" : "true"}
                    onFocus={() => setBirthDateFocus(true)}
                    onBlur={() => setBirthDateFocus(false)}
                    isInvalid={birthDateFocus && birthDate && !validBirthDate}
                    isValid={validBirthDate}
                  />
                  <Form.Control.Feedback type='invalid'>
                    Must be 13 to 118 years old.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col>
                <Form.Label>Sex:</Form.Label>

                <Row>
                  <Form.Group className='mb-3'>
                    <Form.Check 
                      disabled={currentPasswordInput}
                      required inline
                      type='radio'
                      id='male'
                      name='sex'
                      label='Male'
                      defaultChecked={true}
                      onClick={(e) => setSex('Male')}
                      value={sex}
                    />
                    <Form.Check
                      required inline
                      type='radio'
                      id='female'
                      name='sex'
                      label='Female'
                      onClick={(e) => setSex('Female')}
                      value={sex}
                    />
                  </Form.Group>
                </Row>
              </Col>
              
              {!update && !currentPasswordInput &&
                <Button
                  disabled={!validEmail || !validUsername || !validPassword || !validPasswordMatch || !validBirthDate ? true : false} 
                  className='form-submit-button mb-2' 
                  type='submit'
                >Sign up</Button> 
              }
              {update && !currentPasswordInput &&
                <Button
                  disabled={!validEmail || !validUsername || !validPassword || !validPasswordMatch || !validBirthDate ? true : false} 
                  className='form-submit-button pre-submit mb-2'
                  onClick={() => setCurrentPasswordInput(true)}
                >Save settings</Button>
              }

              {currentPasswordInput &&
              <>
                <Button
                  disabled={!validCurrentPassword} 
                  className='form-submit-button mb-3'
                  type='submit'
                >Save settings</Button>

                <Form.Control
                  required
                  type='password'
                  id='currentPassword'
                  placeholder='Enter your current password'
                  ref={currentPasswordRef}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  value={currentPassword}
                  aria-invalid={validCurrentPassword ? 'false' : 'true'}
                  onFocus={() => setCurrentPasswordFocus(true)}
                  onBlur={() => setCurrentPasswordFocus(false)}
                  isInvalid={currentPasswordFocus && currentPassword && !validCurrentPassword}
                />
                <Form.Control.Feedback type='invalid'>
                  8 to 24 characters
                </Form.Control.Feedback>
              </>
              }
              
            </div>
          </Form>
        }
      </div>
  );
}

RegisterModal.propTypes = {
  update: PropTypes.bool,
  setModal: PropTypes.func.isRequired
}

RegisterModal.defaultValues = {
  update: false
}

export default RegisterModal;