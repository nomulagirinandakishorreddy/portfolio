/**
 * Nomula Giri Nanda Kishor Reddy - Personal Portfolio Script
 * Handles Theme Toggle, Mobile Navigation, Smooth Scrolling, Section Observer, and Contact Form.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Theme (Dark / Light)
  initTheme();

  // Initialize Mobile Navigation Toggle
  initMobileNav();

  // Initialize Scroll Active Navigation Link Observer
  initScrollObserver();

  // Initialize Contact Form Submission Handler
  initContactForm();

  // Initialize Back to Top Button
  initBackToTop();
});

/* -------------------------------------------------------------------------- */
/* Theme Switcher Logic                                                       */
/* -------------------------------------------------------------------------- */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Check stored preference or system preference
  const currentTheme = localStorage.getItem('portfolio-theme') || 
                       (prefersDarkScheme.matches ? 'dark' : 'light');

  // Set initial theme
  document.documentElement.setAttribute('data-theme', currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      let theme = document.documentElement.getAttribute('data-theme');
      let newTheme = theme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('portfolio-theme', newTheme);
    });
  }
}

/* -------------------------------------------------------------------------- */
/* Mobile Navigation Handler                                                  */
/* -------------------------------------------------------------------------- */
function initMobileNav() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = navMenu.classList.toggle('active');
      mobileToggle.setAttribute('aria-expanded', isExpanded);
    });

    // Close menu when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', false);
      });
    });

    // Close menu on click outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target) && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', false);
      }
    });
  }
}

/* -------------------------------------------------------------------------- */
/* Intersection Observer for Active Nav Links                                 */
/* -------------------------------------------------------------------------- */
function initScrollObserver() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

/* -------------------------------------------------------------------------- */
/* Contact Form Handler                                                       */
/* -------------------------------------------------------------------------- */
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const subjectInput = document.getElementById('subject');
      const messageInput = document.getElementById('message');

      // Basic validation check
      if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
        showStatus('Please fill in all required fields.', 'error');
        return;
      }

      // Email pattern check
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(emailInput.value.trim())) {
        showStatus('Please enter a valid email address.', 'error');
        return;
      }

      // Send data to Web3Forms API
      showStatus('Sending message...', '');

      const formData = new FormData(contactForm);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })
      .then(async (response) => {
        const json = await response.json();
        if (response.status === 200) {
          showStatus(`Thank you, ${nameInput.value.trim()}! Your message has been sent to Giri's inbox.`, 'success');
          contactForm.reset();
          setTimeout(() => {
            formStatus.style.display = 'none';
          }, 6000);
        } else {
          showStatus(json.message || 'Something went wrong. Please try again.', 'error');
        }
      })
      .catch((error) => {
        console.error(error);
        showStatus('Network error. Unable to send message right now.', 'error');
      });
    });
  }

  function showStatus(message, type) {
    formStatus.textContent = message;
    formStatus.style.display = 'block';
    formStatus.className = type ? `form-status ${type}` : 'form-status';
  }
}

/* -------------------------------------------------------------------------- */
/* Back to Top Smooth Scroll                                                  */
/* -------------------------------------------------------------------------- */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}
