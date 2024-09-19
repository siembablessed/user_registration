import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './registration.css';
import './Fonts/font.css';
import FooterImage from './Images/BottomFrame.png'
import TopImage from './Images/TopFrame.png'

// My List of countries 
const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
  "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
  "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
  "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Congo (Democratic Republic)",
  "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor",
  "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland",
  "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea",
  "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq",
  "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea (North)",
  "Korea (South)", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya",
  "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands",
  "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique",
  "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia",
  "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland",
  "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino",
  "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands",
  "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
  "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan",
  "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City",
  "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];


const Registration = () => {
  const [visitors, setVisitors] = useState(() => {
    const savedVisitors = localStorage.getItem('visitors');
    return savedVisitors ? JSON.parse(savedVisitors) : [];
  });

  const [formData, setFormData] = useState({
    fullName: '',
    idNumber: '',
    address: '',
    age: '',
    reason: 'Film Festival',
    date: new Date().toISOString(),
    country: 'Zimbabwe', // Default country set to Zimbabwe
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
      address: '',
      age: '',
      reason: 'Film Festival',
      date: new Date().toISOString(),
      country: 'Zimbabwe', // Reset to default country
    });
    setFilteredCountries(countries);
    setIsDropdownOpen(false);
  };

  const handleCountrySelect = (country) => {
    setFormData((prevData) => ({ ...prevData, country }));
    setIsDropdownOpen(false);
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(visitors);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Visitors');
    XLSX.writeFile(workbook, 'visitors.xlsx');
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
          <label>Your ID Number</label>
          <input
            type="text"
            name="idNumber"
            value={formData.idNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Your Home Country</label>
          <div className="country-input-container" ref={countryInputRef}>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Select your country"
              className="country-input"
            />
            {isDropdownOpen && (
              <div className="country-dropdown">
                {filteredCountries.map((country, index) => (
                  <div
                    key={index}
                    className="country-option"
                    onClick={() => handleCountrySelect(country)}
                  >
                    {country}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="form-group">
          <label>Your Age</label>
          <input
            type="number"
            name="age"
            value={formData.age}
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

      {/* <button onClick={downloadExcel} className="download-btn">
        Download Excel
      </button> */}

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
                    {visitor.fullName} - {visitor.idNumber} - {visitor.address} - {visitor.age} - {visitor.reason} - {visitor.date} - {visitor.country}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
    <img src={FooterImage} alt=""  className='footerImage'/>

      <div class="left-bottom-container">
        <h1>Bioskop!</h1>
        <p>Short Film Competition</p>
      </div>
    </div>
  );
};

export default Registration;
