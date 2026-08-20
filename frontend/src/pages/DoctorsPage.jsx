import { useState, useEffect } from 'react';

// ─── API base URL (Task 3 Express server) ─────────────────────────────────────
const API_URL = 'http://localhost:5000/api/v1/doctors';

// =============================================================================
// DoctorsPage
//
// STATE VALUES:
//   1. data    — array of doctors fetched from GET /api/v1/doctors
//   2. loading — boolean, true while the fetch is in progress
//   3. error   — string or null, holds the error message if request fails
//
// useEffect fires once on mount and makes an async fetch call to the
// Express API built in Task 3. No data is hardcoded in this component.
// =============================================================================
function DoctorsPage() {
  // State 1: doctor data from API
  const [data, setData] = useState([]);

  // State 2: loading indicator
  const [loading, setLoading] = useState(true);

  // State 3: error message
  const [error, setError] = useState(null);

  // ── Fetch doctors from Express API on component mount ─────────────────────
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(API_URL);

        // Treat non-2xx responses as errors
        if (!response.ok) {
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }

        const json = await response.json();
        setData(json.data); // { success, count, data: [...] }
      } catch (err) {
        setError(err.message || 'Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []); // empty dependency array → runs only on mount

  // ── 1. Loading state ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <div>
        <div className="page-hero">
          <h1>Our Doctors</h1>
          <p>Fetching available specialists...</p>
        </div>
        <div className="container">
          <div className="loading-wrapper">
            <div className="spinner" aria-label="Loading"></div>
            <p className="loading-text">Loading doctors from server...</p>
          </div>
        </div>
      </div>
    );
  }

  // ── 2. Error state ─────────────────────────────────────────────────────────
  if (error) {
    return (
      <div>
        <div className="page-hero">
          <h1>Our Doctors</h1>
        </div>
        <div className="container">
          <div className="error-box" role="alert">
            <div className="error-icon">!</div>
            <h3>Failed to load doctors</h3>
            <p>{error}</p>
            <p className="error-hint">
              Make sure the backend server is running at{' '}
              <code>http://localhost:5000</code>
            </p>
            <button
              className="btn btn-primary"
              style={{ marginTop: '1rem' }}
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── 3. Success state — render doctors from API response ────────────────────
  return (
    <div>
      <div className="page-hero">
        <h1>Our Doctors</h1>
        <p>
          {data.length} specialist{data.length !== 1 ? 's' : ''} available —
          data fetched live from <code>GET /api/v1/doctors</code>
        </p>
      </div>

      <div className="container">
        {data.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
            No doctors found.
          </p>
        ) : (
          <div className="cards-grid">
            {data.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── DoctorCard sub-component ─────────────────────────────────────────────────
// Receives a single doctor object from the API response.
// Displays: name, specialisation, availability.
function DoctorCard({ doctor }) {
  // Generate initials for the avatar from the doctor's name (skip "Dr.")
  const initials = doctor.name
    .split(' ')
    .filter((word) => word !== 'Dr.')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="doctor-card" id={`doctor-card-${doctor.id}`}>
      {/* Avatar */}
      <div className="doctor-avatar">{initials}</div>

      {/* Doctor Name — from API response */}
      <h3>{doctor.name}</h3>

      {/* Specialisation — from API response */}
      <div className="specialisation">{doctor.specialisation}</div>

      {/* Availability — from API response */}
      <span
        className={`availability ${doctor.available ? 'available-yes' : 'available-no'}`}
      >
        {doctor.available ? 'Available' : 'Unavailable'}
      </span>
    </div>
  );
}

export default DoctorsPage;
