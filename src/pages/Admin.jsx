import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';



const Admin = () => {
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
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const modalRef = useRef(); // For detecting clicks outside the modal

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
      setIsModalOpen(false); // Close modal if clicked outside
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
      <h1>Database</h1>
      {/* <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>ID Number</label>
          <input
            type="text"
            name="idNumber"
            value={formData.idNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Age</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Reason for Visit</label>
          <input
            type="text"
            name="reason"
            value={formData.reason}
            disabled
          />
        </div>
        <button type="submit" className="submit-btn">Submit</button>
      </form> */}

      {/* <h2>Visitor List</h2> */}
      <ul>
        {visitors.slice(0, 2).map((visitor, index) => (
          <li key={index}>
            {visitor.fullName} - {visitor.idNumber} - {visitor.address} - {visitor.age} - {visitor.reason}
          </li>
        ))}
      </ul>

      {visitors.length > 2 && (
        <button onClick={toggleModal} className="read-more-btn">
          Read More
        </button>
      )}

      <button onClick={downloadExcel} className="download-btn">
        Download Excel
      </button>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content" ref={modalRef}>
            <FontAwesomeIcon icon={faTimes} onClick={toggleModal} className="close-modal-icon" />
            <h2>All Visitors</h2>
            <div className="modal-body">
              <ul>
                {visitors.map((visitor, index) => (
                  <li key={index}>
                    {visitor.fullName} - {visitor.idNumber} - {visitor.address} - {visitor.age} - {visitor.reason}
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

export default Admin;
