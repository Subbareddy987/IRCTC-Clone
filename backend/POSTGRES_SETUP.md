# PostgreSQL setup

## Render backend environment variables

Set these on the backend web service:

```env
DATABASE_URL=your_render_postgres_internal_database_url
JWT_SECRET=your_long_random_secret
PORT=4500
```

Use Render's internal PostgreSQL URL when the backend service and database are both on Render. Use the external URL only when connecting from your laptop.

## Create tables and sample data

After `DATABASE_URL` is set, run this from the `backend` folder:

```bash
npm run db:setup
```

That command runs:

- `database/schema.sql`
- `database/sample_data.sql`

It creates the users, stations, trains, routes, coaches, seats, bookings, passengers, and booked seats tables needed by the backend.

## Check the connection

After redeploying the backend, open:

```text
https://irctc-backend-r0p7.onrender.com/api/health
```

If PostgreSQL is connected, it returns a success message. If the database is not connected, it returns the database error so the problem is easier to find.

## Frontend API URL

Set this on the frontend static site if the backend URL changes:

```env
VITE_API_URL=https://irctc-backend-r0p7.onrender.com/api
```
