// API Configuration
const API_BASE_URL = (window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1' ||
                      window.location.protocol === 'file:')
  ? 'http://localhost:5000/api'
  : 'https://yassah-server.onrender.com/api';

// Current section tracking
let currentSection = 'dashboard';
let currentItemId = null;
let currentItemType = null;

// Chart instances
let referralsChart = null;
let appointmentsChart = null;
let newsletterChart = null;
let activityChart = null;
let customerRegistrationChart = null;
let cashFlowChart = null;
let revenueServiceChart = null;
let customerGrowthChart = null;
let servicePopularityChart = null;
let monthlyRevenueChart = null;

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
  // Check authentication
  if (!checkAuthentication()) {
    window.location.href = 'login.html';
    return;
  }

  loadDashboardData();
  setupNavigation();
  setupLogout();
});

// Check authentication
function checkAuthentication() {
  return localStorage.getItem('adminAuthenticated') === 'true';
}

// Setup logout
function setupLogout() {
  const logoutBtn = document.querySelector('.logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('adminAuthenticated');
      localStorage.removeItem('adminUsername');
      window.location.href = 'login.html';
    });
  }
}

// Setup navigation
function setupNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const section = item.dataset.section;
      switchSection(section);
    });
  });
}

// Switch between sections
function switchSection(section) {
  // Update nav items
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
    if (item.dataset.section === section) {
      item.classList.add('active');
    }
  });

  // Update content sections
  document.querySelectorAll('.content-section').forEach(sec => {
    sec.classList.remove('active');
  });
  document.getElementById(`${section}-section`).classList.add('active');

  // Update page title
  const titles = {
    dashboard: 'Dashboard',
    charts: 'Data Analytics & Charts',
    analytics: 'Business Analytics',
    messages: 'Contact Messages',
    referrals: 'Referrals',
    appointments: 'Appointments',
    newsletter: 'Newsletter Subscribers'
  };
  document.getElementById('page-title').textContent = titles[section];

  currentSection = section;

  // Load section-specific data
  if (section === 'dashboard') {
    loadDashboardData();
  } else if (section === 'charts') {
    loadCharts();
  } else if (section === 'analytics') {
    loadAnalytics();
  } else if (section === 'messages') {
    loadMessages();
  } else if (section === 'referrals') {
    loadReferrals();
  } else if (section === 'appointments') {
    loadAppointments();
  } else if (section === 'newsletter') {
    loadNewsletter();
  }
}

// Load dashboard data
async function loadDashboardData() {
  try {
    const [referrals, appointments, newsletter] = await Promise.all([
      fetch(`${API_BASE_URL}/referrals`).then(r => r.json()),
      fetch(`${API_BASE_URL}/appointments`).then(r => r.json()),
      fetch(`${API_BASE_URL}/newsletter`).then(r => r.json())
    ]);

    // Update stats
    document.getElementById('referral-count').textContent = referrals.length;
    document.getElementById('appointment-count').textContent = appointments.length;
    document.getElementById('newsletter-count').textContent = newsletter.length;
    
    const pendingRewards = referrals
      .filter(r => r.status === 'pending')
      .reduce((sum, r) => sum + (r.rewardAmount || 0), 0);
    document.getElementById('pending-rewards').textContent = `KES ${pendingRewards}`;

    // Load recent activity
    loadRecentActivity(referrals, appointments, newsletter);
  } catch (error) {
    console.error('Error loading dashboard data:', error);
  }
}

// Load recent activity
function loadRecentActivity(referrals, appointments, newsletter) {
  const activityList = document.getElementById('recent-list');
  activityList.innerHTML = '';

  const activities = [
    ...referrals.map(r => ({
      type: 'New Referral',
      info: `${r.referrerName} referred ${r.referredEmail}`,
      date: new Date(r.date)
    })),
    ...appointments.map(a => ({
      type: 'New Appointment',
      info: `${a.name} booked ${a.service}`,
      date: new Date(a.createdAt)
    })),
    ...newsletter.map(n => ({
      type: 'New Subscriber',
      info: `${n.name} subscribed to newsletter`,
      date: new Date(n.subscriptionDate)
    }))
  ].sort((a, b) => b.date - a.date).slice(0, 10);

  activities.forEach(activity => {
    const item = document.createElement('div');
    item.className = 'activity-item';
    item.innerHTML = `
      <div class="activity-info">
        <div class="activity-type">${activity.type}</div>
        <div>${activity.info}</div>
        <div class="activity-date">${formatDate(activity.date)}</div>
      </div>
    `;
    activityList.appendChild(item);
  });
}

