// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });

    // Smooth Scrolling for Navigation Links
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
            
            // Handle Free Events and Paid Events navigation
            const linkText = this.textContent.trim();
            
            // Remove active class from all nav links
            document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');
            
            if (linkText === 'Free Events') {
                // Trigger Free Events category filter
                setTimeout(() => {
                    const freeBtn = document.querySelector('[data-category="free"]');
                    if (freeBtn) {
                        document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                        freeBtn.classList.add('active');
                        freeBtn.click();
                    }
                }, 500);
            } else if (linkText === 'Paid Events') {
                // Trigger Paid Events category filter
                setTimeout(() => {
                    const paidBtn = document.querySelector('[data-category="paid"]');
                    if (paidBtn) {
                        document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                        paidBtn.classList.add('active');
                        paidBtn.click();
                    }
                }, 500);
            }
        });
    });

    // Category Filter System
    const categoryBtns = document.querySelectorAll('.category-btn');
    const eventCategories = document.querySelectorAll('.event-category');
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            categoryBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const selectedCategory = this.dataset.category;
            
            // Filter events based on selected category
            eventCategories.forEach(category => {
                if (selectedCategory === 'all' || category.dataset.category === selectedCategory) {
                    category.style.display = 'block';
                    // Re-trigger animation
                    category.style.animation = 'none';
                    setTimeout(() => {
                        category.style.animation = '';
                    }, 10);
                } else {
                    category.style.display = 'none';
                }
            });
        });
    });

    // Populate Event Dropdown in Registration Form
    const eventSelect = document.getElementById('event');
    const allEvents = [];
    
    // Collect all events from all categories
    document.querySelectorAll('.event-table tbody tr').forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 3) {
            const eventName = cells[1].textContent.trim();
            const categoryName = row.closest('.event-category').querySelector('h3').textContent.trim();
            allEvents.push({
                name: eventName,
                category: categoryName,
                fee: cells[3].textContent.trim()
            });
        }
    });
    
    // Sort events alphabetically
    allEvents.sort((a, b) => a.name.localeCompare(b.name));
    
    // Populate dropdown
    allEvents.forEach(event => {
        const option = document.createElement('option');
        option.value = event.name;
        option.textContent = `${event.name} (${event.category}) - ${event.fee}`;
        eventSelect.appendChild(option);
    });

    // Form Validation and Submission
    const registerForm = document.querySelector('.register-form');
    
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Basic validation
        if (!data.name || !data.email || !data.phone || !data.college || !data.event) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Phone validation (basic)
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(data.phone) || data.phone.length < 10) {
            showNotification('Please enter a valid phone number', 'error');
            return;
        }
        
        // Simulate form submission
        showNotification('Registration submitted successfully! We will contact you soon.', 'success');
        
        // Reset form
        this.reset();
        
        // Log the data (in a real application, this would be sent to a server)
        console.log('Registration Data:', data);
    });

    // Notification System
    function showNotification(message, type = 'info') {
        // Remove any existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            max-width: 300px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        `;
        
        // Set background color based on type
        switch(type) {
            case 'success':
                notification.style.background = 'linear-gradient(135deg, #10B981, #059669)';
                break;
            case 'error':
                notification.style.background = 'linear-gradient(135deg, #EF4444, #DC2626)';
                break;
            default:
                notification.style.background = 'linear-gradient(135deg, #3B82F6, #2563EB)';
        }
        
        // Add to page
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 5000);
    }

    // Add CSS animations for notifications
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Navbar Background on Scroll
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.style.background = 'rgba(15, 23, 42, 0.98)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.background = 'rgba(15, 23, 42, 0.95)';
            navbar.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
    });

    // Add hover effect to table rows
    document.querySelectorAll('.event-table tbody tr').forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.cursor = 'pointer';
        });
        
        row.addEventListener('click', function() {
            const cells = this.querySelectorAll('td');
            if (cells.length >= 3) {
                const eventName = cells[1].textContent.trim();
                const eventFee = cells[3].textContent.trim();
                showNotification(`${eventName} - Registration Fee: ${eventFee}`, 'info');
            }
        });
    });

    // Search Functionality (Bonus Feature)
    function addSearchFeature() {
        const eventsSection = document.querySelector('.events-section');
        const container = eventsSection.querySelector('.container');
        
        // Create search bar
        const searchBar = document.createElement('div');
        searchBar.className = 'search-container';
        searchBar.innerHTML = `
            <div class="search-box">
                <i class="fas fa-search"></i>
                <input type="text" id="eventSearch" placeholder="Search events...">
                <button id="clearSearch" class="clear-btn">Clear</button>
            </div>
        `;
        
        // Add search styles
        const searchStyles = document.createElement('style');
        searchStyles.textContent = `
            .search-container {
                margin-bottom: 2rem;
                text-align: center;
            }
            
            .search-box {
                display: inline-flex;
                align-items: center;
                background: rgba(30, 41, 59, 0.8);
                border: 1px solid rgba(107, 70, 193, 0.3);
                border-radius: 50px;
                padding: 0.75rem 1.5rem;
                max-width: 500px;
                width: 100%;
                backdrop-filter: blur(10px);
            }
            
            .search-box i {
                color: var(--accent-color);
                margin-right: 1rem;
            }
            
            #eventSearch {
                background: transparent;
                border: none;
                color: var(--light-text);
                flex: 1;
                outline: none;
                font-size: 1rem;
            }
            
            #eventSearch::placeholder {
                color: var(--muted-text);
            }
            
            .clear-btn {
                background: rgba(245, 158, 11, 0.2);
                border: 1px solid var(--accent-color);
                color: var(--accent-color);
                padding: 0.5rem 1rem;
                border-radius: 25px;
                cursor: pointer;
                font-size: 0.875rem;
                transition: all 0.3s ease;
                margin-left: 0.5rem;
            }
            
            .clear-btn:hover {
                background: var(--accent-color);
                color: var(--dark-bg);
            }
        `;
        document.head.appendChild(searchStyles);
        
        // Insert search bar before event categories
        const eventCategories = document.querySelector('.event-categories');
        container.insertBefore(searchBar, eventCategories);
        
        // Search functionality
        const searchInput = document.getElementById('eventSearch');
        const clearBtn = document.getElementById('clearSearch');
        
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            document.querySelectorAll('.event-category').forEach(category => {
                let hasVisibleEvent = false;
                
                category.querySelectorAll('.event-table tbody tr').forEach(row => {
                    const eventName = row.cells[1].textContent.toLowerCase();
                    const eventNature = row.cells[2].textContent.toLowerCase();
                    
                    if (eventName.includes(searchTerm) || eventNature.includes(searchTerm)) {
                        row.style.display = '';
                        hasVisibleEvent = true;
                    } else {
                        row.style.display = 'none';
                    }
                });
                
                // Show/hide category based on whether it has visible events
                category.style.display = hasVisibleEvent ? '' : 'none';
            });
            
            // Show clear button if there's text
            clearBtn.style.display = searchTerm ? 'inline-block' : 'none';
        });
        
        clearBtn.addEventListener('click', function() {
            searchInput.value = '';
            searchInput.dispatchEvent(new Event('input'));
        });
        
        // Initially hide clear button
        clearBtn.style.display = 'none';
    }

    // Initialize search feature
    addSearchFeature();

    // Add loading animation for images (if any are added later)
    function addImageLoadingSupport() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.addEventListener('load', function() {
                this.style.animation = 'fadeIn 0.5s ease';
            });
            
            img.addEventListener('error', function() {
                this.style.display = 'none';
            });
        });
    }

    // Performance optimization: Debounce scroll events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Apply debounce to scroll handler
    window.addEventListener('scroll', debounce(function() {
        // Scroll-related functions here
    }, 100));

    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // Press 'Escape' to close mobile menu
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        }
        
        // Press '/' to focus search (if not in input field)
        if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
            e.preventDefault();
            const searchInput = document.getElementById('eventSearch');
            if (searchInput) {
                searchInput.focus();
            }
        }
    });

    // Initialize tooltips for better UX
    function addTooltips() {
        const tooltipElements = document.querySelectorAll('[title]');
        tooltipElements.forEach(element => {
            const title = element.getAttribute('title');
            element.removeAttribute('title');
            
            element.addEventListener('mouseenter', function(e) {
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = title;
                tooltip.style.cssText = `
                    position: absolute;
                    background: rgba(15, 23, 42, 0.95);
                    color: var(--light-text);
                    padding: 0.5rem 1rem;
                    border-radius: 6px;
                    font-size: 0.875rem;
                    z-index: 10000;
                    pointer-events: none;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(107, 70, 193, 0.3);
                `;
                
                document.body.appendChild(tooltip);
                
                const rect = element.getBoundingClientRect();
                tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
                tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
            });
            
            element.addEventListener('mouseleave', function() {
                const tooltip = document.querySelector('.tooltip');
                if (tooltip) {
                    tooltip.remove();
                }
            });
        });
    }

    // Initialize tooltips
    addTooltips();

    console.log('Genero\'26 website initialized successfully!');
});
