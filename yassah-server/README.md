# Yassah Accounting Firm - Backend Server

Node.js/Express backend API for managing client data (referrals, appointments, newsletter subscriptions).

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas cloud account)

## Installation

1. Navigate to the server folder:
```bash
cd yassah-server
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
copy .env.example .env
```

4. Edit `.env` file with your configuration:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/yassah-accounting
JWT_SECRET=your_secure_jwt_secret
```

## Running the Server

### Development mode (with auto-restart):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Referrals
- `POST /api/referrals` - Create new referral
- `GET /api/referrals` - Get all referrals
- `GET /api/referrals/:id` - Get single referral
- `PUT /api/referrals/:id/status` - Update referral status
- `DELETE /api/referrals/:id` - Delete referral

### Appointments
- `POST /api/appointments` - Create new appointment
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/range?startDate=&endDate=` - Get appointments by date range
- `GET /api/appointments/:id` - Get single appointment
- `PUT /api/appointments/:id/status` - Update appointment status
- `PUT /api/appointments/:id` - Update appointment details
- `DELETE /api/appointments/:id` - Delete appointment

### Newsletter
- `POST /api/newsletter` - Subscribe to newsletter
- `GET /api/newsletter` - Get all subscribers
- `GET /api/newsletter/active` - Get active subscribers only
- `GET /api/newsletter/:id` - Get single subscriber
- `PUT /api/newsletter/:id/status` - Activate/deactivate subscriber
- `PUT /api/newsletter/:id/interest` - Update subscriber interest
- `DELETE /api/newsletter/:id` - Delete subscriber
- `POST /api/newsletter/unsubscribe` - Unsubscribe by email

### Health Check
- `GET /api/health` - Check server status

## Database Models

### Referral Schema
```javascript
{
  referrerName: String (required),
  referrerEmail: String (required),
  referredEmail: String (required),
  referralCode: String (required),
  status: 'pending' | 'completed' | 'rewarded',
  rewardAmount: Number,
  date: Date
}
```

### Appointment Schema
```javascript
{
  name: String (required),
  email: String (required),
  phone: String (required),
  date: Date (required),
  time: String (required),
  service: String (required),
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled',
  notes: String,
  createdAt: Date
}
```

### Newsletter Schema
```javascript
{
  name: String (required),
  email: String (required, unique),
  interest: 'tax' | 'bookkeeping' | 'consulting' | 'general',
  subscriptionDate: Date,
  isActive: Boolean
}
```

## Connecting Client Website

Update your client website forms to send data to these API endpoints:

```javascript
// Example: Submit referral
async function submitReferral(data) {
  const response = await fetch('http://localhost:5000/api/referrals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
}
```

## Next Steps

1. Set up MongoDB (local or cloud)
2. Configure environment variables
3. Start the server
4. Test API endpoints
5. Create admin dashboard to consume these APIs
6. Update client website forms to connect to the backend
