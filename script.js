
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

  // Prevent default link behavior
  event.preventDefault();
}

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

// Initialize EmailJS
(function() {
  try {
    emailjs.init("C-PLz14pAAXDZ_fQf");
    console.log("EmailJS initialized successfully");
  } catch (error) {
    console.error("EmailJS initialization error:", error);
  }
})();

// Contact Form Handler
function handleContactSubmit(event) {
  event.preventDefault();
  console.log("Form submitted");

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const subject = document.getElementById('subject').value;
  const message = document.getElementById('message').value;

  console.log("Form data:", { name, email, subject, message });

  // Show loading state
  const submitButton = event.target.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Sending...';
  submitButton.disabled = true;

  // Check if EmailJS is loaded
  if (typeof emailjs === 'undefined') {
    console.error("EmailJS is not loaded");
    alert('Error: EmailJS library not loaded. Please check your internet connection.');
    submitButton.textContent = originalText;
    submitButton.disabled = false;
    return;
  }

  console.log("Sending email via EmailJS...");

  // Send email using EmailJS
  emailjs.send("service_d1yrrdf", "template_d6ydexa", {
    from_name: name,
    from_email: email,
    subject: subject,
    message: message,
    to_email: "abassshaban45@gmail.com"
  })
  .then(function(response) {
    console.log("Email sent successfully:", response);
    alert('Thank you! Your message has been sent successfully.');
    event.target.reset();
  })
  .catch(function(error) {
    console.error('EmailJS error:', error);
    alert('Sorry, there was an error sending your message. Error: ' + JSON.stringify(error));
  })
  .finally(function() {
    submitButton.textContent = originalText;
    submitButton.disabled = false;
  });
}

// Initialize - Show home page by default
document.addEventListener('DOMContentLoaded', function() {
  showPage('home');
});
