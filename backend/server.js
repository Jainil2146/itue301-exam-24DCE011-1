require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import Models (used for Task 5 — MongoDB routes)
const Patient = require('./models/Patient');
const Doctor = require('./models/Doctor');
const Appointment = require('./models/Appointment');

const app = express();
const PORT = process.env.PORT || 5000;

// =============================================================================
// ─── In-Memory Data (Task 3) ──────────────────────────────────────────────────
// Used by the /api/v1/ routes. MongoDB routes (/api/) are handled separately.
// =============================================================================

const inMemoryDoctors = [
  { id: '1', name: 'Dr. Arvind Mehta',  specialisation: 'Cardiologist',       available: true  },
  { id: '2', name: 'Dr. Sunita Rao',    specialisation: 'Dermatologist',       available: true  },
  { id: '3', name: 'Dr. Priya Nair',    specialisation: 'Pediatrician',        available: true  },
  { id: '4', name: 'Dr. Vikram Singh',  specialisation: 'Orthopaedic Surgeon', available: false },
  { id: '5', name: 'Dr. Ananya Pillai', specialisation: 'Gynaecologist',       available: true  },
];

const inMemoryAppointments = [
  {
    id: '1',
    patientName: 'Riya Sharma',
    doctorId: '1',
    doctorName: 'Dr. Arvind Mehta',
    date: '2024-12-20',
    timeSlot: '10:00 AM',
    status: 'confirmed',
    reason: 'Chest pain follow-up',
  },
  {
    id: '2',
    patientName: 'Karan Patel',
    doctorId: '2',
    doctorName: 'Dr. Sunita Rao',
    date: '2024-12-21',
    timeSlot: '02:30 PM',
    status: 'pending',
    reason: 'Skin rash',
  },
];

// Simple auto-increment id for new in-memory appointments
let nextAppointmentId = 3;

// =============================================================================
// ─── Custom Middleware ────────────────────────────────────────────────────────
// =============================================================================

