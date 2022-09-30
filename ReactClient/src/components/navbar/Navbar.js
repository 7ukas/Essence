import React from 'react';
import { Link } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';

import PropTypes from 'prop-types';

import NavbarContent from './NavbarContent';

import './Navbar.css';

const Navbar = ({ handleIsMenuExpanded }) => {
  /* Navbar menu (expand / shrink) */
  const [navbarMenuExpand, setNavbarMenuExpand] = React.useState(false);

  const handleMenuExpand = () => {
    setNavbarMenuExpand(!navbarMenuExpand);
  }

  React.useEffect(() => {
    handleIsMenuExpanded(navbarMenuExpand);
  }, [navbarMenuExpand])

  return (
    <div className='navbar-container'>
        <div className='navbar'>
          <Link className='navbar-button' to='#'>
            <FaIcons.FaBars size={32} onClick={handleMenuExpand}/>
          </Link>
        </div>

        <nav className={navbarMenuExpand ? 'navbar-menu expanded' : 'navbar-menu'}>
          <NavbarContent />
        </nav>
    </div>
  );
}

Navbar.propTypes = {
  handleIsMenuExpanded: PropTypes.func.isRequired
}

export default Navbar;