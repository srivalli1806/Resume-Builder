// Main JavaScript file for Resume Builder
document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize popovers
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add fade-in animation to elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe all cards and sections
    document.querySelectorAll('.card, .feature-card, .step-card, .template-card').forEach(el => {
        observer.observe(el);
    });

    // Form validation
    const forms = document.querySelectorAll('.needs-validation');
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    });

    // Auto-save functionality for forms
    let autoSaveTimeout;
    const formInputs = document.querySelectorAll('input, textarea, select');
    
    formInputs.forEach(input => {
        input.addEventListener('input', function() {
            clearTimeout(autoSaveTimeout);
            autoSaveTimeout = setTimeout(() => {
                saveFormData();
            }, 2000); // Auto-save after 2 seconds of inactivity
        });
    });

    // Save form data to localStorage
    function saveFormData() {
        const formData = {};
        formInputs.forEach(input => {
            if (input.name || input.id) {
                const key = input.name || input.id;
                formData[key] = input.value;
            }
        });
        localStorage.setItem('resumeBuilderFormData', JSON.stringify(formData));
    }

    // Load form data from localStorage
    function loadFormData() {
        const savedData = localStorage.getItem('resumeBuilderFormData');
        if (savedData) {
            const formData = JSON.parse(savedData);
            Object.keys(formData).forEach(key => {
                const input = document.querySelector(`[name="${key}"], #${key}`);
                if (input) {
                    input.value = formData[key];
                }
            });
        }
    }

    // Load saved data on page load
    loadFormData();

    // Show loading spinner
    function showLoading(element) {
        element.classList.add('loading');
        element.innerHTML = '<div class="spinner mx-auto"></div>';
    }

    // Hide loading spinner
    function hideLoading(element, originalContent) {
        element.classList.remove('loading');
        element.innerHTML = originalContent;
    }

    // Show notification
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    // Utility function to format dates
    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short' 
        });
    }

    // Utility function to validate email
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Utility function to validate phone
    function validatePhone(phone) {
        const re = /^[\+]?[1-9][\d]{0,15}$/;
        return re.test(phone.replace(/[\s\-\(\)]/g, ''));
    }

    // Export utility functions to global scope
    window.ResumeBuilder = {
        showLoading,
        hideLoading,
        showNotification,
        formatDate,
        validateEmail,
        validatePhone,
        saveFormData,
        loadFormData
    };

    // Handle responsive navigation
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        // Close mobile menu when clicking on a link
        const navLinks = navbarCollapse.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 992) {
                    navbarCollapse.classList.remove('show');
                }
            });
        });
    }

    // Handle scroll effects
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });

    // Initialize any page-specific functionality
    const currentPage = window.location.pathname;
    
    if (currentPage === '/') {
        // Home page specific code
        initializeHomePage();
    } else if (currentPage === '/builder') {
        // Builder page specific code
        initializeBuilderPage();
    } else if (currentPage === '/templates') {
        // Templates page specific code
        initializeTemplatesPage();
    }
});

// Home page initialization
function initializeHomePage() {
    // Add any home page specific functionality here
    console.log('Home page initialized');
}

// Builder page initialization
function initializeBuilderPage() {
    // This will be handled by builder.js
    console.log('Builder page detected');
}

// Templates page initialization
function initializeTemplatesPage() {
    // Add any templates page specific functionality here
    console.log('Templates page initialized');
    
    // Template selection functionality
    const templateCards = document.querySelectorAll('.template-card');
    templateCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove active class from all cards
            templateCards.forEach(c => c.classList.remove('active'));
            // Add active class to clicked card
            this.classList.add('active');
            
            // Get template ID and redirect to builder
            const templateId = this.dataset.template;
            if (templateId) {
                window.location.href = `/builder?template=${templateId}`;
            }
        });
    });
}

// Global error handler
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    ResumeBuilder.showNotification('An error occurred. Please try again.', 'danger');
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    ResumeBuilder.showNotification('An error occurred. Please try again.', 'danger');
}); 