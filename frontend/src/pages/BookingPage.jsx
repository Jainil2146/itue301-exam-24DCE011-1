import { useState } from 'react';
import AppointmentCard from '../components/AppointmentCard';

// ─── Constants ────────────────────────────────────────────────────────────────
const DOCTORS = [
  { id: '1', name: 'Dr. Arvind Mehta',  specialisation: 'Cardiologist' },
  { id: '2', name: 'Dr. Sunita Rao',    specialisation: 'Dermatologist' },
  { id: '3', name: 'Dr. Priya Nair',    specialisation: 'Pediatrician' },
  { id: '4', name: 'Dr. Vikram Singh',  specialisation: 'Orthopaedic Surgeon' },
  { id: '5', name: 'Dr. Ananya Pillai', specialisation: 'Gynaecologist' },
];

const TIME_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
];

// ─── Initial form state ───────────────────────────────────────────────────────
const EMPTY_FORM = {
  patientName: '',
  date: '',
  timeSlot: '',
  reason: '',
};

// =============================================================================
// BookingPage
//
// STATE VALUES USED:
//   1. formData   — object tracking all form field values (patientName, date,
//                   timeSlot, reason). Patient name is displayed live as it
//                   is typed, demonstrating reactive state.
//   2. selectedDoctor — the full doctor object chosen from the dropdown,
//                       kept separate so we can display doctor details
//                       (name + specialisation) as a live selection preview.
//   3. submitted  — boolean that toggles between the form view and the
//                   confirmation view (with AppointmentCard).
// =============================================================================
function BookingPage() {
  // State 1: form field values
  const [formData, setFormData] = useState(EMPTY_FORM);

  // State 2: selected doctor object (separate from formData so we can access
  //          both id and display name without extra lookups on every render)
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // State 3: submission flag
  const [submitted, setSubmitted] = useState(false);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleFormChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDoctorChange = (e) => {
    const doctor = DOCTORS.find((d) => d.id === e.target.value) || null;
    setSelectedDoctor(doctor);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setFormData(EMPTY_FORM);
    setSelectedDoctor(null);
    setSubmitted(false);
  };

  // ── Confirmation screen ───────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="container" style={{ maxWidth: 620 }}>
        <div className="page-hero">
          <h1>Booking Received!</h1>
          <p>
            Thank you, <strong>{formData.patientName}</strong>. Your appointment
            request is <strong>pending</strong> confirmation.
          </p>
        </div>

        {/* AppointmentCard receives data from state via props */}
        <AppointmentCard
          patientName={formData.patientName}
          doctorName={selectedDoctor ? selectedDoctor.name : 'N/A'}
          date={formData.date}
          timeSlot={formData.timeSlot}
          status="pending"
        />

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <button
            id="book-another-btn"
            className="btn btn-outline"
            onClick={handleReset}
          >
            Book Another Appointment
          </button>
        </div>
      </div>
    );
  }

  // ── Booking form ──────────────────────────────────────────────────────────
  return (
    <div>
      <div className="page-hero">
        <h1>Book an Appointment</h1>
        <p>Fill in the form below to schedule your consultation.</p>
      </div>

      <div className="container booking-layout">

        {/* ── FORM COLUMN ─────────────────────────────────────────────── */}
        <div className="card">
          <form id="booking-form" onSubmit={handleSubmit}>

            {/* ── Patient Information ─────────────────────────────────── */}
            <h2 className="section-title" style={{ marginBottom: '1.25rem' }}>
              Patient Information
            </h2>

            <div className="form-group">
              <label htmlFor="patientName">Full Name *</label>
              <input
                id="patientName"
                name="patientName"
                type="text"
                placeholder="e.g. Riya Sharma"
                value={formData.patientName}
                onChange={handleFormChange}
                required
                autoComplete="off"
              />
              {/* Live display of State 1 — patient name updates as user types */}
              {formData.patientName && (
                <p className="live-preview-text">
                  Booking for: <strong>{formData.patientName}</strong>
                </p>
              )}
            </div>

            {/* ── Appointment Details ─────────────────────────────────── */}
            <h2 className="section-title" style={{ margin: '1.5rem 0 1.25rem' }}>
              Appointment Details
            </h2>

            {/* Doctor selector — updates State 2 */}
            <div className="form-group">
              <label htmlFor="doctorSelect">Select Doctor *</label>
              <select
                id="doctorSelect"
                value={selectedDoctor ? selectedDoctor.id : ''}
                onChange={handleDoctorChange}
                required
              >
                <option value="">— Choose a doctor —</option>
                {DOCTORS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} — {d.specialisation}
                  </option>
                ))}
              </select>
              {/* Live display of State 2 — selected doctor details */}
              {selectedDoctor && (
                <p className="live-preview-text">
                  Selected: <strong>{selectedDoctor.name}</strong>
                  &nbsp;({selectedDoctor.specialisation})
                </p>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label htmlFor="date">Date *</label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="timeSlot">Time Slot *</label>
                <select
                  id="timeSlot"
                  name="timeSlot"
                  value={formData.timeSlot}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Select a time</option>
                  {TIME_SLOTS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reason">Reason for Visit</label>
              <textarea
                id="reason"
                name="reason"
                rows={3}
                placeholder="Briefly describe your symptoms or reason..."
                value={formData.reason}
                onChange={handleFormChange}
              />
            </div>

            <button
              id="submit-booking-btn"
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px' }}
            >
              Submit Booking Request
            </button>
          </form>
        </div>

        {/* ── LIVE PREVIEW COLUMN ─────────────────────────────────────── */}
        <div>
          <h2 className="section-title">Live Preview</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1rem' }}>
            Your appointment card updates as you fill the form.
          </p>
          <AppointmentCard
            patientName={formData.patientName || 'Your Name'}
            doctorName={selectedDoctor ? selectedDoctor.name : 'Select a doctor'}
            date={formData.date || 'Select a date'}
            timeSlot={formData.timeSlot || 'Select a time'}
            status="pending"
          />
        </div>

      </div>
    </div>
  );
}

export default BookingPage;