// Load referrals
async function loadReferrals() {
  try {
    const response = await fetch(`${API_BASE_URL}/referrals`);
    const referrals = await response.json();
    
    const tbody = document.getElementById('referrals-table-body');
    tbody.innerHTML = '';

    referrals.forEach(referral => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${referral.referrerName}</td>
        <td>${referral.referrerEmail}</td>
        <td>${referral.referredEmail}</td>
        <td><span class="status-badge status-${referral.status}">${referral.status}</span></td>
        <td>KES ${referral.rewardAmount || 0}</td>
        <td>${formatDate(new Date(referral.date))}</td>
        <td>
          <button class="action-btn btn-edit" onclick="openStatusModal('${referral.id}', 'referral')">Update Status</button>
          <button class="action-btn btn-delete" onclick="deleteItem('${referral.id}', 'referral')">Delete</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error('Error loading referrals:', error);
  }
}

// Load appointments
async function loadAppointments() {
  try {
    const response = await fetch(`${API_BASE_URL}/appointments`);
    const appointments = await response.json();
    
    const tbody = document.getElementById('appointments-table-body');
    tbody.innerHTML = '';

    appointments.forEach(appointment => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${appointment.name}</td>
        <td>${appointment.email}</td>
        <td>${appointment.phone}</td>
        <td>${formatDate(new Date(appointment.date))}</td>
        <td>${appointment.time}</td>
        <td>${appointment.service}</td>
        <td><span class="status-badge status-${appointment.status}">${appointment.status}</span></td>
        <td>
          <button class="action-btn btn-edit" onclick="openStatusModal('${appointment.id}', 'appointment')">Update Status</button>
          <button class="action-btn btn-delete" onclick="deleteItem('${appointment.id}', 'appointment')">Delete</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error('Error loading appointments:', error);
  }
}

// Load newsletter subscribers
async function loadNewsletter() {
  try {
    const response = await fetch(`${API_BASE_URL}/newsletter`);
    const subscribers = await response.json();
    
    const tbody = document.getElementById('newsletter-table-body');
    tbody.innerHTML = '';

    subscribers.forEach(subscriber => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${subscriber.name}</td>
        <td>${subscriber.email}</td>
        <td>${subscriber.interest}</td>
        <td><span class="status-badge status-${subscriber.isActive ? 'active' : 'inactive'}">${subscriber.isActive ? 'Active' : 'Inactive'}</span></td>
        <td>${formatDate(new Date(subscriber.subscriptionDate))}</td>
        <td>
          <button class="action-btn btn-edit" onclick="toggleSubscription('${subscriber.id}')">Toggle Status</button>
          <button class="action-btn btn-delete" onclick="deleteItem('${subscriber.id}', 'newsletter')">Delete</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error('Error loading newsletter:', error);
  }
}

// Load contact messages
async function loadMessages() {
  try {
    const response = await fetch(`${API_BASE_URL}/contact`);
    const messages = await response.json();
    
    const tbody = document.getElementById('messages-table-body');
    tbody.innerHTML = '';

    messages.forEach(message => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${message.name}</td>
        <td>${message.email}</td>
        <td>${message.phone || 'N/A'}</td>
        <td>${message.subject}</td>
        <td><span class="status-badge status-${message.status}">${message.status}</span></td>
        <td>${formatDate(new Date(message.createdAt))}</td>
        <td>
          <button class="action-btn btn-edit" onclick="openStatusModal('${message._id}', 'message')">Update Status</button>
          <button class="action-btn btn-delete" onclick="deleteItem('${message._id}', 'message')">Delete</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error('Error loading messages:', error);
  }
}

// Open status update modal
function openStatusModal(id, type) {
  currentItemId = id;
  currentItemType = type;
  document.getElementById('status-modal').classList.add('active');
}

// Close modal
function closeModal() {
  document.getElementById('status-modal').classList.remove('active');
  currentItemId = null;
  currentItemType = null;
}

// Confirm status update
async function confirmStatusUpdate() {
  const status = document.getElementById('status-select').value;
  
  try {
    let endpoint;
    if (currentItemType === 'referral') {
      endpoint = `${API_BASE_URL}/referrals/${currentItemId}/status`;
    } else if (currentItemType === 'appointment') {
      endpoint = `${API_BASE_URL}/appointments/${currentItemId}/status`;
    } else if (currentItemType === 'message') {
      endpoint = `${API_BASE_URL}/contact/${currentItemId}/status`;
    }
    
    await fetch(endpoint, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });

    closeModal();
    refreshData();
  } catch (error) {
    console.error('Error updating status:', error);
    alert('Failed to update status');
  }
}

// Toggle newsletter subscription
async function toggleSubscription(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/newsletter/${id}`);
    const subscriber = await response.json();
    
    await fetch(`${API_BASE_URL}/newsletter/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !subscriber.isActive })
    });

    refreshData();
  } catch (error) {
    console.error('Error toggling subscription:', error);
    alert('Failed to toggle subscription');
  }
}

