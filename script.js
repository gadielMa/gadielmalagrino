// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
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

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Add fade-in class to elements and observe them
document.addEventListener('DOMContentLoaded', () => {
    const elementsToAnimate = document.querySelectorAll('.service-card, .portfolio-item, .about-text, .about-image');
    
    elementsToAnimate.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
});

// Portfolio item hover effects
document.querySelectorAll('.portfolio-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.transform = 'scale(1.05)';
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.transform = 'scale(1)';
    });
});

// Service card hover effects
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
        card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
    });
});

// Active navigation link highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Preload images for better performance
function preloadImages() {
    const images = [
        'Gadiel Malagrino.PNG',
        'IMG_0215.jpg',
        'IMG_2504.JPG',
        '0797cfed-b09b-45dc-b166-bec9c5536e84.jpg',
        'IMG_4026.jpg',
        'IMG_6925.jpg',
        'e939f5c1-eb2f-4b43-99a3-e12ac001102a.jpg'
    ];
    
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    preloadImages();
    
    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Contact button click tracking
document.querySelector('.btn-primary[href*="wa.me"]')?.addEventListener('click', () => {
    // You can add analytics tracking here if needed
    console.log('WhatsApp contact initiated');
});

// Donation functionality
let selectedAmount = 0;

// Amount button selection
document.querySelectorAll('.amount-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        document.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('active'));
        
        // Add active class to clicked button
        btn.classList.add('active');
        
        // Set selected amount
        selectedAmount = parseInt(btn.dataset.amount);
        
        // Clear custom amount input
        document.getElementById('customAmount').value = '';
    });
});

// Custom amount input
document.getElementById('customAmount').addEventListener('input', (e) => {
    const customAmount = parseInt(e.target.value);
    
    if (customAmount && customAmount >= 100) {
        selectedAmount = customAmount;
        
        // Remove active class from all amount buttons
        document.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('active'));
    }
});

// Donation button click
document.getElementById('donateBtn').addEventListener('click', () => {
    if (!selectedAmount || selectedAmount < 100) {
        alert('Por favor selecciona un monto mínimo de $100 ARS');
        return;
    }
    
    // Create Mercado Pago payment link
    const donationData = {
        amount: selectedAmount,
        description: `Donación para Gadiel Malagrino - $${selectedAmount} ARS`,
        donor: 'Donante Anónimo'
    };
    
    // Direct Mercado Pago link
    // Replace 'TU_LINK_DE_PAGO' with your actual Mercado Pago link
    const mercadoPagoLink = 'https://link.mercadopago.com.ar/inggadielmalagrino?v=' + Date.now();
    
    window.open(mercadoPagoLink, '_blank');
    
    // Analytics tracking
    console.log('Donation initiated:', donationData);
});

// Mercado Pago Integration (Template for future implementation)
function initializeMercadoPago() {
    // This is where you would initialize Mercado Pago SDK
    // You'll need to get your Public Key from Mercado Pago dashboard
    
    /*
    const mp = new MercadoPago('YOUR_PUBLIC_KEY', {
        locale: 'es-AR'
    });
    
    function createPayment(amount) {
        fetch('/create-payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: amount,
                description: `Donación para Gadiel Malagrino - $${amount} ARS`
            })
        })
        .then(response => response.json())
        .then(data => {
            // Redirect to Mercado Pago checkout
            window.location.href = data.init_point;
        });
    }
    */
} 