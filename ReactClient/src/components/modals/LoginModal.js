import React from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Col } from 'react-bootstrap';

import PropTypes from 'prop-types';
import axios from 'axios';

import Api from '../../Api';
import { UserContext } from "../../context/UserContext";

import './Modal.css';

const LoginModal = ({ setModal }) => {
  /* Login & Register (Modals) */
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

  React.useEffect(() => {
    emailRef.current.focus();
  }, [])

  /* Email and Password */
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [remember, setRemember] = React.useState(false);

  /* Form Submit */
  const { setUser } = React.useContext(UserContext);
  const [errorMessage, setErrorMessage] = React.useState('');
  
  React.useEffect(() => {
    setErrorMessage('');
  }, [email, password])

  const clearInputs = () => {
    setEmail('');
    setPassword('');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = `${Api.Users}/login`;
      await axios.post(url, {
        email: email,
        password: password,
        remember: remember
      }, { withCredentials: true });

      // Set user context
      const userResponse = await axios.get(url, { withCredentials: true });
      setUser(userResponse.data);

      clearInputs();
      showLoginModal(false);
    } catch (error) {
      if (error.response?.status === 404) {
          setErrorMessage('Email/Password is incorrect!');
      }
    }
  }

  return (
    <div className='form-container'>
      <Form className='form-login' onSubmit={handleSubmit}>
        <div className='form-header'>
          <div className='form-header-login'>
            Sign in
            <Button className='form-close-button' size='sm' onClick={() => showLoginModal(false)}> X </Button>
          </div>
          <div className='form-header-register'>
            <span>Not a member yet? </span>
            <Link to='#' onClick={() => showRegisterModal(true)}>Register now</Link>
          </div>
        </div>

        <div className='form-content-container'>
          <Col>
            {errorMessage.length > 0 &&
              <Form.Group className='mt-4'>
                <Form.Label className='form-error-message'>{errorMessage}</Form.Label>
              </Form.Group>
            }
            
            <Form.Group className='my-3'>
              <Form.Label>Email Address:</Form.Label>
              <Form.Control
                required
                type='email'
                id='email'
                ref={emailRef}
                autoComplete='on'
                placeholder='Enter e-mail'
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </Form.Group>
          </Col>

          <Col>
            <Form.Group className='mb-3'>
              <Form.Label>Password:</Form.Label>
              <Form.Control
                required
                type='password'
                id='password'
                placeholder='Password'
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </Form.Group>
          </Col>

          <Col>
            <Form.Group className='mb-3'>
              <Form.Check 
                className='form-checkbox-label' 
                type='checkbox' 
                label='Keep me logged in'
                value={remember}
                onClick={() => setRemember(true)}
              />
            </Form.Group>
          </Col>

          <Button
            disabled={email.length <= 0 || password.length <= 0}
            className='form-submit-button mb-3'
            type='submit'
          >Sign in</Button>
          
          <Form.Group className='form-forgot' controlId='forgotPassword'>
            <Link className='form-forgot' to='#'>Forgot your password?</Link>
          </Form.Group>
          </div>
      </Form>
    </div>
  );
}

LoginModal.propTypes = {
  setModal: PropTypes.func.isRequired
}

export default LoginModal;