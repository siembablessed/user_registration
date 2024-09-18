import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Navbar from './components/Navbar';
import Registration from './pages/Registration';
import Admin from './pages/Admin';
import About from './pages/About';

function App() {
  return (
    <Router>
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" element={<Admin />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
