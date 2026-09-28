# Yassah Admin Dashboard

Admin dashboard for managing client data (referrals, appointments, newsletter subscriptions).

## Features

- **Dashboard Overview**: View statistics and recent activity
- **Referral Management**: View, update status, and delete referrals
- **Appointment Management**: View, confirm, cancel, and delete appointments
- **Newsletter Management**: View subscribers, toggle subscription status, export data
- **Data Export**: Export data to CSV files

## Prerequisites

- Backend server must be running on `http://localhost:5000`
- See `../yassah-server/README.md` for server setup

## Usage

1. Open `index.html` in a web browser
2. Navigate between sections using the sidebar
3. View and manage data in each section

## Sections

### Dashboard
- Total referrals count
- Total appointments count
- Newsletter subscriber count
- Pending rewards amount
- Recent activity feed

### Referrals
- View all referrals
- Update referral status (pending/completed/rewarded)
- Delete referrals
- Export to CSV

### Appointments
- View all appointments
- Update appointment status (pending/confirmed/completed/cancelled)
- Delete appointments
- Export to CSV

### Newsletter
- View all subscribers
- Toggle subscription status (active/inactive)
- Delete subscribers
- Export to CSV

## API Connection

The dashboard connects to the backend API at:
```
http://localhost:5000/api
```

To change the API URL, edit `admin.js`:
```javascript
const API_BASE_URL = 'http://your-server-url/api';
```

## Next Steps

1. Start the backend server
2. Open the admin dashboard in a browser
3. Update client website forms to send data to the backend API
