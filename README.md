# MedCare Plus — Hospital Appointment System

A full-stack Hospital Appointment System built with React, Express.js, and MongoDB.

---

## 1. Project Name

**MedCare Plus** — Manages Doctors, Patients, and Appointments for a private hospital.

---

## 2. Frontend Setup and Run

```bash
cd frontend
npm install
npm run dev
```

The app will start at `http://localhost:5173` (Vite default).

---

## 3. Backend Setup and Run

```bash
cd backend
npm install
npm start
```

The server will start at `http://localhost:5000`.

---

## 4. MongoDB Setup

1. Install [MongoDB Community Edition](https://www.mongodb.com/try/download/community) locally, **or** use a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster.
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Update the `MONGO_URI` in `.env` with your connection string.

---

## 5. Required Environment Variables

Create a `.env` file inside the `backend/` folder (or the root) based on `.env.example`:

| Variable    | Description                          | Example                                        |
|-------------|--------------------------------------|------------------------------------------------|
| `MONGO_URI` | MongoDB connection string            | `mongodb://localhost:27017/medcareplus`        |
| `PORT`      | Port on which the backend server runs | `5000`                                        |

> **Never commit your `.env` file.** It is listed in `.gitignore`.
