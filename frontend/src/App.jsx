import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DoctorsPage from './pages/DoctorsPage';
import BookingPage from './pages/BookingPage';
import './index.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        MedCare Plus
      </div>
      <ul className="navbar-nav">
        <li><NavLink to="/" end>Home</NavLink></li>
        <li><NavLink to="/doctors">Doctors</NavLink></li>
        <li><NavLink to="/booking">Book Appointment</NavLink></li>
      </ul>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/doctors" element={<DoctorsPage />} />
        <Route path="/booking" element={<BookingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
