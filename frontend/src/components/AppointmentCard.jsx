/**
 * AppointmentCard Component
 *
 * Props:
 *  - patientName  {string}  Name of the patient
 *  - doctorName   {string}  Name of the doctor
 *  - date         {string}  Appointment date (e.g. "2024-12-25")
 *  - timeSlot     {string}  Appointment time slot (e.g. "10:00 AM")
 *  - status       {string}  One of: "pending" | "confirmed" | "cancelled"
 */
function AppointmentCard({ patientName, doctorName, date, timeSlot, status }) {
  // Map status value to a CSS class
  const statusClass = {
    confirmed: 'status-confirmed',
    pending: 'status-pending',
    cancelled: 'status-cancelled',
  }[status] || 'status-pending';

  return (
    <div className="appointment-card">
      <h3>Appointment Details</h3>

      <div className="appt-detail">
        <span className="label">Patient:</span>
        <span>{patientName}</span>
      </div>

      <div className="appt-detail">
        <span className="label">Doctor:</span>
        <span>{doctorName}</span>
      </div>

      <div className="appt-detail">
        <span className="label">Date:</span>
        <span>{date}</span>
      </div>

      <div className="appt-detail">
        <span className="label">Time Slot:</span>
        <span>{timeSlot}</span>
      </div>

      <div className="appt-detail">
        <span className="label">Status:</span>
        <span className={`status-badge ${statusClass}`}>{status}</span>
      </div>
    </div>
  );
}

export default AppointmentCard;
