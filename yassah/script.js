// API Configuration
const API_BASE_URL = (window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1' ||
                      window.location.protocol === 'file:')
  ? 'http://localhost:5000/api'
  : 'https://yassah-server.onrender.com/api';

// Page Navigation
function showPage(pageName) {
  // Hide all pages
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => {
    page.classList.remove('active');
  });

  // Show the selected page
  const selectedPage = document.getElementById(pageName + '-page');
  if (selectedPage) {
    selectedPage.classList.add('active');
  }

  // Scroll to top
  window.scrollTo(0, 0);

  // Close dropdown if open
  const dropdown = document.getElementById('featuresDropdown');
  if (dropdown) {
    dropdown.classList.remove('show');
  }

  // Prevent default link behavior
  if (event) {
    event.preventDefault();
  }
}

// Tax Deadline Countdown
function startCountdown() {
  // Set the deadline to a specific date (June 30, 2027 - tax deadline)
  const deadline = new Date('June 30, 2027 23:59:59').getTime();

  // Update countdown every second using setInterval loop
  const interval = setInterval(function() {
    const now = new Date().getTime();
    const distance = deadline - now;

    // Calculate time components
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Update the display
    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');

    // Stop countdown if deadline reached
    if (distance < 0) {
      clearInterval(interval);
      document.getElementById('days').textContent = '0';
      document.getElementById('hours').textContent = '00';
      document.getElementById('minutes').textContent = '00';
      document.getElementById('seconds').textContent = '00';
    }
  }, 1000);
}

// Start countdown when page loads
document.addEventListener('DOMContentLoaded', startCountdown);

// FAQ Accordion
function toggleFAQ(button) {
  const faqItem = button.parentElement;
  const isActive = faqItem.classList.contains('active');

  // Close all FAQ items
  const allFAQItems = document.querySelectorAll('.faq-item');
  allFAQItems.forEach(item => {
    item.classList.remove('active');
  });

  // Open the clicked item if it wasn't already open
  if (!isActive) {
    faqItem.classList.add('active');
  }
}

// Contact Form Handler
async function handleContactSubmit(event) {
  event.preventDefault();

  const name = document.getElementById('contactName').value;
  const email = document.getElementById('contactEmail').value;
  const phone = document.getElementById('contactPhone').value;
  const subject = document.getElementById('contactSubject').value;
  const message = document.getElementById('contactMessage').value;

  try {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        subject,
        message
      })
    });

    if (response.ok) {
      alert('Thank you! Your message has been sent successfully and saved to our database.');
      event.target.reset();
    } else {
      const error = await response.json();
      alert(error.error || 'Failed to send message. Please try again.');
    }
  } catch (error) {
    console.error('Error submitting contact form:', error);
    alert('Failed to connect to server. Please try again later.');
  }
}

