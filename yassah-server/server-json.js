const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all origins (in production, specify your frontend domains)
app.use(cors({
  origin: ['https://yassah-accounting.netlify.app', 'https://yassah-admin.netlify.app', 'http://localhost:3000', 'http://localhost:5000', 'file://'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Data file paths
const DATA_DIR = path.join(__dirname, 'data');
const REFERRALS_FILE = path.join(DATA_DIR, 'referrals.json');
const APPOINTMENTS_FILE = path.join(DATA_DIR, 'appointments.json');
const NEWSLETTER_FILE = path.join(DATA_DIR, 'newsletter.json');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    
    // Initialize files if they don't exist
    const files = [
      { path: REFERRALS_FILE, default: [] },
      { path: APPOINTMENTS_FILE, default: [] },
      { path: NEWSLETTER_FILE, default: [] }
    ];
    
    for (const file of files) {
      try {
        await fs.access(file.path);
      } catch {
        await fs.writeFile(file.path, JSON.stringify(file.default, null, 2));
      }
    }
  } catch (error) {
    console.error('Error creating data directory:', error);
  }
}

// Helper functions for file operations
async function readData(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeData(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// Generate unique ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// API Routes

// Referrals
app.post('/api/referrals', async (req, res) => {
  try {
    const { referrerName, referrerEmail, referredEmail, referralCode } = req.body;
    
    const referrals = await readData(REFERRALS_FILE);
    const newReferral = {
      id: generateId(),
      referrerName,
      referrerEmail,
      referredEmail,
      referralCode,
      status: 'pending',
      rewardAmount: 0,
      date: new Date().toISOString()
    };
    
    referrals.push(newReferral);
    await writeData(REFERRALS_FILE, referrals);
    
    res.status(201).json(newReferral);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/referrals', async (req, res) => {
  try {
    const referrals = await readData(REFERRALS_FILE);
    res.json(referrals.sort((a, b) => new Date(b.date) - new Date(a.date)));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/referrals/:id', async (req, res) => {
  try {
    const referrals = await readData(REFERRALS_FILE);
    const referral = referrals.find(r => r.id === req.params.id);
    
    if (!referral) {
      return res.status(404).json({ error: 'Referral not found' });
    }
    
    res.json(referral);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/referrals/:id/status', async (req, res) => {
  try {
    const { status, rewardAmount } = req.body;
    const referrals = await readData(REFERRALS_FILE);
    
    const index = referrals.findIndex(r => r.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Referral not found' });
    }
    
    referrals[index].status = status;
    if (rewardAmount !== undefined) {
      referrals[index].rewardAmount = rewardAmount;
    }
    
    await writeData(REFERRALS_FILE, referrals);
    res.json(referrals[index]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/referrals/:id', async (req, res) => {
  try {
    const referrals = await readData(REFERRALS_FILE);
    const filtered = referrals.filter(r => r.id !== req.params.id);
    
    if (referrals.length === filtered.length) {
      return res.status(404).json({ error: 'Referral not found' });
    }
    
    await writeData(REFERRALS_FILE, filtered);
    res.json({ message: 'Referral deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Appointments
app.post('/api/appointments', async (req, res) => {
  try {
    const { name, email, phone, date, time, service, notes } = req.body;
    
    const appointments = await readData(APPOINTMENTS_FILE);
    const newAppointment = {
      id: generateId(),
      name,
      email,
      phone,
      date,
      time,
      service,
      status: 'pending',
      notes: notes || '',
      createdAt: new Date().toISOString()
    };
    
    appointments.push(newAppointment);
    await writeData(APPOINTMENTS_FILE, appointments);
    
    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/appointments', async (req, res) => {
  try {
    const appointments = await readData(APPOINTMENTS_FILE);
    res.json(appointments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/appointments/:id', async (req, res) => {
  try {
    const appointments = await readData(APPOINTMENTS_FILE);
    const appointment = appointments.find(a => a.id === req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/appointments/:id/status', async (req, res) => {
  try {
    const { status, notes } = req.body;
    const appointments = await readData(APPOINTMENTS_FILE);
    
    const index = appointments.findIndex(a => a.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    appointments[index].status = status;
    if (notes !== undefined) {
      appointments[index].notes = notes;
    }
    
    await writeData(APPOINTMENTS_FILE, appointments);
    res.json(appointments[index]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/appointments/:id', async (req, res) => {
  try {
    const appointments = await readData(APPOINTMENTS_FILE);
    const filtered = appointments.filter(a => a.id !== req.params.id);
    
    if (appointments.length === filtered.length) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    await writeData(APPOINTMENTS_FILE, filtered);
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Newsletter
app.post('/api/newsletter', async (req, res) => {
  try {
    const { name, email, interest } = req.body;
    
    const subscribers = await readData(NEWSLETTER_FILE);
    
    // Check if email already exists
    const existing = subscribers.find(s => s.email === email);
    if (existing) {
      return res.status(400).json({ error: 'Email already subscribed' });
    }
    
    const newSubscriber = {
      id: generateId(),
      name,
      email,
      interest: interest || 'general',
      subscriptionDate: new Date().toISOString(),
      isActive: true
    };
    
    subscribers.push(newSubscriber);
    await writeData(NEWSLETTER_FILE, subscribers);
    
    res.status(201).json(newSubscriber);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/newsletter', async (req, res) => {
  try {
    const subscribers = await readData(NEWSLETTER_FILE);
    res.json(subscribers.sort((a, b) => new Date(b.subscriptionDate) - new Date(a.subscriptionDate)));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/newsletter/:id', async (req, res) => {
  try {
    const subscribers = await readData(NEWSLETTER_FILE);
    const filtered = subscribers.filter(s => s.id !== req.params.id);
    
    if (subscribers.length === filtered.length) {
      return res.status(404).json({ error: 'Subscriber not found' });
    }
    
    await writeData(NEWSLETTER_FILE, filtered);
    res.json({ message: 'Subscriber deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running', storage: 'JSON files' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Initialize and start server
ensureDataDir().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Data will be stored in: ${DATA_DIR}`);
  });
}).catch(error => {
  console.error('Failed to start server:', error);
});
