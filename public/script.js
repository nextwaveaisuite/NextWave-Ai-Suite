// Global variables
let stripe;
let elements;
let cardElement;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
});

function initializePage() {
    const currentPage = getCurrentPage();
    
    switch(currentPage) {
        case 'index':
            initializeLandingPage();
            break;
        case 'sales':
            initializeSalesPage();
            break;
        case 'dashboard':
            initializeDashboard();
            break;
    }
}

function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('sales.html')) return 'sales';
    if (path.includes('dashboard.html')) return 'dashboard';
    return 'index';
}

// Landing Page Functions
function initializeLandingPage() {
    setupAWeberForm();
    setupSmoothScrolling();
}

function setupAWeberForm() {
    const form = document.getElementById('aweber-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            
            if (validateEmail(email)) {
                // Simulate AWeber integration
                showNotification('Thank you! Check your email for exclusive access.', 'success');
                
                // In a real implementation, you would integrate with AWeber API
                // submitToAweber(name, email);
                
                // Reset form
                form.reset();
                
                // Redirect to sales page after 2 seconds
                setTimeout(() => {
                    window.location.href = 'sales.html';
                }, 2000);
            } else {
                showNotification('Please enter a valid email address.', 'error');
            }
        });
    }
}

// Sales Page Functions
function initializeSalesPage() {
    setupPaymentMethods();
    setupCountdownTimer();
    setupUrgencyEffects();
}

function setupPaymentMethods() {
    // Initialize Stripe
    if (typeof Stripe !== 'undefined') {
        stripe = Stripe('pk_test_your_stripe_publishable_key_here'); // Replace with actual key
        elements = stripe.elements();
        
        cardElement = elements.create('card', {
            style: {
                base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                        color: '#aab7c4',
                    },
                },
            },
        });
        
        cardElement.mount('#card-element');
        
        // Handle Stripe form submission
        const stripeForm = document.getElementById('stripe-form');
        if (stripeForm) {
            stripeForm.addEventListener('submit', handleStripePayment);
        }
    }
    
    // Initialize PayPal
    if (typeof paypal !== 'undefined') {
        paypal.Buttons({
            createOrder: function(data, actions) {
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: '97.00'
                        },
                        description: 'NextWave AI Suite - Pro Plan'
                    }]
                });
            },
            onApprove: function(data, actions) {
                return actions.order.capture().then(function(details) {
                    showNotification('Payment successful! Welcome to NextWave AI Suite!', 'success');
                    
                    // Redirect to dashboard
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 2000);
                });
            },
            onError: function(err) {
                showNotification('Payment failed. Please try again.', 'error');
                console.error('PayPal error:', err);
            }
        }).render('#paypal-button-container');
    }
}

async function handleStripePayment(event) {
    event.preventDefault();
    
    const submitButton = document.getElementById('stripe-submit');
    submitButton.disabled = true;
    submitButton.textContent = 'Processing...';
    
    try {
        // In a real implementation, you would create a payment intent on your server
        // const response = await fetch('/create-payment-intent', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ amount: 9700 }) // $97.00 in cents
        // });
        // const { client_secret } = await response.json();
        
        // For demo purposes, we'll simulate success
        showNotification('Payment successful! Welcome to NextWave AI Suite!', 'success');
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
        
    } catch (error) {
        showNotification('Payment failed. Please try again.', 'error');
        console.error('Stripe error:', error);
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Pay with Card - $97/month';
    }
}

function setupCountdownTimer() {
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    
    if (hoursElement && minutesElement && secondsElement) {
        // Set initial countdown time (24 hours from now)
        const endTime = new Date().getTime() + (24 * 60 * 60 * 1000);
        
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = endTime - now;
            
            if (distance < 0) {
                clearInterval(timer);
                hoursElement.textContent = '00';
                minutesElement.textContent = '00';
                secondsElement.textContent = '00';
                return;
            }
            
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            hoursElement.textContent = hours.toString().padStart(2, '0');
            minutesElement.textContent = minutes.toString().padStart(2, '0');
            secondsElement.textContent = seconds.toString().padStart(2, '0');
        }, 1000);
    }
}

