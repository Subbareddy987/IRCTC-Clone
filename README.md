# IRCTC Railway Reservation System

A full-stack railway reservation web application inspired by IRCTC workflows. The project brings together train search, route details, user authentication, coach availability, seat selection, booking history, PNR lookup, ticket details, and PostgreSQL-backed data management in one working app.

## Live Demo

- Frontend: https://subbu-irctc-clone.onrender.com/
- Backend health check: https://irctc-backend-r0p7.onrender.com/api/health

## Highlights

- User registration and login with JWT authentication
- Station-to-station train search
- Train route details with stops, timing, and route context
- Coach availability by date and coach type
- Interactive seat selection flow
- Booking creation with passenger details
- My bookings page for authenticated users
- PNR-based booking lookup
- Booking cancellation endpoint
- PostgreSQL schema with sample stations, trains, routes, coaches, seats, and bookings
- Responsive React frontend built with Vite
- Render-ready frontend and backend deployment setup

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Axios
- React Toastify
- QR code support with `qrcode.react`
- CSS modules/files for page-level styling

### Backend

- Node.js
- Express.js
- PostgreSQL
- `pg` database client
- JWT authentication
- bcrypt password hashing
- Node test runner

### Database

- PostgreSQL
- SQL schema and sample seed data included in `database/`

## Project Structure

```text
IRCTC-Clone/
  backend/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
    scripts/
    test/
    server.js
    package.json

  database/
    schema.sql
    sample_data.sql

  frontend/
    public/
    src/
      components/
      pages/
      services/
      styles/
    index.html
    package.json
```

## Getting Started

### Prerequisites

- Node.js
- npm
- PostgreSQL

### 1. Clone the repository

```bash
git clone https://github.com/Subbareddy987/IRCTC-Clone.git
cd IRCTC-Clone
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/irctc
JWT_SECRET=replace_with_a_long_random_secret
PORT=4500
```

Create the database in PostgreSQL, then run:

```bash
npm run db:setup
npm start
```

The backend runs on:

```text
http://localhost:4500
```

Health check:

```text
http://localhost:4500/api/health
```

### 3. Frontend setup

Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside `frontend/`:

```env
VITE_API_URL=http://localhost:4500/api
```

Run the frontend:

```bash
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

## API Overview

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/profile
```

### Stations

```text
GET /api/stations
```

### Trains

```text
GET    /api/trains
POST   /api/trains
PUT    /api/trains/:id
DELETE /api/trains/:id
GET    /api/trains/search
GET    /api/trains/traindata/:train_id
GET    /api/trains/coaches/:train_id
GET    /api/trains/availability
```

### Bookings

```text
POST   /api/bookings
GET    /api/bookings/seats/:train_id
GET    /api/bookings/mybookings
GET    /api/bookings/:booking_id
GET    /api/bookings/pnr/:pnr_number
DELETE /api/bookings/cancel/:booking_id
```

Protected booking and profile routes require:

```text
Authorization: Bearer <token>
```

## Database Setup

The database folder contains:

- `database/schema.sql`: creates all core tables
- `database/sample_data.sql`: inserts sample stations, trains, routes, coaches, and seats

The setup command from the backend folder runs both files:

```bash
npm run db:setup
```

Core tables include:

- `users`
- `stations`
- `trains`
- `train_routes`
- `coaches`
- `seats`
- `bookings`
- `passengers`
- `booked_seats`

## Testing

Run backend tests:

```bash
cd backend
npm test
```

Run frontend linting:

```bash
cd frontend
npm run lint
```

Create a production frontend build:

```bash
cd frontend
npm run build
```

## Deployment Notes

### Backend on Render

Set these environment variables on the backend service:

```env
DATABASE_URL=your_render_postgres_internal_database_url
JWT_SECRET=your_long_random_secret
PORT=4500
```

Recommended build/start commands:

```bash
npm install
npm start
```

### Frontend on Render

Set the frontend environment variable:

```env
VITE_API_URL=https://irctc-backend-r0p7.onrender.com/api
```

Recommended build command:

```bash
npm install && npm run build
```

Recommended publish directory:

```text
dist
```

## Key Pages

- Home
- Login
- Register
- Search Trains
- Train Details
- Coach Availability
- Seat Selection
- Payment
- My Bookings
- PNR Status
- Booking Details
- About Developer

## Developer

Built by Kambam Subba Reddy as a full-stack railway reservation project focused on React, Node.js, Express, PostgreSQL, authentication, and database-driven booking workflows.

## License

This project is built for learning, portfolio, and demonstration purposes.
