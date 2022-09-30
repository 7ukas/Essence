import React from 'react';
import { Link } from 'react-router-dom';

import { FooterContent } from './FooterContent';

import './Footer.css';

const Footer = () => {
  return (
    <>
      <div className='footer'>
        <div className='footer-title'>essence</div>
        <div className='footer-description'>Description of the site named essence.</div>
        <hr/>
        <div>
          {FooterContent.map((item, index) => {
              return (
                <Link to={item.path} key={item.title}>
                  {item.icon}

                  <span className='ms-1'>{item.title}</span>

                  {index !== FooterContent.length-1 && 
                    <span className='ms-2 me-2'>&#9679;</span>
                  }
                </Link>
              );
            })}
        </div>
      </div>
    </>
  );
}

export default Footer;