// Delete item
async function deleteItem(id, type) {
  if (!confirm('Are you sure you want to delete this item?')) {
    return;
  }

  try {
    let endpoint;
    if (type === 'referral') {
      endpoint = `${API_BASE_URL}/referrals/${id}`;
    } else if (type === 'appointment') {
      endpoint = `${API_BASE_URL}/appointments/${id}`;
    } else if (type === 'newsletter') {
      endpoint = `${API_BASE_URL}/newsletter/${id}`;
    } else if (type === 'message') {
      endpoint = `${API_BASE_URL}/contact/${id}`;
    }
    
    await fetch(endpoint, {
      method: 'DELETE'
    });

    refreshData();
  } catch (error) {
    console.error('Error deleting item:', error);
    alert('Failed to delete item');
  }
}

// Refresh data
function refreshData() {
  if (currentSection === 'dashboard') {
    loadDashboardData();
  } else if (currentSection === 'charts') {
    loadCharts();
  } else if (currentSection === 'analytics') {
    loadAnalytics();
  } else if (currentSection === 'messages') {
    loadMessages();
  } else if (currentSection === 'referrals') {
    loadReferrals();
  } else if (currentSection === 'appointments') {
    loadAppointments();
  } else if (currentSection === 'newsletter') {
    loadNewsletter();
  }
}

// Load charts
async function loadCharts() {
  try {
    const [referrals, appointments, newsletter] = await Promise.all([
      fetch(`${API_BASE_URL}/referrals`).then(r => r.json()),
      fetch(`${API_BASE_URL}/appointments`).then(r => r.json()),
      fetch(`${API_BASE_URL}/newsletter`).then(r => r.json())
    ]);

    // Referrals by status chart
    const referralStatuses = referrals.reduce((acc, r) => {
      acc[r.status] = (acc[r.status] || 0) + 1;
      return acc;
    }, {});

    createChart('referralsChart', 'pie', {
      labels: Object.keys(referralStatuses),
      datasets: [{
        data: Object.values(referralStatuses),
        backgroundColor: ['#5a4fcf', '#28a745', '#ffc107', '#dc3545'],
        borderWidth: 2
      }]
    });

    // Appointments by status chart
    const appointmentStatuses = appointments.reduce((acc, a) => {
      acc[a.status] = (acc[a.status] || 0) + 1;
      return acc;
    }, {});

    createChart('appointmentsChart', 'doughnut', {
      labels: Object.keys(appointmentStatuses),
      datasets: [{
        data: Object.values(appointmentStatuses),
        backgroundColor: ['#5a4fcf', '#17a2b8', '#28a745', '#dc3545'],
        borderWidth: 2
      }]
    });

    // Newsletter by interest chart
    const newsletterInterests = newsletter.reduce((acc, n) => {
      acc[n.interest] = (acc[n.interest] || 0) + 1;
      return acc;
    }, {});

    createChart('newsletterChart', 'bar', {
      labels: Object.keys(newsletterInterests),
      datasets: [{
        label: 'Subscribers',
        data: Object.values(newsletterInterests),
        backgroundColor: '#5a4fcf',
        borderWidth: 2
      }]
    });

    // Monthly activity chart
    const monthlyActivity = {};
    const allActivities = [
      ...referrals.map(r => ({ type: 'Referral', date: new Date(r.date) })),
      ...appointments.map(a => ({ type: 'Appointment', date: new Date(a.createdAt) })),
      ...newsletter.map(n => ({ type: 'Newsletter', date: new Date(n.subscriptionDate) }))
    ];

    allActivities.forEach(activity => {
      const monthKey = activity.date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      monthlyActivity[monthKey] = (monthlyActivity[monthKey] || 0) + 1;
    });

    createChart('activityChart', 'line', {
      labels: Object.keys(monthlyActivity),
      datasets: [{
        label: 'Total Activity',
        data: Object.values(monthlyActivity),
        borderColor: '#5a4fcf',
        backgroundColor: 'rgba(90, 79, 207, 0.1)',
        fill: true,
        tension: 0.4
      }]
    });

  } catch (error) {
    console.error('Error loading charts:', error);
  }
}

