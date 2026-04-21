// Preloader
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('preloader-hidden');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 800); // Wait for transition
        }, 500); // Minimum view time
    }
});

// Custom Cursor
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    if(cursorDot && cursorOutline) {
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Add a slight delay to the outline for a smooth effect
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    }
});

document.querySelectorAll('a, button, .skill-item, .project-card, .service-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
        if(cursorOutline) {
            cursorOutline.style.width = '60px';
            cursorOutline.style.height = '60px';
            cursorOutline.style.backgroundColor = 'rgba(0, 229, 255, 0.1)';
        }
    });
    el.addEventListener('mouseleave', () => {
        if(cursorOutline) {
            cursorOutline.style.width = '40px';
            cursorOutline.style.height = '40px';
            cursorOutline.style.backgroundColor = 'transparent';
        }
    });
});

// Navbar Scroll Effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = menuToggle.querySelector('i');
    if (navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Close mobile menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
});

// Typing Effect for Hero Section
const phrases = [
    "FiveM Developer", 
    "Discord Bot Developer", 
    "Server Architect",
    "Automation Expert"
];
let currentPhraseIndex = 0;
let isDeleting = false;
let currentText = '';
let charIndex = 0;

const typeElement = document.querySelector('.typing-text');

function type() {
    if(!typeElement) return;
    
    const currentPhrase = phrases[currentPhraseIndex];
    
    if (isDeleting) {
        currentText = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
    } else {
        currentText = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
    }
    
    typeElement.innerHTML = currentText + '<span class="cursor">|</span>';
    
    let typeSpeed = 100;
    
    if (isDeleting) {
        typeSpeed /= 2;
    }
    
    if (!isDeleting && currentText === currentPhrase) {
        typeSpeed = 2000; // Pause at end
        isDeleting = true;
    } else if (isDeleting && currentText === '') {
        isDeleting = false;
        currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
        typeSpeed = 500; // Pause before typing next
    }
    
    setTimeout(type, typeSpeed);
}

// Add blinking cursor style dynamically
const style = document.createElement('style');
style.innerHTML = `
    .cursor {
        display: inline-block;
        width: 3px;
        animation: blink 1s infinite;
        color: var(--neon-cyan);
    }
    @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
    }
`;
document.head.appendChild(style);

// Start typing effect
setTimeout(type, 1000);

// Form Submission handling
const contactForm = document.getElementById('contactForm');
if(contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = document.querySelector('.submit-btn');
        const originalText = btn.innerHTML;
        
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
        btn.style.color = '#fff';
        
        // Simulate API call
        setTimeout(() => {
            btn.innerHTML = '<i class="fa-solid fa-check"></i> Message Sent!';
            btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            btn.style.borderColor = 'transparent';
            btn.style.boxShadow = '0 0 15px rgba(16, 185, 129, 0.4)';
            contactForm.reset();
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
                btn.style.borderColor = '';
                btn.style.boxShadow = '';
                btn.style.color = '';
            }, 3000);
        }, 1500);
    });
}

// --- Advanced Interactive Particles Background ---
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let particlesArray;

// Mouse tracking
let mouse = {
    x: null,
    y: null,
    radius: 150
}

window.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

// Remove mouse tracking when leaving
window.addEventListener('mouseout', function() {
    mouse.x = undefined;
    mouse.y = undefined;
});

// Set canvas dimensions
function setCanvasDimensions() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

setCanvasDimensions();
window.addEventListener('resize', setCanvasDimensions);

// Create Particle class
class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 30) + 1;
    }
    
    // Draw method
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    
    // Update position and bounce off edges
    update() {
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }

        // Mouse collision detection for particles
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx*dx + dy*dy);
        
        if(distance < mouse.radius) {
            // Push particles away
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const maxDistance = mouse.radius;
            const force = (maxDistance - distance) / maxDistance;
            const directionX = forceDirectionX * force * this.density;
            const directionY = forceDirectionY * force * this.density;
            
            this.x -= directionX;
            this.y -= directionY;
        } else {
            // Gradually return to standard movement
            this.x += this.directionX;
            this.y += this.directionY;
        }
        
        this.draw();
    }
}

// Initialize particle array
function init() {
    particlesArray = [];
    const numberOfParticles = (canvas.height * canvas.width) / 10000;
    
    for (let i = 0; i < numberOfParticles; i++) {
        const size = (Math.random() * 2) + 0.5;
        const x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        const y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        
        const directionX = (Math.random() * 0.5) - 0.25;
        const directionY = (Math.random() * 0.5) - 0.25;
        
        // Cyber Cyan Theme Colors
        const color = Math.random() > 0.5 ? 'rgba(0, 229, 255, 0.8)' : 'rgba(0, 255, 255, 0.4)';
        
        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

// Connect particles with lines
function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            const distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + 
                             ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            
            // Connect to each other
            if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                opacityValue = 1 - (distance / 20000);
                ctx.strokeStyle = `rgba(0, 229, 255, ${opacityValue * 0.2})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

// Connect particles to mouse
function connectToMouse() {
    if(!mouse.x) return;
    
    for (let i = 0; i < particlesArray.length; i++) {
        const dx = mouse.x - particlesArray[i].x;
        const dy = mouse.y - particlesArray[i].y;
        const distance = Math.sqrt(dx*dx + dy*dy);
        
        if(distance < mouse.radius * 1.5) {
            const opacityValue = 1 - (distance / (mouse.radius * 1.5));
            ctx.strokeStyle = `rgba(0, 229, 255, ${opacityValue * 0.4})`;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
        }
    }
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
    connectToMouse();
}

init();
animate();

// Re-init on resize
window.addEventListener('resize', () => {
    init();
});

// Scroll Reveal Animation with Intersection Observer (More advanced)
const revealElements = document.querySelectorAll('.glass-panel, .section-title, .feature-item, .project-card, .service-card');

const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const revealObserver = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return;
        }
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
    });
}, revealOptions);

// Initial state for reveal elements
revealElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(40px)';
    element.style.transition = 'all 0.8s cubic-bezier(0.165, 0.84, 0.44, 1)';
    revealObserver.observe(element);
});