// Plan Selection Handler
function selectPlan(plan) {
  const planDetails = {
    free: {
      name: 'Free Plan',
      price: 'Ksh0.00/month',
      features: 'Basic Tax Consultation, Monthly Financial Tips, Email Support, Access to Blog Resources'
    },
    premium: {
      name: 'Premium Plan',
      price: 'Ksh99/month',
      features: 'Full Tax Preparation, Complete Bookkeeping, Financial Consulting, Audit Services, Priority Support, Monthly Reports, Dedicated Accountant'
    },
    enterprise: {
      name: 'Enterprise Plan',
      price: 'Ksh299/month',
      features: 'All Premium Features, Multi-entity Support, Custom Solutions, 24/7 Phone Support, On-site Consultation, Training Sessions, Integration Services'
    }
  };

  const selectedPlan = planDetails[plan];
  
  // Create mailto link with plan details
  const subject = `Subscription Inquiry - ${selectedPlan.name}`;
  const message = `I am interested in subscribing to the ${selectedPlan.name} (${selectedPlan.price})\n\nFeatures included:\n${selectedPlan.features}\n\nPlease provide more information about getting started.`;
  
  const mailtoLink = `mailto:abassshaban45@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;

  // Open email client
  window.location.href = mailtoLink;

  // Show confirmation
  alert(`Thank you for your interest in the ${selectedPlan.name}! Your email client should open to complete your subscription.`);
}

// Dark Mode Toggle
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const isDarkMode = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDarkMode);
}

// Load saved dark mode preference
function loadDarkModePreference() {
  const savedDarkMode = localStorage.getItem('darkMode');
  if (savedDarkMode === 'true') {
    document.body.classList.add('dark-mode');
    const toggle = document.getElementById('darkModeToggle');
    if (toggle) toggle.checked = true;
  }
}

// Modal Functions
function openModal(modalType) {
  document.getElementById(modalType + 'Modal').style.display = 'flex';
}

function closeModal(modalType) {
  document.getElementById(modalType + 'Modal').style.display = 'none';
}

// Profile Save Handler
function saveProfile(event) {
  event.preventDefault();
  const name = document.getElementById('profileName').value;
  const email = document.getElementById('profileEmail').value;
  const phone = document.getElementById('profilePhone').value;
  const bio = document.getElementById('profileBio').value;

  // Save to localStorage
  localStorage.setItem('profileName', name);
  localStorage.setItem('profileEmail', email);
  localStorage.setItem('profilePhone', phone);
  localStorage.setItem('profileBio', bio);

  alert('Profile saved successfully!');
  closeModal('profile');
  event.target.reset();
}

// Password Change Handler
function changePassword(event) {
  event.preventDefault();
  const currentPassword = document.getElementById('currentPassword').value;
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (newPassword !== confirmPassword) {
    alert('New passwords do not match!');
    return;
  }

  if (newPassword.length < 8) {
    alert('Password must be at least 8 characters long!');
    return;
  }

  alert('Password changed successfully!');
  closeModal('password');
  event.target.reset();
}

// Referral Code Functions
function copyReferralCode() {
  const referralCode = document.querySelector('.referral-code input');
  referralCode.select();
  document.execCommand('copy');
  alert('Referral code copied to clipboard!');
}

function shareReferral() {
  const referralCode = 'YASSAH-2026-REF';
  const subject = 'Join Yassah Accounting Firm!';
  const message = `I've been using Yassah Accounting Firm for my accounting needs and thought you might be interested. Use my referral code ${referralCode} to get 10% off your first month!\n\nCheck them out at: https://yassah-accounting-firm.com`;
  
  const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
  window.location.href = mailtoLink;
}

// AI Chat Functions
function toggleAIChat() {
  const aiChat = document.getElementById('aiChat');
  aiChat.style.display = aiChat.style.display === 'none' ? 'block' : 'none';
}

