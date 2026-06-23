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

// Contact Form Handler
function handleContactSubmit(event) {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const subject = document.getElementById('subject').value;
  const message = document.getElementById('message').value;

  // Create mailto link
  const mailtoLink = `mailto:abassshaban45@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;

  // Open email client
  window.location.href = mailtoLink;

  // Show success message
  alert('Thank you! Your email client should open shortly.');

  // Reset form
  event.target.reset();
}

// Initialize - Show home page by default
document.addEventListener('DOMContentLoaded', function() {
  showPage('home');
});
