import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './registration.css';
import './Fonts/font.css';
import './Fonts/Montserrat/monts.css';
import FooterImage from './Images/BottomFrame.png';
import TopImage from './Images/TopFrame.png';
import Orb from '../components/Images/orb.png';
import mbare from './Images/mbare.png';

// My List of countries 
const countries = [
  //... (your list of countries)
];

const Registration = () => {
  const [visitors, setVisitors] = useState(() => {
    const savedVisitors = localStorage.getItem('visitors');
    return savedVisitors ? JSON.parse(savedVisitors) : [];
  });

  const [formData, setFormData] = useState({
    fullName: '',
    idNumber: '',
    email: '', // New email field
    organization: '', // Changed from age to organization
    reason: 'Film Festival',
    date: new Date().toISOString(),
    country: 'Zimbabwe', // Default country still stored
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [filteredCountries, setFilteredCountries] = useState(countries);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const modalRef = useRef();
  const countryInputRef = useRef();

  useEffect(() => {
    localStorage.setItem('visitors', JSON.stringify(visitors));
  }, [visitors]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryInputRef.current && !countryInputRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'country') {
      setFilteredCountries(countries.filter(country => country.toLowerCase().includes(value.toLowerCase())));
      setFormData((prevData) => ({ ...prevData, [name]: value }));
      setIsDropdownOpen(true);
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setVisitors([...visitors, formData]);

    setShowSuccessPopup(true);
    setTimeout(() => {
      setShowSuccessPopup(false);
    }, 3000);

    axios.post('YOUR_GOOGLE_SHEET_API_URL', formData)
      .then(() => {
        console.log('Data saved to Google Sheets');
      })
      .catch((error) => {
        console.error('Error saving data to Google Sheets', error);
      });

    setFormData({
      fullName: '',
      idNumber: '',
      email: '', // Reset email field
      organization: '', // Reset organization field
      reason: 'Film Festival',
      date: new Date().toISOString(),
      country: 'Zimbabwe', // Keep country for internal data
    });
    setFilteredCountries(countries);
    setIsDropdownOpen(false);
  };

  const handleCountrySelect = (country) => {
    setFormData((prevData) => ({ ...prevData, country }));
    setIsDropdownOpen(false);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const closeModalOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener('mousedown', closeModalOutsideClick);
    } else {
      document.removeEventListener('mousedown', closeModalOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', closeModalOutsideClick);
    };
  }, [isModalOpen]);

  return (
    <div>
      <img src={TopImage} alt="" className='topImage' />
      <a href="FirebaseForm">
        <div className="left-top-container">
          <h1>EUROPEAN <br />
              FILM <span>2024</span> <br />
              FESTIVAL <br />
              Zimbabwe <br />
          </h1>
        </div>
      </a>
      <img src={Orb} alt="" className='Orb' />
      <div className="registration-form">
        <h1>Visitor Registration Form</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Your Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Your Phone Number</label>
            <input
              type="text"
              name="idNumber"
              value={formData.idNumber}
              onChange={handleChange}
              required
            />
          </div>
          {/* Hidden Country Input */}
          <input type="hidden" name="country" value={formData.country} />

          <div className="form-group">
            <label>Your Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Your Organization</label>
            <input
              type="text"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              required
            />
          </div>

          {/* Hidden Event Field */}
          <input
            type="hidden"
            name="reason"
            value={formData.reason}
          />

          {/* Hidden Date Field */}
          <input
            type="hidden"
            name="date"
            value={formData.date}
          />

          <button type="submit" className="submit-btn">Submit</button>
        </form>

        {/* Success Popup */}
        {showSuccessPopup && (
          <div className="success-popup">
            <p>Data saved successfully!</p>
          </div>
        )}

        {/* Modal for displaying all visitors */}
        {isModalOpen && (
          <div className="modal">
            <div className="modal-content" ref={modalRef}>
              <FontAwesomeIcon icon={faTimes} onClick={toggleModal} className="close-modal-icon" />
              <h2>All Visitors</h2>
              <div className="modal-body">
                <ul>
                  {visitors.map((visitor, index) => (
                    <li key={index}>
                      {visitor.fullName} - {visitor.idNumber} - {visitor.email} - {visitor.organization} - {visitor.reason} - {visitor.date} - {visitor.country}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="left-bottom-container">
        <img src={mbare} alt="" className='mbareart' />
      </div>
      <img src={FooterImage} alt="" className='footerImage' />
    </div>
  );
};

export default Registration;