function setupUrgencyEffects() {
    // Add pulsing effect to offer badge
    const offerBadge = document.querySelector('.offer-badge');
    if (offerBadge) {
        setInterval(() => {
            offerBadge.style.transform = 'scale(1.05)';
            setTimeout(() => {
                offerBadge.style.transform = 'scale(1)';
            }, 500);
        }, 3000);
    }
}

// Dashboard Functions
function initializeDashboard() {
    setupNavigation();
    setupContentGeneration();
    setupChatInterface();
    setupSettingsTabs();
    loadDashboardData();
}

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetSection = this.getAttribute('data-section');
            
            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Show target section
            contentSections.forEach(section => {
                section.classList.remove('active');
            });
            
            const targetElement = document.getElementById(targetSection + '-section');
            if (targetElement) {
                targetElement.classList.add('active');
            }
            
            // Update page title
            const pageTitle = document.getElementById('page-title');
            if (pageTitle) {
                pageTitle.textContent = this.textContent.replace(/^[^\s]+\s/, ''); // Remove emoji
            }
        });
    });
}

function setupContentGeneration() {
    const generateBtn = document.querySelector('.generate-btn');
    if (generateBtn) {
        generateBtn.addEventListener('click', function() {
            const contentType = document.getElementById('content-type').value;
            const topic = document.getElementById('topic').value;
            const tone = document.getElementById('tone').value;
            
            if (!topic.trim()) {
                showNotification('Please enter a topic or keywords.', 'error');
                return;
            }
            
            generateContent(contentType, topic, tone);
        });
    }
}

function generateContent(contentType, topic, tone) {
    const generateBtn = document.querySelector('.generate-btn');
    const contentOutput = document.getElementById('generated-content');
    
    generateBtn.disabled = true;
    generateBtn.textContent = 'Generating...';
    contentOutput.textContent = 'Generating your content...';
    
    // Simulate AI content generation
    setTimeout(() => {
        const generatedContent = getSimulatedContent(contentType, topic, tone);
        contentOutput.innerHTML = generatedContent;
        
        generateBtn.disabled = false;
        generateBtn.textContent = 'Generate Content';
        
        showNotification('Content generated successfully!', 'success');
    }, 2000);
}

function getSimulatedContent(contentType, topic, tone) {
    const templates = {
        'blog-post': `
            <h3>The Ultimate Guide to ${topic}</h3>
            <p>In today's rapidly evolving digital landscape, understanding ${topic} has become more crucial than ever. This comprehensive guide will walk you through everything you need to know to master this important subject.</p>
            <h4>Why ${topic} Matters</h4>
            <p>The importance of ${topic} cannot be overstated. Industry leaders and experts consistently emphasize its role in driving success and innovation across various sectors.</p>
            <h4>Getting Started</h4>
            <p>To begin your journey with ${topic}, it's essential to understand the fundamental principles and best practices that will set you up for success.</p>
        `,
        'social-media': `
            <p>🚀 Discover the power of ${topic}! Transform your approach and see incredible results. #${topic.replace(/\s+/g, '')} #Success #Innovation</p>
            <p>Ready to take your game to the next level? Let's dive into ${topic} together! 💪</p>
        `,
        'email': `
            <p><strong>Subject:</strong> Your ${topic} Journey Starts Here</p>
            <p>Hi there,</p>
            <p>I hope this email finds you well. I wanted to reach out and share some exciting insights about ${topic} that I think you'll find valuable.</p>
            <p>Over the past few months, I've been diving deep into ${topic}, and the results have been nothing short of amazing.</p>
            <p>Best regards,<br>Your AI Assistant</p>
        `,
        'ad-copy': `
            <h4>Transform Your Business with ${topic}</h4>
            <p><strong>Headline:</strong> Unlock the Secret to ${topic} Success</p>
            <p><strong>Body:</strong> Discover how industry leaders are using ${topic} to drive unprecedented growth and success. Join thousands of satisfied customers who have already transformed their approach.</p>
            <p><strong>CTA:</strong> Get Started Today - Limited Time Offer!</p>
        `,
        'product-description': `
            <h4>Premium ${topic} Solution</h4>
            <p>Experience the ultimate ${topic} solution designed for modern professionals. Our innovative approach combines cutting-edge technology with user-friendly design.</p>
            <p><strong>Key Features:</strong></p>
            <ul>
                <li>Advanced ${topic} capabilities</li>
                <li>User-friendly interface</li>
                <li>24/7 customer support</li>
                <li>Money-back guarantee</li>
            </ul>
        `
    };
    
    return templates[contentType] || `<p>Generated content about ${topic} with a ${tone} tone.</p>`;
}

