import React, { useState } from 'react';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import FooterImage from './Images/BottomFrame.png';
import TopImage from './Images/TopFrame.png';
import Orb from '../components/Images/orb.png';
import mbare from './Images/mbare.png';

const FirebaseForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    country: '',
    organization: '',
    contactNumber: '',
    date: new Date().toLocaleString(),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Check if the email already exists
      const q = query(collection(db, 'registrations'), where('country', '==', formData.country));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        alert('User already registered with this email address.');
        return;
      }

      // Add the new registration
      await addDoc(collection(db, 'registrations'), formData);
      alert('Entry Submitted Successfully');

      // Clear the form by resetting the formData state
      setFormData({
        fullName: '',
        country: '',
        organization: '',
        contactNumber: '',
        date: new Date().toLocaleString(),
      });
    } catch (error) {
      console.error('Error saving registration:', error);
    }
  };

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
      <form className="registration-form" onSubmit={handleSubmit}>
        <h1>Online Registration</h1>
        <div className="form-group">
          <label htmlFor="fullName">Your Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="contactNumber">Your Phone Number</label>
          <input
            type="number"
            id="contactNumber"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="country">Your Email Address</label>
          <input
            type="email"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="organization">Your Organization</label>
          <input
            type="text"
            id="organization"
            name="organization"
            value={formData.organization}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="submit-btn">Submit</button>
      </form>

      <div className="left-bottom-container">
        {/* <h1>Bioskop!</h1>
        <p>Short Film Competition</p> */}
      </div>
      <img src={mbare} alt="" className='mbareart' />
      <img src={FooterImage} alt="" className="footerImage" />
    </div>
  );
};

export default FirebaseForm;