function sendAIMessage() {
  const chatInput = document.getElementById('chatInput');
  const message = chatInput.value.trim();
  
  if (message === '') return;

  const chatMessages = document.getElementById('chatMessages');
  
  // Add user message
  const userMessage = document.createElement('div');
  userMessage.className = 'chat-message user';
  userMessage.innerHTML = `<span class="message-sender">You:</span><span class="message-text">${message}</span>`;
  chatMessages.appendChild(userMessage);
  
  chatInput.value = '';
  
  // Simulate AI response
  setTimeout(() => {
    const aiMessage = document.createElement('div');
    aiMessage.className = 'chat-message ai';
    
    const responses = [
      "I can help you with tax preparation questions. What specific tax issue are you facing?",
      "For bookkeeping services, I recommend keeping detailed records of all transactions. Would you like tips on organizing your financial data?",
      "Financial consulting is one of our core services. I can provide guidance on budgeting, cash flow management, and investment evaluation.",
      "Audit services help ensure compliance and identify risks. Would you like to know more about our audit process?",
      "I'd be happy to help! Could you provide more details about your accounting needs?",
      "That's a great question! Our team specializes in various accounting services. Let me connect you with the right information.",
      "For subscription inquiries, please check our pricing section or contact our sales team directly."
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    aiMessage.innerHTML = `<span class="message-sender">AI:</span><span class="message-text">${randomResponse}</span>`;
    chatMessages.appendChild(aiMessage);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 1000);
  
  // Scroll to bottom
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function handleChatKeypress(event) {
  if (event.key === 'Enter') {
    sendAIMessage();
  }
}

// Delete Account Handler
function confirmDeleteAccount() {
  if (confirm('Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.')) {
    if (confirm('This is your last chance! Are you absolutely sure you want to proceed?')) {
      alert('Account deletion request submitted. You will receive a confirmation email shortly.');
      // In a real application, this would call an API to delete the account
    }
  }
}

// Close modal when clicking outside
window.onclick = function(event) {
  if (event.target.classList.contains('modal')) {
    event.target.style.display = 'none';
  }
}

// Chatbot Widget Functions
function toggleChatbot() {
  const chatbotWindow = document.getElementById('chatbotWindow');
  chatbotWindow.classList.toggle('active');
}

function sendChatbotMessage() {
  const chatbotInput = document.getElementById('chatbotInput');
  const message = chatbotInput.value.trim();
  
  if (message === '') return;

  const chatbotMessages = document.getElementById('chatbotMessages');
  
  // Add user message
  const userMessageDiv = document.createElement('div');
  userMessageDiv.className = 'chatbot-message user';
  userMessageDiv.innerHTML = `
    <div class="message-content">
      <p>${message}</p>
    </div>
    <span class="message-time">Just now</span>
  `;
  chatbotMessages.appendChild(userMessageDiv);
  
  chatbotInput.value = '';
  
  // Simulate bot response
  setTimeout(() => {
    const botMessageDiv = document.createElement('div');
    botMessageDiv.className = 'chatbot-message bot';
    
    const responses = [
      "I can help you with tax preparation questions. What specific tax issue are you facing?",
      "For bookkeeping services, I recommend keeping detailed records of all transactions. Would you like tips on organizing your financial data?",
      "Financial consulting is one of our core services. I can provide guidance on budgeting, cash flow management, and investment evaluation.",
      "Audit services help ensure compliance and identify risks. Would you like to know more about our audit process?",
      "I'd be happy to help! Could you provide more details about your accounting needs?",
      "That's a great question! Our team specializes in various accounting services. Let me connect you with the right information.",
      "For subscription inquiries, please check our pricing section or contact our sales team directly.",
      "Hello! I'm here to assist with any accounting-related questions you may have.",
      "Our firm offers comprehensive accounting services including tax preparation, bookkeeping, and financial consulting.",
      "Would you like to schedule a consultation with one of our accountants?"
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    botMessageDiv.innerHTML = `
      <div class="message-content">
        <p>${randomResponse}</p>
      </div>
      <span class="message-time">Just now</span>
    `;
    chatbotMessages.appendChild(botMessageDiv);
    
    // Scroll to bottom
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }, 1000);
  
  // Scroll to bottom
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function handleChatbotKeypress(event) {
  if (event.key === 'Enter') {
    sendChatbotMessage();
  }
}

// Statistics Counter Animation
function animateStats() {
  const statNumbers = document.querySelectorAll('.stat-number');
  
  statNumbers.forEach(stat => {
    const target = parseInt(stat.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
      current += increment;
      if (current < target) {
        stat.textContent = Math.ceil(current);
        requestAnimationFrame(updateCounter);
      } else {
        stat.textContent = target;
      }
    };
    
    updateCounter();
  });
}

// Tax Deadline Countdown
function updateDeadlineTimer() {
  const taxDeadline = new Date('2026-12-31T23:59:59');
  const now = new Date();
  const diff = taxDeadline - now;
  
  if (diff > 0) {
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
  }
}

// Testimonials Carousel
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial-card');

function showTestimonial(index) {
  testimonials.forEach((card, i) => {
    card.classList.remove('active');
    if (i === index) {
      card.classList.add('active');
    }
  });
  
  // Update dots
  const dots = document.querySelectorAll('.testimonial-dot');
  dots.forEach((dot, i) => {
    dot.classList.remove('active');
    if (i === index) {
      dot.classList.add('active');
    }
  });
}

function nextTestimonial() {
  currentTestimonial = (currentTestimonial + 1) % testimonials.length;
  showTestimonial(currentTestimonial);
}

function prevTestimonial() {
  currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
  showTestimonial(currentTestimonial);
}

// Initialize testimonial dots
function initTestimonialDots() {
  const dotsContainer = document.getElementById('testimonialDots');
  testimonials.forEach((_, index) => {
    const dot = document.createElement('span');
    dot.className = 'testimonial-dot' + (index === 0 ? ' active' : '');
    dot.onclick = () => showTestimonial(index);
    dotsContainer.appendChild(dot);
  });
}

// ROI Calculator
function calculateROI() {
  const revenue = parseFloat(document.getElementById('monthlyRevenue').value) || 0;
  const expenses = parseFloat(document.getElementById('monthlyExpenses').value) || 0;
  const hours = parseFloat(document.getElementById('accountingHours').value) || 0;
  const hourlyRate = parseFloat(document.getElementById('hourlyRate').value) || 0;
  
  const timeSavings = hours * 4 * hourlyRate;
  const costReduction = (revenue - expenses) * 0.15;
  const annualROI = ((timeSavings + costReduction) / (99 * 12)) * 100;
  
  document.getElementById('timeSavings').textContent = 'Ksh' + (isNaN(timeSavings) ? '0.00' : timeSavings.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}));
  document.getElementById('costReduction').textContent = 'Ksh' + (isNaN(costReduction) ? '0.00' : costReduction.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}));
  document.getElementById('annualROI').textContent = (isNaN(annualROI) ? '0.00' : annualROI.toFixed(2)) + '%';
}

// Budget Planner
function updateBudget() {
  const totalBudget = parseFloat(document.getElementById('totalBudget').value) || 0;
  const operations = parseFloat(document.getElementById('operationsBudget').value) || 0;
  const payroll = parseFloat(document.getElementById('payrollBudget').value) || 0;
  const marketing = parseFloat(document.getElementById('marketingBudget').value) || 0;
  const maintenance = parseFloat(document.getElementById('maintenanceBudget').value) || 0;
  const utilities = parseFloat(document.getElementById('utilitiesBudget').value) || 0;
  
  const totalAllocated = operations + payroll + marketing + maintenance + utilities;
  const remaining = totalBudget - totalAllocated;
  const utilization = totalBudget > 0 ? (totalAllocated / totalBudget) * 100 : 0;
  
  document.getElementById('totalAllocated').textContent = 'Ksh' + (isNaN(totalAllocated) ? '0.00' : totalAllocated.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}));
  document.getElementById('remainingBudget').textContent = 'Ksh' + (isNaN(remaining) ? '0.00' : remaining.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}));
  document.getElementById('budgetUtilization').textContent = (isNaN(utilization) ? '0.00' : utilization.toFixed(2)) + '%';
  
  // Update budget chart
  updateBudgetChart(operations, payroll, marketing, maintenance, utilities, totalBudget);
}

