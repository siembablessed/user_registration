import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './registration.css';
import './Fonts/font.css';

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
    date: new Date().toISOString(), // Automatically set the date
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const modalRef = useRef();

  useEffect(() => {
    localStorage.setItem('visitors', JSON.stringify(visitors));
  }, [visitors]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
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
      date: new Date().toISOString(), // Reset the date when form is cleared
    });
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
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
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

      <button onClick={downloadExcel} className="download-btn">
        Download Excel
      </button>

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
                    {visitor.fullName} - {visitor.idNumber} - {visitor.address} - {visitor.age} - {visitor.reason} - {visitor.date}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Registration;