// Load Analytics
function loadAnalytics() {
  try {
    // Customer Registration Rate - Line Chart
    createChart('customerRegistrationChart', 'line', {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        label: 'New Registrations',
        data: [12, 19, 25, 32, 28, 45, 52, 48, 60, 55, 70, 85],
        borderColor: '#5a4fcf',
        backgroundColor: 'rgba(90, 79, 207, 0.1)',
        fill: true,
        tension: 0.4
      }]
    });

    // Cash Flow Analysis - Bar Chart
    createChart('cashFlowChart', 'bar', {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        label: 'Cash Inflow',
        data: [45000, 52000, 48000, 61000, 55000, 72000, 68000, 75000, 82000, 78000, 91000, 95000],
        backgroundColor: '#28a745',
        borderWidth: 2
      }, {
        label: 'Cash Outflow',
        data: [32000, 38000, 35000, 42000, 39000, 48000, 45000, 52000, 58000, 54000, 62000, 68000],
        backgroundColor: '#dc3545',
        borderWidth: 2
      }]
    });

    // Revenue by Service - Pie Chart
    createChart('revenueServiceChart', 'pie', {
      labels: ['Tax Preparation', 'Bookkeeping', 'Audit Services', 'Consulting', 'Financial Planning'],
      datasets: [{
        data: [35, 25, 20, 12, 8],
        backgroundColor: ['#5a4fcf', '#28a745', '#ffc107', '#17a2b8', '#dc3545'],
        borderWidth: 2
      }]
    });

    // Customer Growth Trend - Line Chart
    createChart('customerGrowthChart', 'line', {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        label: 'Total Customers',
        data: [150, 165, 185, 210, 235, 265, 295, 330, 370, 410, 455, 505],
        borderColor: '#17a2b8',
        backgroundColor: 'rgba(23, 162, 184, 0.1)',
        fill: true,
        tension: 0.4
      }]
    });

    // Service Popularity - Doughnut Chart
    createChart('servicePopularityChart', 'doughnut', {
      labels: ['Tax Preparation', 'Bookkeeping', 'Audit Services', 'Consulting', 'Financial Planning'],
      datasets: [{
        data: [40, 30, 15, 10, 5],
        backgroundColor: ['#5a4fcf', '#28a745', '#ffc107', '#17a2b8', '#dc3545'],
        borderWidth: 2
      }]
    });

    // Monthly Revenue - Line Chart
    createChart('monthlyRevenueChart', 'line', {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        label: 'Revenue (KES)',
        data: [45000, 52000, 48000, 61000, 55000, 72000, 68000, 75000, 82000, 78000, 91000, 95000],
        borderColor: '#ffc107',
        backgroundColor: 'rgba(255, 193, 7, 0.1)',
        fill: true,
        tension: 0.4
      }]
    });

  } catch (error) {
    console.error('Error loading analytics:', error);
  }
}

