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
  emailjs.init("C-PLz14pAAXDZ_fQf");
})();

// Contact Form Handler
function handleContactSubmit(event) {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const subject = document.getElementById('subject').value;
  const message = document.getElementById('message').value;

  // Show loading state
  const submitButton = event.target.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Sending...';
  submitButton.disabled = true;

  // Send email using EmailJS
  emailjs.send("service_d1yrrdf", "template_d6ydexa", {
    from_name: name,
    from_email: email,
    subject: subject,
    message: message,
    to_email: "abassshaban45@gmail.com"
  })
  .then(function() {
    alert('Thank you! Your message has been sent successfully.');
    event.target.reset();
  })
  .catch(function(error) {
    alert('Sorry, there was an error sending your message. Please try again or email us directly at abassshaban45@gmail.com');
    console.error('EmailJS error:', error);
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
