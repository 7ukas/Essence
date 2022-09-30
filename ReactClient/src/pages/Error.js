import React from 'react';
import * as RiIcons from 'react-icons/ri';

import './css/Error.css';

const Error = () => {
    return (
        <div className='page-container'>
            <div className='error-center'>
                <div><h1><RiIcons.RiErrorWarningFill size={116}/></h1></div>
                <div><h1>Oops! Something went wrong.</h1></div>
                <div><h3>Whatever happened, it was probably our fault. Please try again.</h3></div>
            </div>
        </div>
    )
}

export default Error;