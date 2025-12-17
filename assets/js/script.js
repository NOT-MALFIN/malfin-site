// --- Level 1/7: Dynamic JSON Content Loading ---
document.addEventListener('DOMContentLoaded', () => {
    // Load content from external JSON file
    fetch('assets/data/content.json')
        .then(response => response.json())
        .then(data => {
            document.getElementById('about-text').innerHTML = data.content.about_text;
            
            // Render Services
            const servicesGrid = document.getElementById('services-grid');
            data.content.services.forEach(service => {
                const serviceBox = document.createElement('div');
                serviceBox.className = 'service-box neumorphism-card';
                serviceBox.innerHTML = `<h3>${service.title}</h3><p>${service.description}</p>`;
                servicesGrid.appendChild(serviceBox);
            });
        })
        .catch(error => console.error('Error loading content:', error));

    // Initialize all features
    initThemeToggle();
    initPreloader();
    initCounters();
    initContactForm();
    initCookieBanner();
    initModal();
    initTypingText();
    initButtonRipple();
    initLazyLoading();
    // Parallax logic is primarily CSS, but JS helps calculation for smooth scroll
    window.addEventListener('scroll', handleParallax);
});

// --- Level 2: Dark / Light Mode Toggle ---
function initThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    toggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        document.body.classList.toggle('light-theme');
        localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
    });

    // Load saved preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.className = savedTheme + '-theme';
}

// --- Level 3: Loading Screen (Preloader) ---
function initPreloader() {
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        preloader.style.opacity = '0';
        setTimeout(() => { preloader.style.display = 'none'; }, 500);
    });
}

// --- Level 6: Counter Animation on Scroll ---
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                let current = 0;
                const increment = target / 100; // 100 steps
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current > target) {
                        counter.innerText = target;
                        clearInterval(timer);
                        observer.unobserve(counter);
                    } else {
                        counter.innerText = Math.ceil(current);
                    }
                }, 10); // Run faster
            }
        });
    }, { threshold: 0.7 });

    counters.forEach(counter => observer.observe(counter));
}

// --- Level 5: Contact Form Validation and EmailJS Submission ---
function initContactForm() {
    const form = document.getElementById('contact-form');
    const formMessages = document.getElementById('form-messages');

    // Initialize EmailJS with your Public Key
    // NOTE: You must replace 'YOUR_USER_ID' with your actual EmailJS Public Key
    emailjs.init('YOUR_USER_ID');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Simple Form Validation
        const nameInput = form.querySelector('input[name="user_name"]');
        const emailInput = form.querySelector('input[name="user_email"]');
        
        if (!nameInput.value || !emailInput.value) {
            formMessages.innerHTML = '<p class="error">Please fill out all required fields.</p>';
            return;
        }

        formMessages.innerHTML = '<p class="sending">Sending...</p>';
        
        // Send email using EmailJS service
        emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', form)
            .then(() => {
                formMessages.innerHTML = '<p class="success">Message Sent! <i class="fas fa-check-circle"></i></p>'; // Success animation
                form.reset();
                // Level 5: Save form data (optional fields only)
                localStorage.removeItem('formData');
            }, (error) => {
                formMessages.innerHTML = `<p class="error">Failed to send message: ${error.text}</p>`; // Error handling
            });
    });
    
    // Level 5: Save form data in browser (LocalStorage)
    form.addEventListener('input', () => {
        const formData = {
            name: form.querySelector('input[name="user_name"]').value,
            email: form.querySelector('input[name="user_email"]').value,
            message: form.querySelector('textarea[name="message"]').value
        };
        localStorage.setItem('formData', JSON.stringify(formData));
    });

    // Load saved data
    const savedData = JSON.parse(localStorage.getItem('formData'));
    if (savedData) {
        form.querySelector('input[name="user_name"]').value = savedData.name || '';
        form.querySelector('input[name="user_email"]').value = savedData.email || '';
        form.querySelector('textarea[name="message"]').value = savedData.message || '';
    }
}

// --- Level 6: Modal Popup System ---
function initModal() {
    const modal = document.getElementById("privacy-modal");
    const closeBtn = modal.querySelector(".close-button");
    const privacyLinks = document.querySelectorAll("#privacy-link, #privacy-link-footer");

    privacyLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = "block";
        });
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = "none";
    });

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });
}

// --- Level 6: Cookie Consent Banner ---
function initCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');

    if (!localStorage.getItem('cookies_accepted')) {
        banner.style.display = 'flex';
    }

    acceptBtn.addEventListener('click', () => {
        localStorage.setItem('cookies_accepted', 'true');
        banner.style.display = 'none';
    });
}

// --- Level 3: Text Typing Animation ---
function initTypingText() {
    const element = document.querySelector('.typing-text');
    const text = element.getAttribute('data-text');
    element.textContent = ''; // Clear original text
    let i = 0;

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, 80); // Typing speed
        }
    }
    
    // Start typing animation on scroll into view (optional enhancement)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                type();
                observer.unobserve(element);
            }
        });
    }, { threshold: 0.5 });
    observer.observe(element);
}

// --- Level 3: Button Ripple Effect ---
function initButtonRipple() {
    document.querySelectorAll('.ripple-effect').forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            const ripple = document.createElement('span');
            ripple.style.cssText = `top:${y}px; left:${x}px; width:${size}px; height:${size}px;`;
            ripple.classList.add('ripple');
            this.appendChild(ripple);

            // Clean up ripple element
            ripple.addEventListener('animationend', () => {
                this.removeChild(ripple);
            });
        });
    });
}

// --- Level 4: Lazy Loading Images ---
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img.lazy');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// --- Level 3: Parallax Scrolling Effect ---
function handleParallax() {
    const elements = document.querySelectorAll('.parallax-effect');
    elements.forEach(el => {
        const speed = el.getAttribute('data-speed') || 0.5;
        const yPos = (window.pageYOffset * speed) / 10;
        el.style.transform = `translateY(${yPos}px)`;
    });
}
