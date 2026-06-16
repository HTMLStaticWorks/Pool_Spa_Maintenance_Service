/* ==========================================================================
   POOL & SPA MAINTENANCE SERVICE - PREMIUM VANILLA JAVASCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Core Features
  initTheme();
  initDirection();
  initNavbar();
  initScrollTop();
  initStatsCounters();
  initBeforeAfterSlider();
  initSeasonalSelector();
  initFaqAccordion();
  initCountdown();
  initFormValidation();
});

/* ==========================================================================
   1. Theme Management (Dark Mode)
   ========================================================================== */
function initTheme() {
  const themeToggles = document.querySelectorAll('.theme-toggle');
  const savedTheme = localStorage.getItem('theme') || 'light';
  
  // Apply saved theme
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcons(savedTheme);
  
  themeToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcons(newTheme);
    });
  });
}

function updateThemeIcons(theme) {
  const themeToggles = document.querySelectorAll('.theme-toggle');
  themeToggles.forEach(toggle => {
    const icon = toggle.querySelector('i');
    if (icon) {
      if (theme === 'dark') {
        icon.className = 'fas fa-sun';
      } else {
        icon.className = 'fas fa-moon';
      }
    }
  });
}

/* ==========================================================================
   2. Direction Management (RTL Support)
   ========================================================================== */
function initDirection() {
  const rtlToggles = document.querySelectorAll('.rtl-toggle');
  const savedDir = localStorage.getItem('direction') || 'ltr';
  
  // Apply saved direction
  document.documentElement.setAttribute('dir', savedDir);
  updateRtlButtonText(savedDir);
  
  rtlToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
      const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
      
      document.documentElement.setAttribute('dir', newDir);
      localStorage.setItem('direction', newDir);
      updateRtlButtonText(newDir);
    });
  });
}

function updateRtlButtonText(direction) {
  const rtlToggles = document.querySelectorAll('.rtl-toggle');
  rtlToggles.forEach(toggle => {
    const label = toggle.querySelector('.rtl-label');
    if (label) {
      if (direction === 'rtl') {
        label.textContent = 'LTR';
      } else {
        label.textContent = 'RTL';
      }
    }
  });
}

/* ==========================================================================
   3. Sticky Navbar & Mobile Hamburger Menu
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector('header');
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  
  // Sticky scroll class addition
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('sticky');
      } else {
        header.classList.remove('sticky');
      }
    });
  }
  
  // Hamburger toggle action
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
  }
  
  // Close menu when clicking link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (hamburger && navMenu) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });
  });
}

/* ==========================================================================
   4. Scroll To Top Button
   ========================================================================== */
function initScrollTop() {
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (!scrollTopBtn) return;
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });
  
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   5. Count-Up Stats/Counters
   ========================================================================== */
function initStatsCounters() {
  const counters = document.querySelectorAll('.stat-num');
  if (counters.length === 0) return;
  
  const countUp = (counter) => {
    const target = parseInt(counter.getAttribute('data-target'), 10);
    const speed = 200; // lower is faster
    const increment = target / speed;
    let current = 0;
    
    const updateCount = () => {
      current += increment;
      if (current < target) {
        counter.textContent = Math.ceil(current);
        setTimeout(updateCount, 1);
      } else {
        counter.textContent = target + (counter.getAttribute('data-suffix') || '');
      }
    };
    updateCount();
  };
  
  // Intersection Observer to trigger when scrolled into view
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  counters.forEach(counter => observer.observe(counter));
}

/* ==========================================================================
   6. Before & After Interactive Slider
   ========================================================================== */
function initBeforeAfterSlider() {
  const slider = document.querySelector('.ba-slider');
  if (!slider) return;
  
  const afterImage = slider.querySelector('.ba-after');
  const handle = slider.querySelector('.ba-slider-handle');
  const button = slider.querySelector('.ba-slider-button');
  
  let isDragging = false;
  
  const moveSlider = (clientX) => {
    const rect = slider.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    
    // Bounds check
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    
    // Check direction for RTL
    const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
    const displayPercentage = isRtl ? (100 - percentage) : percentage;
    
    afterImage.style.width = `${displayPercentage}%`;
    handle.style.left = `${percentage}%`;
    button.style.left = `${percentage}%`;
  };
  
  // Mouse events
  slider.addEventListener('mousedown', (e) => {
    isDragging = true;
    moveSlider(e.clientX);
  });
  
  window.addEventListener('mouseup', () => {
    isDragging = false;
  });
  
  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    moveSlider(e.clientX);
  });
  
  // Touch events for mobile compatibility
  slider.addEventListener('touchstart', (e) => {
    isDragging = true;
    moveSlider(e.touches[0].clientX);
  });
  
  window.addEventListener('touchend', () => {
    isDragging = false;
  });
  
  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    moveSlider(e.touches[0].clientX);
  });
}