function setupChatInterface() {
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-message');
    const chatMessages = document.getElementById('chat-messages');
    
    if (chatInput && sendButton && chatMessages) {
        sendButton.addEventListener('click', sendChatMessage);
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });
    }
}

function sendChatMessage() {
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    // Add user message
    addChatMessage(message, 'user');
    chatInput.value = '';
    
    // Simulate AI response
    setTimeout(() => {
        const aiResponse = generateAIResponse(message);
        addChatMessage(aiResponse, 'ai');
    }, 1000);
}

function addChatMessage(message, sender) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = message;
    
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function generateAIResponse(userMessage) {
    const responses = [
        "That's a great question! Based on your business data, I'd recommend focusing on customer retention strategies.",
        "I can help you with that. Let me analyze your current performance metrics and provide some insights.",
        "Excellent point! Here are three actionable strategies you can implement immediately to improve your results.",
        "I understand your concern. Let's break this down into manageable steps that will drive real results.",
        "Based on industry best practices, I suggest we start with optimizing your current processes before scaling."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
}

function setupSettingsTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show target tab content
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            
            const targetContent = document.getElementById(targetTab + '-tab');
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

function loadDashboardData() {
    // Simulate loading dashboard data
    animateNumbers();
    updateActivityFeed();
}

function animateNumbers() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(element => {
        const finalValue = parseInt(element.textContent.replace(/[^\d]/g, ''));
        let currentValue = 0;
        const increment = finalValue / 50;
        
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= finalValue) {
                currentValue = finalValue;
                clearInterval(timer);
            }
            
            if (element.textContent.includes('$')) {
                element.textContent = '$' + Math.floor(currentValue).toLocaleString();
            } else if (element.textContent.includes('hrs')) {
                element.textContent = Math.floor(currentValue) + ' hrs';
            } else {
                element.textContent = Math.floor(currentValue).toLocaleString();
            }
        }, 50);
    });
}

function updateActivityFeed() {
    // This would typically fetch real data from an API
    console.log('Activity feed updated');
}

// Utility Functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 2rem',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '600',
        zIndex: '10000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        maxWidth: '400px'
    });
    
    // Set background color based on type
    const colors = {
        success: '#27ae60',
        error: '#e74c3c',
        info: '#3498db',
        warning: '#f39c12'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

function setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Copy to clipboard functionality
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Copied to clipboard!', 'success');
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Copied to clipboard!', 'success');
    }
}

// Add copy functionality to content output
document.addEventListener('click', function(e) {
    if (e.target.textContent === 'Copy') {
        const contentOutput = document.getElementById('generated-content');
        if (contentOutput) {
            copyToClipboard(contentOutput.textContent);
        }
    }
});

// Handle window resize for responsive design
window.addEventListener('resize', function() {
    // Add any responsive adjustments here
    if (window.innerWidth <= 768) {
        // Mobile adjustments
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            sidebar.style.transform = 'translateX(-100%)';
        }
    }
});

// Initialize tooltips and other UI enhancements
function initializeUIEnhancements() {
    // Add loading states to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (!this.disabled) {
                this.style.opacity = '0.8';
                setTimeout(() => {
                    this.style.opacity = '1';
                }, 200);
            }
        });
    });
}

// Call UI enhancements on load
document.addEventListener('DOMContentLoaded', initializeUIEnhancements);