function updateBudgetChart(operations, payroll, marketing, maintenance, utilities, totalBudget) {
  const chart = document.getElementById('budgetChart');
  const values = [operations, payroll, marketing, maintenance, utilities];
  const colors = ['#27187e', '#4a3f9e', '#6b5fa8', '#8c7fb2', '#ad9fbc'];
  
  chart.innerHTML = '';
  
  values.forEach((value, index) => {
    const height = totalBudget > 0 ? (value / totalBudget) * 100 : 0;
    const bar = document.createElement('div');
    bar.style.cssText = `
      width: 15%;
      height: ${height}%;
      background: ${colors[index]};
      border-radius: 5px 5px 0 0;
      transition: height 0.3s ease;
    `;
    chart.appendChild(bar);
  });
}

// Blog Filtering
function filterBlog(category) {
  const cards = document.querySelectorAll('.blog-card');
  const buttons = document.querySelectorAll('.blog-category');
  
  buttons.forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  
  cards.forEach(card => {
    if (category === 'all' || card.getAttribute('data-category') === category) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

// Newsletter Handler
async function handleNewsletterSubmit(event) {
  event.preventDefault();
  
  const name = document.getElementById('newsletterName').value;
  const email = document.getElementById('newsletterEmail').value;
  const interest = document.getElementById('newsletterInterest').value;
  
  try {
    const response = await fetch(`${API_BASE_URL}/newsletter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        email,
        interest: interest || 'general'
      })
    });
    
    if (response.ok) {
      alert(`Thank you ${name}! You've been successfully subscribed to our newsletter.`);
      event.target.reset();
    } else {
      const error = await response.json();
      alert(error.error || 'Failed to subscribe. Please try again.');
    }
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    alert('Failed to connect to server. Please try again later.');
  }
}

// Appointment Handler
async function handleAppointmentSubmit(event) {
  event.preventDefault();
  
  const name = document.getElementById('appointmentName').value;
  const email = document.getElementById('appointmentEmail').value;
  const phone = document.getElementById('appointmentPhone').value;
  const date = document.getElementById('appointmentDate').value;
  const time = document.getElementById('appointmentTime').value;
  const service = document.getElementById('appointmentService').value;
  
  try {
    const response = await fetch(`${API_BASE_URL}/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        date,
        time,
        service
      })
    });
    
    if (response.ok) {
      alert('Thank you! Your appointment request has been submitted successfully. We will confirm shortly.');
      event.target.reset();
    } else {
      const error = await response.json();
      alert(error.error || 'Failed to submit appointment. Please try again.');
    }
  } catch (error) {
    console.error('Error submitting appointment:', error);
    alert('Failed to connect to server. Please try again later.');
  }
}

// Currency Converter
const exchangeRates = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  KES: 129.50,
};

function convertCurrency() {
  const amount = parseFloat(document.getElementById('currencyAmount').value) || 0;
  const fromCurrency = document.getElementById('fromCurrency').value;
  const toCurrency = document.getElementById('toCurrency').value;
  
  const fromRate = exchangeRates[fromCurrency];
  const toRate = exchangeRates[toCurrency];
  
  const result = (amount / fromRate) * toRate;
  const rate = (1 / fromRate) * toRate;
  
  document.getElementById('currencyResult').innerHTML = `
    <span class="result-amount">${toCurrency} ${(isNaN(result) ? '0.00' : result.toFixed(2))}</span>
    <span class="result-rate">1 ${fromCurrency} = ${(isNaN(rate) ? '0.00' : rate.toFixed(2))} ${toCurrency}</span>
  `;
}

// Tax Deduction Finder
const deductionData = {
  individual: [
    { icon: '🏠', title: 'Home Office Deduction', desc: 'Deduct expenses for your home office if you work from home', value: 'Up to Ksh1,500/year' },
    { icon: '🚗', title: 'Vehicle Expenses', desc: 'Deduct mileage, gas, insurance for business use', value: 'Ksh0.67/mile (2026)' },
    { icon: '📚', title: 'Education & Training', desc: 'Deduct costs for work-related education and courses', value: 'Up to Ksh5,250/year' }
  ],
  business: [
    { icon: '🏢', title: 'Business Equipment', desc: 'Deduct cost of computers, software, and equipment', value: 'Up to Ksh25,000/year' },
    { icon: '👥', title: 'Employee Benefits', desc: 'Deduct health insurance, retirement plans', value: 'Full deduction' },
    { icon: '📦', title: 'Inventory Costs', desc: 'Deduct cost of goods sold and inventory', value: 'Full deduction' }
  ],
  freelancer: [
    { icon: '💻', title: 'Software & Tools', desc: 'Deduct subscriptions and software costs', value: 'Full deduction' },
    { icon: '☕', title: 'Home Office', desc: 'Deduct portion of rent and utilities', value: 'Based on square footage' },
    { icon: '📱', title: 'Phone & Internet', desc: 'Deduct business portion of phone and internet', value: 'Pro-rated deduction' }
  ],
  investor: [
    { icon: '📈', title: 'Investment Expenses', desc: 'Deduct investment management fees', value: 'Subject to limits' },
    { icon: '🏠', title: 'Rental Property', desc: 'Deduct mortgage interest, repairs, depreciation', value: 'Full deduction' },
    { icon: '💰', title: 'Capital Losses', desc: 'Offset capital gains with losses', value: 'Up to Ksh3,000/year' }
  ]
};

function findDeductions() {
  const category = document.getElementById('deductionCategory').value;
  const deductions = deductionData[category];
  const resultsContainer = document.getElementById('deductionResults');
  
  resultsContainer.innerHTML = '';
  
  deductions.forEach(deduction => {
    const item = document.createElement('div');
    item.className = 'deduction-item';
    item.innerHTML = `
      <div class="deduction-icon">${deduction.icon}</div>
      <div class="deduction-info">
        <h4>${deduction.title}</h4>
        <p>${deduction.desc}</p>
        <span class="deduction-value">${deduction.value}</span>
      </div>
    `;
    resultsContainer.appendChild(item);
  });
}

// Referral Program Functions
function copyReferralLink() {
  const linkInput = document.querySelector('.referral-link input');
  linkInput.select();
  document.execCommand('copy');
  alert('Referral link copied to clipboard!');
}

// Update Referral Earnings
function updateReferralEarnings() {
  const referralCount = parseFloat(document.getElementById('referralCount').textContent) || 0;
  const perReferralAmount = 20;
  const totalEarnings = referralCount * perReferralAmount;
  
  document.getElementById('referralCount').textContent = (isNaN(referralCount) ? '0.00' : referralCount.toFixed(2));
  document.getElementById('referralEarnings').textContent = 'Ksh' + (isNaN(totalEarnings) ? '0.00' : totalEarnings.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}));
  document.getElementById('perReferral').textContent = 'Ksh' + perReferralAmount.toFixed(2);
}

function shareReferralEmail() {
  const subject = 'Join Yassah Accounting Firm!';
  const message = `I've been using Yassah Accounting Firm and thought you might be interested. Use my referral link to get 10% off your first month!\n\nhttps://yassah-accounting.com/ref/YOURCODE`;
  
  const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
  window.location.href = mailtoLink;
}

function shareReferralSocial() {
  alert('Social sharing feature coming soon! For now, you can copy the referral link and share it manually.');
}

// Referral Form Handler
async function handleReferralSubmit(event) {
  event.preventDefault();
  
  const referrerName = document.getElementById('referrerName').value;
  const referrerEmail = document.getElementById('referrerEmail').value;
  const referredEmail = document.getElementById('referredEmail').value;
  const referralCode = document.getElementById('referralCode').value;
  
  try {
    const response = await fetch(`${API_BASE_URL}/referrals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        referrerName,
        referrerEmail,
        referredEmail,
        referralCode
      })
    });
    
    if (response.ok) {
      alert('Thank you! Your referral has been submitted successfully.');
      event.target.reset();
    } else {
      const error = await response.json();
      alert(error.error || 'Failed to submit referral. Please try again.');
    }
  } catch (error) {
    console.error('Error submitting referral:', error);
    alert('Failed to connect to server. Please try again later.');
  }
}

// Dropdown Toggle
function toggleDropdown() {
  const dropdown = document.getElementById('featuresDropdown');
  dropdown.classList.toggle('show');
}

// Close dropdown when clicking outside
window.onclick = function(event) {
  if (!event.target.matches('.dropdown-btn')) {
    const dropdowns = document.getElementsByClassName('dropdown-content');
    for (let i = 0; i < dropdowns.length; i++) {
      const openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
  
  // Close modal when clicking outside
  if (event.target.classList.contains('modal')) {
    event.target.style.display = 'none';
  }
}

// Blog Content Data
const blogContent = {
  'tax-deductions': {
    title: 'Maximize Your Tax Deductions in 2026',
    image: 'pics/yas2.webp',
    content: `
      <h3>Understanding Tax Deductions</h3>
      <p>Tax deductions can significantly reduce your taxable income and save you money. Here are the key deductions you should be aware of in 2026:</p>
      
      <h3>Business Expenses</h3>
      <ul>
        <li><strong>Office Supplies:</strong> Deduct costs for paper, pens, printers, and other office essentials</li>
        <li><strong>Software & Subscriptions:</strong> Accounting software, cloud storage, and business tools</li>
        <li><strong>Travel Expenses:</strong> Business trips, including flights, hotels, and meals</li>
        <li><strong>Marketing Costs:</strong> Advertising, website hosting, and promotional materials</li>
      </ul>
      
      <h3>Home Office Deduction</h3>
      <p>If you work from home, you may qualify for the home office deduction. This allows you to deduct a portion of your rent, utilities, and insurance based on the square footage used exclusively for business.</p>
      
      <h3>Retirement Contributions</h3>
      <p>Contributions to retirement accounts like 401(k)s and IRAs can reduce your taxable income. For 2026, the contribution limits have increased, allowing you to save more for retirement while lowering your tax bill.</p>
      
      <h3>Professional Development</h3>
      <p>Investing in your education and professional skills is deductible. This includes courses, certifications, conferences, and industry publications that enhance your business capabilities.</p>
    `
  },
  'bookkeeping-best-practices': {
    title: 'Essential Bookkeeping Best Practices',
    image: 'pics/yas3.webp',
    content: `
      <h3>Why Bookkeeping Matters</h3>
      <p>Accurate bookkeeping is the foundation of a healthy business. It provides insights into your financial health, ensures compliance with tax regulations, and helps you make informed decisions.</p>
      
      <h3>Daily Recording</h3>
      <ul>
        <li>Record all transactions daily to avoid backlog</li>
        <li>Separate personal and business finances</li>
        <li>Use accounting software for automation</li>
        <li>Keep receipts and documentation organized</li>
      </ul>
      
      <h3>Monthly Reconciliation</h3>
      <p>Reconcile your bank accounts, credit cards, and other financial statements monthly. This ensures your records match actual bank activity and helps identify discrepancies early.</p>
      
      <h3>Accounts Payable & Receivable</h3>
      <p>Track money owed to suppliers (accounts payable) and money owed to you (accounts receivable). Regular monitoring helps maintain cash flow and build strong vendor relationships.</p>
      
      <h3>Financial Reports</h3>
      <p>Generate key financial reports monthly:</p>
      <ul>
        <li><strong>Balance Sheet:</strong> Shows assets, liabilities, and equity</li>
        <li><strong>Income Statement:</strong> Shows revenue and expenses</li>
        <li><strong>Cash Flow Statement:</strong> Tracks cash movement</li>
      </ul>
    `
  },
  'cash-flow-management': {
    title: 'Cash Flow Management Strategies',
    image: 'pics/yas6.jpeg',
    content: `
      <h3>The Importance of Cash Flow</h3>
      <p>Cash flow is the lifeblood of any business. Even profitable businesses can fail if they run out of cash. Effective cash flow management ensures you have enough liquidity to meet obligations and seize opportunities.</p>
      
      <h3>Forecasting</h3>
      <p>Create cash flow forecasts for the next 3-6 months. This helps you anticipate shortfalls and plan accordingly. Consider seasonal variations and major expenses in your projections.</p>
      
      <h3>Accelerating Inflows</h3>
      <ul>
        <li>Offer early payment discounts to customers</li>
        <li>Send invoices immediately after service delivery</li>
        <li>Implement electronic payment systems</li>
        <li>Follow up on overdue payments promptly</li>
      </ul>
      
      <h3>Managing Outflows</h3>
      <p>Negotiate better payment terms with suppliers. Consider stretching payments without damaging relationships. Prioritize essential expenses and delay non-critical spending when cash is tight.</p>
      
      <h3>Building Reserves</h3>
      <p>Maintain a cash reserve covering 3-6 months of operating expenses. This buffer protects against unexpected events and provides flexibility for growth opportunities.</p>
      
      <h3>Monitoring Tools</h3>
      <p>Use cash flow management software to track real-time cash position. Set up alerts for low balances and review cash flow statements regularly to identify trends and issues.</p>
    `
  },
  'new-tax-regulations': {
    title: 'New Tax Regulations for 2026',
    image: 'pics/yas5.jpg',
    content: `
      <h3>Overview of 2026 Tax Changes</h3>
      <p>Staying compliant with tax regulations is crucial for avoiding penalties and maximizing deductions. Here are the key changes affecting businesses and individuals in 2026:</p>
      
      <h3>Corporate Tax Updates</h3>
      <ul>
        <li>New corporate tax brackets for different income levels</li>
        <li>Changes to depreciation schedules for business assets</li>
        <li>Updated requirements for international tax reporting</li>
        <li>New incentives for green energy investments</li>
      </ul>
      
      <h3>Individual Tax Changes</h3>
      <p>Standard deductions have been adjusted for inflation. The tax brackets have been modified to reflect economic changes. New credits for education and healthcare expenses have been introduced.</p>
      
      <h3>Reporting Requirements</h3>
      <p>Enhanced reporting requirements for digital transactions and cryptocurrency. New forms for reporting foreign assets and income. Stricter deadlines for certain tax filings.</p>
      
      <h3>Compliance Tips</h3>
      <ul>
        <li>Review all tax forms before submission</li>
        <li>Keep detailed records of all transactions</li>
        <li>Stay updated on quarterly tax payment deadlines</li>
        <li>Consult with tax professionals for complex situations</li>
      </ul>
      
      <h3>Planning Opportunities</h3>
      <p>The new regulations offer opportunities for strategic tax planning. Consider timing of income recognition, maximizing available credits, and restructuring business operations where beneficial.</p>
    `
  },
  'year-end-tax-planning': {
    title: 'Year-End Tax Planning Guide',
    image: 'pics/yas3.webp',
    content: `
      <h3>Why Year-End Planning Matters</h3>
      <p>Year-end tax planning can significantly reduce your tax liability and set you up for financial success in the coming year. Here's your comprehensive guide to maximizing tax benefits before December 31st.</p>
      
      <h3>Income Management</h3>
      <ul>
        <li>Defer income to next year if you expect to be in a lower tax bracket</li>
        <li>Accelerate income into current year if you anticipate higher rates</li>
        <li>Review bonus timing and commission payments</li>
        <li>Consider required minimum distributions from retirement accounts</li>
      </ul>
      
      <h3>Expense Acceleration</h3>
      <p>Prepay deductible expenses before year-end. This includes business expenses, medical expenses, and charitable contributions. Ensure you have proper documentation for all deductions.</p>
      
      <h3>Retirement Contributions</h3>
      <p>Maximize contributions to tax-advantaged retirement accounts. For 2026, you can contribute up to the annual limit to 401(k)s, IRAs, and other retirement plans.</p>
      
      <h3>Loss Harvesting</h3>
      <p>Review your investment portfolio for opportunities to harvest losses. Selling investments at a loss can offset capital gains and reduce your taxable income. Be aware of wash-sale rules.</p>
      
      <h3>Charitable Giving</h3>
      <p>Make charitable contributions before year-end to claim deductions. Consider donating appreciated securities for additional tax benefits. Keep receipts and documentation for all donations.</p>
      
      <h3>Business Considerations</h3>
      <p>For business owners, consider equipment purchases under Section 179 expensing, review inventory valuation, and assess employee benefit plans. Consult with your accountant for business-specific strategies.</p>
    `
  },
  'financial-growth': {
    title: 'Financial Planning for Growth',
    image: 'pics/yas1.jpeg',
    content: `
      <h3>Strategic Financial Planning</h3>
      <p>Scaling your business requires careful financial planning and disciplined execution. Here's how to create a roadmap for sustainable growth while maintaining financial health.</p>
      
      <h3>Setting Growth Goals</h3>
      <ul>
        <li>Define clear, measurable growth objectives</li>
        <li>Establish timelines for achieving milestones</li>
        <li>Identify key performance indicators (KPIs)</li>
        <li>Align growth plans with market opportunities</li>
      </ul>
      
      <h3>Capital Allocation</h3>
      <p>Determine how to allocate resources for growth. Balance reinvestment in the business with maintaining adequate cash reserves. Consider debt vs. equity financing for expansion projects.</p>
      
      <h3>Risk Management</h3>
      <p>Identify and mitigate risks associated with growth. This includes market risks, operational risks, and financial risks. Build contingency plans for potential setbacks.</p>
      
      <h3>Financial Projections</h3>
      <p>Create detailed financial projections for different growth scenarios. Model best-case, worst-case, and most-likely outcomes. Regularly update projections based on actual performance.</p>
      
      <h3>Building Financial Resilience</h3>
      <ul>
        <li>Maintain healthy profit margins</li>
        <li>Build cash reserves for emergencies</li>
        <li>Diversify revenue streams</li>
        <li>Strengthen customer relationships</li>
      </ul>
      
      <h3>Measuring Success</h3>
      <p>Track financial metrics that indicate growth success. Monitor revenue growth, profit margins, return on investment, and customer acquisition costs. Adjust strategies based on performance data.</p>
      
      <h3>Professional Guidance</h3>
      <p>Work with financial advisors and accountants who understand your growth objectives. Their expertise can help you navigate complex financial decisions and avoid common pitfalls.</p>
    `
  }
};

// Show Blog Detail Modal
function showBlogDetail(blogId) {
  const modal = document.getElementById('blog-detail-modal');
  const titleElement = document.getElementById('blog-detail-title');
  const imageElement = document.getElementById('blog-detail-image');
  const contentElement = document.getElementById('blog-detail-content');
  
  const blog = blogContent[blogId];
  
  if (blog) {
    titleElement.textContent = blog.title;
    imageElement.innerHTML = `<img src="${blog.image}" alt="${blog.title}">`;
    contentElement.innerHTML = blog.content;
    modal.style.display = 'flex';
    
    // Prevent default link behavior
    if (event) {
      event.preventDefault();
    }
  }
}

// Close Blog Detail Modal
function closeBlogDetail() {
  const modal = document.getElementById('blog-detail-modal');
  modal.style.display = 'none';
}

// User Logout Handler
function handleLogout() {
  localStorage.removeItem('userLoggedIn');
  localStorage.removeItem('userEmail');
  alert('You have been logged out successfully.');
  window.location.href = 'index.html';
}

// Admin Login Handler
function handleAdminLogin(event) {
  event.preventDefault();
  
  const email = document.getElementById('adminEmail').value;
  const password = document.getElementById('adminPassword').value;
  
  // Simple validation (in production, this should be handled server-side)
  if (email && password) {
    // Store admin session
    localStorage.setItem('adminLoggedIn', 'true');
    localStorage.setItem('adminEmail', email);
    
    alert('Login successful! Redirecting to admin dashboard...');
    
    // Redirect to main site or admin dashboard
    window.location.href = 'index.html';
  } else {
    alert('Please enter both email and password.');
  }
}

// Admin Signup Handler
function handleAdminSignup(event) {
  event.preventDefault();
  
  const name = document.getElementById('adminName').value;
  const email = document.getElementById('adminEmail').value;
  const password = document.getElementById('adminPassword').value;
  const confirmPassword = document.getElementById('adminConfirmPassword').value;
  
  // Validation
  if (!name || !email || !password || !confirmPassword) {
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
  localStorage.setItem('adminName', name);
  localStorage.setItem('adminEmail', email);
  localStorage.setItem('adminPassword', password);
  localStorage.setItem('adminLoggedIn', 'true');
  
  alert('Sign up successful! Please login with your credentials.');
  
  // Redirect to login page
  window.location.href = 'index.html';
}

// Check if admin is logged in on page load
document.addEventListener('DOMContentLoaded', function() {
  if (localStorage.getItem('adminLoggedIn') === 'true') {
    // Admin is logged in - you can add admin-specific functionality here
    console.log('Admin is logged in');
  }
});

// Initialize - Show home page by default
document.addEventListener('DOMContentLoaded', function() {
  showPage('home');
  loadDarkModePreference();
  
  // Initialize new features
  animateStats();
  updateDeadlineTimer();
  setInterval(updateDeadlineTimer, 1000);
  initTestimonialDots();
  updateBudget();
  convertCurrency();
  findDeductions();
  updateReferralEarnings();
  
  // Set minimum date for appointment
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('appointmentDate').setAttribute('min', today);
});