/* ==========================================================================
   7. Seasonal Program Selector
   ========================================================================== */
function initSeasonalSelector() {
  const tabs = document.querySelectorAll('.season-tab');
  const panels = document.querySelectorAll('.season-panel');
  if (tabs.length === 0) return;
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const season = tab.getAttribute('data-season');
      
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      
      tab.classList.add('active');
      const targetPanel = document.getElementById(`season-${season}`);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   8. FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const questions = document.querySelectorAll('.faq-question');
  if (questions.length === 0) return;
  
  questions.forEach(q => {
    q.addEventListener('click', () => {
      const parent = q.parentElement;
      const isActive = parent.classList.contains('active');
      
      // Close other FAQs
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
      });
      
      if (!isActive) {
        parent.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   9. Countdown Timer (Coming Soon Page)
   ========================================================================== */
function initCountdown() {
  const countdownBoxes = document.querySelectorAll('.countdown-box');
  if (countdownBoxes.length === 0) return;
  
  // Set target date (e.g. 60 days from now)
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 60);
  
  const updateTimer = () => {
    const now = new Date().getTime();
    const difference = targetDate - now;
    
    if (difference <= 0) {
      clearInterval(timerInterval);
      return;
    }
    
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    
    const dVal = document.getElementById('daysVal');
    const hVal = document.getElementById('hoursVal');
    const mVal = document.getElementById('minutesVal');
    const sVal = document.getElementById('secondsVal');
    
    if (dVal) dVal.textContent = days.toString().padStart(2, '0');
    if (hVal) hVal.textContent = hours.toString().padStart(2, '0');
    if (mVal) mVal.textContent = minutes.toString().padStart(2, '0');
    if (sVal) sVal.textContent = seconds.toString().padStart(2, '0');
  };
  
  updateTimer();
  const timerInterval = setInterval(updateTimer, 1000);
}

/* ==========================================================================
   10. Custom Premium Form Validations
   ========================================================================== */
function initFormValidation() {
  const forms = document.querySelectorAll('.validated-form');
  if (forms.length === 0) return;
  
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      let hasError = false;
      const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
      
      inputs.forEach(input => {
        const errorMsg = input.parentElement.querySelector('.error-msg');
        let isValid = true;
        
        if (!input.value.trim()) {
          isValid = false;
        } else if (input.type === 'email' && !validateEmail(input.value)) {
          isValid = false;
        } else if (input.type === 'tel' && !validatePhone(input.value)) {
          isValid = false;
        }
        
        if (!isValid) {
          hasError = true;
          input.style.borderColor = 'hsl(0, 75%, 60%)';
          if (errorMsg) {
            errorMsg.style.display = 'block';
          }
        } else {
          input.style.borderColor = '';
          if (errorMsg) {
            errorMsg.style.display = 'none';
          }
        }
      });
      
      if (hasError) {
        e.preventDefault();
      } else {
        e.preventDefault(); // Prevents actual redirect in static demo
        
        // Show Success Visual Response
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Submitted Successfully';
        submitBtn.style.background = 'linear-gradient(135deg, var(--secondary-light), var(--secondary-color))';
        
        setTimeout(() => {
          form.reset();
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
          
          if (form.id === 'loginForm' || form.id === 'registerForm') {
            window.location.href = 'dashboard.html';
          }
        }, 1500);
      }
    });
  });
}

function validateEmail(email) {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase());
}

function validatePhone(phone) {
  // Simple validation for international format or 10 digit numbers
  const re = /^\+?[0-9\s\-()]{8,18}$/;
  return re.test(String(phone));
}
