// --- Boot Sequence ---
const bootScreen = document.getElementById('boot-screen');
const bootLines = document.getElementById('boot-lines');
const bootFill = document.getElementById('boot-fill');
const bootStatus = document.getElementById('boot-status');

const lines = [
    "> INITIATING RAVIDU.SYS KERNEL...",
    "> LOADING NEURAL NETWORK WIEGHTS...",
    "> ESTABLISHING DATABASE CONNECTIONS...",
    "> BYPASSING SECURITY PROTOCOLS...",
    "> INJECTING LUA SCRIPTS...",
    "> MOUNTING REACT COMPONENTS...",
    "> CALIBRATING DISCORD API WEBHOOKS...",
    "> SYSTEM READY."
];

let lineIndex = 0;

function addBootLine() {
    if (lineIndex < lines.length) {
        const p = document.createElement('p');
        p.innerText = lines[lineIndex];
        bootLines.appendChild(p);
        
        const progress = ((lineIndex + 1) / lines.length) * 100;
        bootFill.style.width = `${progress}%`;
        
        lineIndex++;
        setTimeout(addBootLine, Math.random() * 300 + 100);
    } else {
        bootStatus.innerText = "ACCESS GRANTED";
        bootStatus.style.color = "#00ff66";
        setTimeout(() => {
            bootScreen.style.opacity = '0';
            bootScreen.style.visibility = 'hidden';
            initTypewriter();
        }, 800);
    }
}

window.addEventListener('load', () => {
    setTimeout(addBootLine, 500);
});

// --- Custom Cursor ---
const cursorDot = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');

window.addEventListener('mousemove', (e) => {
    if(!cursorDot || !cursorRing) return;
    cursorDot.style.left = `${e.clientX}px`;
    cursorDot.style.top = `${e.clientY}px`;
    
    cursorRing.animate({
        left: `${e.clientX}px`,
        top: `${e.clientY}px`
    }, { duration: 150, fill: "forwards" });
});

const interactables = document.querySelectorAll('a, button, input, textarea, select');
interactables.forEach(el => {
    el.addEventListener('mouseenter', () => {
        if(cursorRing) {
            cursorRing.style.width = '50px';
            cursorRing.style.height = '50px';
            cursorRing.style.backgroundColor = 'rgba(0, 229, 255, 0.1)';
        }
    });
    el.addEventListener('mouseleave', () => {
        if(cursorRing) {
            cursorRing.style.width = '30px';
            cursorRing.style.height = '30px';
            cursorRing.style.backgroundColor = 'transparent';
        }
    });
});

// --- Matrix Background Effect ---
const mxCanvas = document.getElementById('matrix-canvas');
const mCtx = mxCanvas.getContext('2d');
mxCanvas.width = window.innerWidth;
mxCanvas.height = window.innerHeight;

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';
const fontSize = 14;
const columns = mxCanvas.width / fontSize;
const drops = Array.from({length: columns}).fill(1);

function drawMatrix() {
    mCtx.fillStyle = 'rgba(2, 2, 5, 0.05)';
    mCtx.fillRect(0, 0, mxCanvas.width, mxCanvas.height);
    mCtx.fillStyle = '#00e5ff';
    mCtx.font = fontSize + 'px monospace';

    for(let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        mCtx.fillText(text, i * fontSize, drops[i] * fontSize);
        if(drops[i] * fontSize > mxCanvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}
setInterval(drawMatrix, 50);

// --- Hero Typewriter ---
const roles = ["FIVEM_ARCHITECT", "DISCORD_ENGINEER", "MLO_3D_DESIGNER", "FULL_STACK_DEV"];
let roleIdx = 0;
let charIdx = 0;
let isDeleting = false;
const roleEl = document.getElementById('role-text');

function initTypewriter() {
    if (!roleEl) return;
    const currentWord = roles[roleIdx];
    
    if (isDeleting) {
        roleEl.innerText = currentWord.substring(0, charIdx - 1);
        charIdx--;
    } else {
        roleEl.innerText = currentWord.substring(0, charIdx + 1);
        charIdx++;
    }

    let speed = isDeleting ? 50 : 100;

    if (!isDeleting && charIdx === currentWord.length) {
        speed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        speed = 500;
    }

    setTimeout(initTypewriter, speed);
}

// --- Reveal on Scroll & Progress Bars ---
const reveals = document.querySelectorAll('[data-reveal]');
const progressFills = document.querySelectorAll('.skill-bar-fill');
const numbers = document.querySelectorAll('.strip-num');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.classList.add('revealed');
            
            // Check for progress bars inside
            const bars = entry.target.querySelectorAll('.skill-bar-fill');
            if(bars.length > 0) {
                bars.forEach(bar => {
                    bar.style.width = bar.getAttribute('data-width');
                });
            }
            // Animate numbers
            if(entry.target.classList.contains('about-stat-strip')) {
                numbers.forEach(num => {
                    if(!num.classList.contains('counted')) {
                        const target = parseInt(num.getAttribute('data-count'));
                        let count = 0;
                        const inc = target / 50;
                        const updateCount = () => {
                            count += inc;
                            if(count < target) {
                                num.innerText = Math.ceil(count);
                                requestAnimationFrame(updateCount);
                            } else {
                                num.innerText = target;
                            }
                        };
                        updateCount();
                        num.classList.add('counted');
                    }
                });
            }
        }
    });
}, { threshold: 0.15 });

