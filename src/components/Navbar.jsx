import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import EuroFest from './Images/eufilmfest.jpg'
import './navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        {/* <h2>EU FilmFest</h2> */}
        <img src={EuroFest} className='eulogo' alt="EU FilmFest logo" />
      </div>
      <ul className={isOpen ? "navbar-links active" : "navbar-links"}>
        <li><Link to="/" onClick={toggleMenu}>Registration</Link></li>
        <li><Link to="/admin" onClick={toggleMenu}>Admin</Link></li>
        <li><Link to="/about" onClick={toggleMenu}>About</Link></li>
      </ul>
      <div className="hamburger" onClick={toggleMenu}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </div>
    </nav>
  );
};

export default Navbar;
