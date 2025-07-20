// Mobile menu toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    // Mobile menu toggle
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            
            // Toggle between hamburger and close icon
            const icon = this.querySelector('i');
            if (mainNav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                
                // Close all submenus when closing main menu
                const activeItems = mainNav.querySelectorAll('.has-submenu.active');
                activeItems.forEach(item => {
                    item.classList.remove('active');
                });
            }
        });
        
        // Handle dropdown toggles on mobile
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', function(e) {
                // Only prevent default and toggle on mobile
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    const parentItem = this.closest('.has-submenu');
                    
                    // Close other open submenus
                    const otherActiveItems = mainNav.querySelectorAll('.has-submenu.active');
                    otherActiveItems.forEach(item => {
                        if (item !== parentItem) {
                            item.classList.remove('active');
                        }
                    });
                    
                    // Toggle current submenu
                    parentItem.classList.toggle('active');
                }
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
                mainNav.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                
                // Close all submenus
                const activeItems = mainNav.querySelectorAll('.has-submenu.active');
                activeItems.forEach(item => {
                    item.classList.remove('active');
                });
            }
        });
        
        // Close menu when window is resized to desktop size
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                mainNav.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                
                // Close all submenus
                const activeItems = mainNav.querySelectorAll('.has-submenu.active');
                activeItems.forEach(item => {
                    item.classList.remove('active');
                });
            }
        });
    }
});

// Enhanced Newsletter subscription form handler
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.getElementById('newsletter-form');
    
    if (newsletterForm) {
        // Add form validation
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        const submitBtn = newsletterForm.querySelector('.subscribe-btn');
        const messageDiv = document.getElementById('newsletter-message');
        
        // Email validation function
        function validateEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }
        
        // Real-time email validation
        if (emailInput) {
            emailInput.addEventListener('input', function() {
                const email = this.value.trim();
                if (email && !validateEmail(email)) {
                    this.setCustomValidity('Please enter a valid email address');
                } else {
                    this.setCustomValidity('');
                }
            });
        }
        
        // Form submission handler
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const form = this;
            const formData = new FormData(form);
            const email = formData.get('email');
            const categories = formData.getAll('categories');
            
            // Validate email before submission
            if (!email || !validateEmail(email)) {
                showMessage('Please enter a valid email address.', 'error');
                return;
            }
            
            // Show loading state
            setLoadingState(true);
            
            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                showMessage('Thank you for subscribing! You will receive financial insights in your inbox.', 'success');
                form.reset();
                setLoadingState(false);
            }, 1000);
        });
        
        // Helper function to show messages
        function showMessage(message, type) {
            if (messageDiv) {
                messageDiv.style.display = 'block';
                messageDiv.className = `newsletter-message ${type}`;
                messageDiv.innerHTML = `
                    <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> 
                    ${message}
                `;
                
                // Auto-hide success messages after 5 seconds
                if (type === 'success') {
                    setTimeout(() => {
                        messageDiv.style.display = 'none';
                    }, 5000);
                }
            }
        }
        
        // Helper function to manage loading state
        function setLoadingState(isLoading) {
            if (submitBtn) {
                submitBtn.disabled = isLoading;
                if (isLoading) {
                    submitBtn.dataset.originalText = submitBtn.innerHTML;
                    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
                } else {
                    submitBtn.innerHTML = submitBtn.dataset.originalText || submitBtn.innerHTML;
                }
            }
        }
        
        // Clear message when user starts typing
        if (emailInput) {
            emailInput.addEventListener('focus', function() {
                if (messageDiv) {
                    messageDiv.style.display = 'none';
                }
            });
        }
    }
});

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.site-header');
    if (header) {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
});