reveals.forEach(el => revealObserver.observe(el));

// --- Active Nav Tracking ---
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if(pageYOffset >= (sectionTop - sectionHeight / 3)){
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if(link.getAttribute('href').includes(current)){
            link.classList.add('active');
        }
    });
});

// --- Mobile Navigation ---
const hamburger = document.getElementById('hamburger');
const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
const mobileNavClose = document.getElementById('mobile-nav-close');
const mobLinks = document.querySelectorAll('.mob-link');

if(hamburger && mobileNavOverlay && mobileNavClose) {
    hamburger.addEventListener('click', () => mobileNavOverlay.classList.add('active'));
    mobileNavClose.addEventListener('click', () => mobileNavOverlay.classList.remove('active'));
    mobLinks.forEach(link => {
        link.addEventListener('click', () => mobileNavOverlay.classList.remove('active'));
    });
}

// --- Contact Form Simulation ---
const form = document.getElementById('contactForm');
const successMsg = document.getElementById('form-success');

if(form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const origText = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> TRANSMITTING...';
        
        setTimeout(() => {
            btn.innerHTML = origText;
            form.reset();
            successMsg.style.display = 'flex';
            setTimeout(() => {
                successMsg.style.display = 'none';
            }, 5000);
        }, 1500);
    });
}

// --- Radar Chart (HTML5 Canvas) ---
const radarCanvas = document.getElementById('radar-canvas');
if(radarCanvas) {
    const rCtx = radarCanvas.getContext('2d');
    const cx = 150, cy = 150, radius = 100;
    const skills = [
        {name: "Lua", val: 0.95},
        {name: "JS", val: 0.90},
        {name: "Node", val: 0.88},
        {name: "MLO", val: 0.87},
        {name: "SQL", val: 0.80},
        {name: "FiveM", val: 0.95}
    ];
    
    function drawRadar() {
        rCtx.clearRect(0, 0, 300, 300);
        
        // Background Web
        rCtx.strokeStyle = 'rgba(0, 229, 255, 0.2)';
        rCtx.lineWidth = 1;
        for(let i=1; i<=5; i++) {
            rCtx.beginPath();
            for(let j=0; j<skills.length; j++) {
                const angle = (Math.PI * 2 * j) / skills.length - Math.PI/2;
                const r = radius * (i/5);
                const x = cx + r * Math.cos(angle);
                const y = cy + r * Math.sin(angle);
                if(j===0) rCtx.moveTo(x,y);
                else rCtx.lineTo(x,y);
            }
            rCtx.closePath();
            rCtx.stroke();
        }
        
        // Lines from center
        for(let j=0; j<skills.length; j++) {
            const angle = (Math.PI * 2 * j) / skills.length - Math.PI/2;
            const x = cx + radius * Math.cos(angle);
            const y = cy + radius * Math.sin(angle);
            rCtx.beginPath();
            rCtx.moveTo(cx, cy);
            rCtx.lineTo(x, y);
            rCtx.stroke();
            
            // Labels
            rCtx.fillStyle = '#6b8a9e';
            rCtx.font = '12px monospace';
            rCtx.textAlign = 'center';
            rCtx.fillText(skills[j].name, cx + (radius+20) * Math.cos(angle), cy + (radius+20) * Math.sin(angle) + 4);
        }
        
        // Data shape
        rCtx.beginPath();
        for(let j=0; j<skills.length; j++) {
            const angle = (Math.PI * 2 * j) / skills.length - Math.PI/2;
            const r = radius * skills[j].val;
            const x = cx + r * Math.cos(angle);
            const y = cy + r * Math.sin(angle);
            if(j===0) rCtx.moveTo(x,y);
            else rCtx.lineTo(x,y);
        }
        rCtx.closePath();
        rCtx.fillStyle = 'rgba(0, 229, 255, 0.2)';
        rCtx.fill();
        rCtx.strokeStyle = '#00e5ff';
        rCtx.lineWidth = 2;
        rCtx.stroke();
        
        // Points
        for(let j=0; j<skills.length; j++) {
            const angle = (Math.PI * 2 * j) / skills.length - Math.PI/2;
            const r = radius * skills[j].val;
            const x = cx + r * Math.cos(angle);
            const y = cy + r * Math.sin(angle);
            rCtx.beginPath();
            rCtx.arc(x, y, 4, 0, Math.PI*2);
            rCtx.fillStyle = '#000';
            rCtx.fill();
            rCtx.stroke();
        }
    }
    
    // Animate radar appearing
    setTimeout(drawRadar, 1500);
}
