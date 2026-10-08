# HealthTrack

A modern healthcare management dashboard built with **React + Vite + Tailwind CSS**.  
All data is persisted in **localStorage** (no backend required).

## Features

- Authentication (Login / Register) with role support (Admin, Doctor, Patient)
- Admin Dashboard with live stats
- Patients management (CRUD)
- Appointments list + status updates
- Doctors directory
- Medical Records
- Book Appointment form
- Settings / Profile

## Demo Accounts

| Role    | Email                      | Password    |
|---------|----------------------------|-------------|
| Admin   | admin@healthtrack.com      | admin123    |
| Doctor  | sarah@healthtrack.com      | doctor123   |
| Patient | ayesha@example.com         | patient123  |

## Quick Start

```bash
cd healthtrack
npm install
npm run dev
```

Open http://localhost:5173

## Tech Stack

- React 18
- React Router v6
- Tailwind CSS
- React Hook Form + Zod
- Lucide React icons
- localStorage as data layer

## Project Structure

```
src/
├── components/
│   ├── layout/     # Sidebar, Layout
│   └── ui/         # StatCard, Badge
├── context/        # AuthContext
├── hooks/          # useLocalStorage
├── pages/          # All screens
└── utils/          # storage helpers + seed data
```

## Notes

- Data is stored in the browser. Clearing site data resets everything.
- Passwords are stored in plain text for demo purposes only.
- To reset the app: open Settings → Clear All Data, or run `localStorage.clear()` in the console.