// Create chart
function createChart(canvasId, type, data) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  // Destroy existing chart if it exists
  const existingChart = canvasId === 'referralsChart' ? referralsChart :
                       canvasId === 'appointmentsChart' ? appointmentsChart :
                       canvasId === 'newsletterChart' ? newsletterChart :
                       canvasId === 'activityChart' ? activityChart :
                       canvasId === 'customerRegistrationChart' ? customerRegistrationChart :
                       canvasId === 'cashFlowChart' ? cashFlowChart :
                       canvasId === 'revenueServiceChart' ? revenueServiceChart :
                       canvasId === 'customerGrowthChart' ? customerGrowthChart :
                       canvasId === 'servicePopularityChart' ? servicePopularityChart : monthlyRevenueChart;

  if (existingChart) {
    existingChart.destroy();
  }

  // Create new chart
  const chart = new Chart(canvas, {
    type: type,
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });

  // Store chart instance
  if (canvasId === 'referralsChart') referralsChart = chart;
  else if (canvasId === 'appointmentsChart') appointmentsChart = chart;
  else if (canvasId === 'newsletterChart') newsletterChart = chart;
  else if (canvasId === 'activityChart') activityChart = chart;
  else if (canvasId === 'customerRegistrationChart') customerRegistrationChart = chart;
  else if (canvasId === 'cashFlowChart') cashFlowChart = chart;
  else if (canvasId === 'revenueServiceChart') revenueServiceChart = chart;
  else if (canvasId === 'customerGrowthChart') customerGrowthChart = chart;
  else if (canvasId === 'servicePopularityChart') servicePopularityChart = chart;
  else if (canvasId === 'monthlyRevenueChart') monthlyRevenueChart = chart;
}

// Export data to CSV
async function exportData(type) {
  try {
    const response = await fetch(`${API_BASE_URL}/${type === 'referral' ? 'referrals' : type === 'appointment' ? 'appointments' : 'newsletter'}`);
    const data = await response.json();
    
    const headers = type === 'referral' 
      ? ['Name', 'Email', 'Referred Email', 'Status', 'Reward', 'Date']
      : type === 'appointment'
      ? ['Name', 'Email', 'Phone', 'Date', 'Time', 'Service', 'Status']
      : ['Name', 'Email', 'Interest', 'Status', 'Subscription Date'];
    
    const rows = data.map(item => {
      if (type === 'referral') {
        return [item.referrerName, item.referrerEmail, item.referredEmail, item.status, item.rewardAmount, item.date];
      } else if (type === 'appointment') {
        return [item.name, item.email, item.phone, item.date, item.time, item.service, item.status];
      } else {
        return [item.name, item.email, item.interest, item.isActive, item.subscriptionDate];
      }
    });
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting data:', error);
    alert('Failed to export data');
  }
}

// Format date
function formatDate(date) {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Admin Login Handler
function handleAdminLogin(event) {
  event.preventDefault();
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
  // Simple validation (in production, this should be handled server-side)
  if (username && password) {
    // Store admin session
    localStorage.setItem('adminAuthenticated', 'true');
    localStorage.setItem('adminUsername', username);
    
    alert('Login successful! Redirecting to admin dashboard...');
    
    // Redirect to dashboard
    window.location.href = 'index.html';
  } else {
    alert('Please enter both username and password.');
  }
}

// Admin Signup Handler
function handleAdminSignup(event) {
  event.preventDefault();
  
  const fullName = document.getElementById('full-name').value;
  const email = document.getElementById('email').value;
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  
  // Validation
  if (!fullName || !email || !username || !password || !confirmPassword) {
    alert('Please fill in all fields.');
    return;
  }
  
  if (password !== confirmPassword) {
    alert('Passwords do not match.');
    return;
  }
  
  if (password.length < 6) {
    alert('Password must be at least 6 characters long.');
    return;
  }
  
  // Store admin credentials (in production, this should be handled server-side)
  localStorage.setItem('adminFullName', fullName);
  localStorage.setItem('adminEmail', email);
  localStorage.setItem('adminUsername', username);
  localStorage.setItem('adminPassword', password);
  localStorage.setItem('adminAuthenticated', 'true');
  
  alert('Sign up successful! Redirecting to login...');
  
  // Redirect to login page
  window.location.href = 'login.html';
}