/**
 * requestLogger — logs every incoming request in the format:
 *   [METHOD] [PATH] [TIMESTAMP]
 * Example: [GET] /api/v1/appointments [2026-08-20T10:15:20.000Z]
 */
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${req.method}] ${req.path} [${timestamp}]`);
  next();
};

// Apply requestLogger globally (before all routes)
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// =============================================================================
// ─── MongoDB Connection ───────────────────────────────────────────────────────
// =============================================================================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('[OK] MongoDB connected successfully'))
  .catch((err) => {
    console.warn('[WARN] MongoDB not connected -- in-memory routes still available.');
    console.warn('    Reason:', err.message);
  });

// =============================================================================
// ─── Health Check ────────────────────────────────────────────────────────────
// =============================================================================
app.get('/', (req, res) => {
  res.status(200).json({ message: 'MedCare Plus API is running' });
});

// =============================================================================
// ─── Task 3 Routes  (/api/v1/) — In-Memory ───────────────────────────────────
// =============================================================================

/**
 * GET /api/v1/doctors
 * Returns all doctors from the in-memory array.
 * HTTP 200 on success.
 */
app.get('/api/v1/doctors', (req, res) => {
  res.status(200).json({
    success: true,
    count: inMemoryDoctors.length,
    data: inMemoryDoctors,
  });
});

/**
 * GET /api/v1/appointments
 * Returns all appointments from the in-memory array.
 * HTTP 200 on success.
 */
app.get('/api/v1/appointments', (req, res) => {
  res.status(200).json({
    success: true,
    count: inMemoryAppointments.length,
    data: inMemoryAppointments,
  });
});

/**
 * POST /api/v1/appointments
 * Creates a new appointment and pushes it into the in-memory array.
 * HTTP 201 on success, 400 if required fields are missing.
 */
app.post('/api/v1/appointments', (req, res) => {
  const { patientName, doctorId, date, timeSlot, reason } = req.body;

  // Basic validation
  if (!patientName || !doctorId || !date || !timeSlot) {
    return res.status(400).json({
      success: false,
      error: 'patientName, doctorId, date and timeSlot are required.',
    });
  }

  // Look up doctor name from in-memory list
  const doctor = inMemoryDoctors.find((d) => d.id === doctorId);
  if (!doctor) {
    return res.status(400).json({
      success: false,
      error: `Doctor with id "${doctorId}" not found.`,
    });
  }

  const newAppointment = {
    id: String(nextAppointmentId++),
    patientName,
    doctorId,
    doctorName: doctor.name,
    date,
    timeSlot,
    status: 'pending',
    reason: reason || '',
  };

  inMemoryAppointments.push(newAppointment);

  res.status(201).json({
    success: true,
    data: newAppointment,
  });
});

// =============================================================================
// ─── MongoDB Routes (/api/) — Task 5 ─────────────────────────────────────────
// These routes use Mongoose models and require MONGO_URI in .env.
// =============================================================================

// ── Patient Routes ────────────────────────────────────────────────────────────

app.get('/api/patients', async (req, res, next) => {
  try {
    const patients = await Patient.find();
    res.status(200).json(patients);
  } catch (err) { next(err); }
});

app.get('/api/patients/:id', async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    res.status(200).json(patient);
  } catch (err) { next(err); }
});

app.post('/api/patients', async (req, res, next) => {
  try {
    const patient = new Patient(req.body);
    const saved = await patient.save();
    res.status(201).json(saved);
  } catch (err) { next(err); }
});

app.put('/api/patients/:id', async (req, res, next) => {
  try {
    const updated = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!updated) return res.status(404).json({ error: 'Patient not found' });
    res.status(200).json(updated);
  } catch (err) { next(err); }
});

app.delete('/api/patients/:id', async (req, res, next) => {
  try {
    const deleted = await Patient.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Patient not found' });
    res.status(200).json({ message: 'Patient deleted successfully' });
  } catch (err) { next(err); }
});

// ── Doctor Routes (MongoDB) ───────────────────────────────────────────────────

app.get('/api/doctors', async (req, res, next) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json(doctors);
  } catch (err) { next(err); }
});

app.get('/api/doctors/:id', async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
    res.status(200).json(doctor);
  } catch (err) { next(err); }
});

app.post('/api/doctors', async (req, res, next) => {
  try {
    const doctor = new Doctor(req.body);
    const saved = await doctor.save();
    res.status(201).json(saved);
  } catch (err) { next(err); }
});

app.put('/api/doctors/:id', async (req, res, next) => {
  try {
    const updated = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!updated) return res.status(404).json({ error: 'Doctor not found' });
    res.status(200).json(updated);
  } catch (err) { next(err); }
});

app.delete('/api/doctors/:id', async (req, res, next) => {
  try {
    const deleted = await Doctor.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Doctor not found' });
    res.status(200).json({ message: 'Doctor deleted successfully' });
  } catch (err) { next(err); }
});

// ── Appointment Routes (MongoDB) ──────────────────────────────────────────────

app.get('/api/appointments', async (req, res, next) => {
  try {
    const appointments = await Appointment.find()
      .populate('patientId', 'name email')
      .populate('doctorId', 'name specialisation');
    res.status(200).json(appointments);
  } catch (err) { next(err); }
});

app.get('/api/appointments/:id', async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patientId', 'name email')
      .populate('doctorId', 'name specialisation');
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
    res.status(200).json(appointment);
  } catch (err) { next(err); }
});

app.post('/api/appointments', async (req, res, next) => {
  try {
    const appointment = new Appointment(req.body);
    const saved = await appointment.save();
    res.status(201).json(saved);
  } catch (err) { next(err); }
});

app.put('/api/appointments/:id', async (req, res, next) => {
  try {
    const updated = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!updated) return res.status(404).json({ error: 'Appointment not found' });
    res.status(200).json(updated);
  } catch (err) { next(err); }
});

app.delete('/api/appointments/:id', async (req, res, next) => {
  try {
    const deleted = await Appointment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Appointment not found' });
    res.status(200).json({ message: 'Appointment deleted successfully' });
  } catch (err) { next(err); }
});

// =============================================================================
// ─── Global Error-Handling Middleware ────────────────────────────────────────
// Must be defined LAST, after all routes.
// Returns a structured JSON error instead of exposing the raw stack trace.
// =============================================================================
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const timestamp = new Date().toISOString();
  console.error(`[ERROR] ${req.method} ${req.path} [${timestamp}] — ${err.message}`);

  const statusCode = err.status || err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message || 'Internal Server Error',
      status: statusCode,
      timestamp,
    },
  });
});

// =============================================================================
// ─── Start Server ─────────────────────────────────────────────────────────────
// =============================================================================
app.listen(PORT, () => {
  console.log(`[SERVER] Running on http://localhost:${PORT}`);
  console.log('[API] In-memory endpoints:');
  console.log(`  GET  http://localhost:${PORT}/api/v1/doctors`);
  console.log(`  GET  http://localhost:${PORT}/api/v1/appointments`);
  console.log(`  POST http://localhost:${PORT}/api/v1/appointments`);
});
