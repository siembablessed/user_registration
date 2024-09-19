// FirebaseForm.js
import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

const FirebaseForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    country: '',
    idNumber: '',
    age: '',
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
      await addDoc(collection(db, 'registrations'), formData);
      alert('Entry Submitted Successfully');
    } catch (error) {
      console.error('Error saving registration:', error);
    }
  };

  return (
    <form className="registration-form" onSubmit={handleSubmit}>
      <h1>Register</h1>
      <div className="form-group">
        <label htmlFor="fullName">Full Name</label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="country">Country</label>
        <input
          type="text"
          id="country"
          name="country"
          value={formData.country}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="idNumber">ID Number</label>
        <input
          type="text"
          id="idNumber"
          name="idNumber"
          value={formData.idNumber}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="age">Age</label>
        <input
          type="number"
          id="age"
          name="age"
          value={formData.age}
          onChange={handleChange}
        />
      </div>
      <button type="submit" className="submit-btn">Submit</button>
    </form>
  );
};

export default FirebaseForm;
