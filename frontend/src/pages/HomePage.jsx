import { Link } from 'react-router-dom';
import AppointmentCard from '../components/AppointmentCard';

// Sample appointment data to demonstrate the AppointmentCard component with props
const sampleAppointments = [
  {
    id: 1,
    patientName: 'Riya Sharma',
    doctorName: 'Dr. Arvind Mehta',
    date: '2024-12-20',
    timeSlot: '10:00 AM',
    status: 'confirmed',
  },
  {
    id: 2,
    patientName: 'Karan Patel',
    doctorName: 'Dr. Sunita Rao',
    date: '2024-12-21',
    timeSlot: '02:30 PM',
    status: 'pending',
  },
  {
    id: 3,
    patientName: 'Meena Joshi',
    doctorName: 'Dr. Rajesh Kumar',
    date: '2024-12-18',
    timeSlot: '11:00 AM',
    status: 'cancelled',
  },
];

function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="home-hero">
        <h1>Welcome to MedCare Plus</h1>
        <p>
          Your trusted partner for healthcare appointments. Book with top specialists
          quickly and easily.
        </p>
        <Link to="/booking" className="btn btn-primary" id="hero-book-btn">
          Book an Appointment
        </Link>
        &nbsp;&nbsp;
        <Link to="/doctors" className="btn btn-outline" id="hero-doctors-btn"
          style={{ color: '#fff', borderColor: '#fff' }}>
          View Doctors
        </Link>
      </section>

      {/* Feature highlights */}
      <div className="container">
        <div className="features-grid">
          <div className="feature-card">
            <h3>Expert Doctors</h3>
            <p>Browse specialists across all medical departments.</p>
          </div>
          <div className="feature-card">
            <h3>Easy Booking</h3>
            <p>Book appointments in just a few clicks, any time.</p>
          </div>
          <div className="feature-card">
            <h3>Status Tracking</h3>
            <p>Track your appointment status — confirmed, pending, or cancelled.</p>
          </div>
          <div className="feature-card">
            <h3>Secure Records</h3>
            <p>Patient data is stored securely using MongoDB.</p>
          </div>
        </div>

        {/* Recent Appointments — demonstrating AppointmentCard with props */}
        <div style={{ marginTop: '3rem' }}>
          <h2 className="section-title">Recent Appointments</h2>
          <div className="appointments-list">
            {sampleAppointments.map((appt) => (
              <AppointmentCard
                key={appt.id}
                patientName={appt.patientName}
                doctorName={appt.doctorName}
                date={appt.date}
                timeSlot={appt.timeSlot}
                status={appt.status}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
