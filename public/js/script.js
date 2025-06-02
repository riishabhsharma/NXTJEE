// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Form submission handling
  const form = document.getElementById('answer-key-form');
  const submitButton = document.getElementById('submit-button');
  const submitText = document.getElementById('submit-text');
  const loadingSpinner = document.getElementById('loading-spinner');
  const successMessage = document.getElementById('success-message');
  
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form values
      const answerKeyLink = document.getElementById('answerKeyLink').value;
      const examDate = document.getElementById('examDate').value;
      const shift = document.getElementById('shift').value;
      
      // Validate form
      if (!answerKeyLink || !examDate || !shift) {
        return;
      }
      
      // Show loading state
      submitButton.disabled = true;
      submitText.classList.add('hidden');
      loadingSpinner.classList.remove('hidden');
      
      // Simulate API call
      setTimeout(function() {
        // Hide loading state
        submitButton.disabled = false;
        submitText.classList.remove('hidden');
        loadingSpinner.classList.add('hidden');
        
        // Show success message
        form.classList.add('hidden');
        successMessage.classList.remove('hidden');
        
        // Reset form after 3 seconds
        setTimeout(function() {
          form.reset();
          form.classList.remove('hidden');
          successMessage.classList.add('hidden');
        }, 3000);
      }, 2000);
    });
    
    // Form validation
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(function(input) {
      input.addEventListener('input', function() {
        validateForm();
      });
    });
    
    function validateForm() {
      const answerKeyLink = document.getElementById('answerKeyLink').value;
      const examDate = document.getElementById('examDate').value;
      const shift = document.getElementById('shift').value;
      
      if (answerKeyLink && examDate && shift) {
        submitButton.disabled = false;
      } else {
        submitButton.disabled = true;
      }
    }
    
    // Initial validation
    validateForm();
  }
  
  // Smooth scrolling for navigation links
  const navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        scrollToElement(targetId.substring(1));
      }
    });
  });
});

// Scroll to element by ID
function scrollToElement(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    window.scrollTo({
      top: element.offsetTop - 80, // Offset for header
      behavior: 'smooth'
    });
  }
}

// Scroll to top function
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// Add animation classes on scroll
document.addEventListener('scroll', function() {
  const animatedElements = document.querySelectorAll('.feature-card, .stat-card');
  
  animatedElements.forEach(function(element) {
    const position = element.getBoundingClientRect();
    
    // If element is in viewport
    if (position.top < window.innerHeight && position.bottom >= 0) {
      element.classList.add('animated');
    }
  });
});