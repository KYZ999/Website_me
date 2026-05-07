// ===================== ELEMENTS =====================
const bootScreen    = document.getElementById('boot-screen');
const bootLines     = document.getElementById('boot-lines');
const bootFill      = document.getElementById('boot-fill');
const bootStatus    = document.getElementById('boot-status');
const bgMusic       = document.getElementById('bg-music');
const musicPanel    = document.getElementById('music-panel');
const musicToggle   = document.getElementById('music-toggle');
const volUp         = document.getElementById('vol-up');
const volDown       = document.getElementById('vol-down');
const volBarFill    = document.getElementById('vol-bar-fill');
const volLabel      = document.getElementById('vol-label');

// ===================== MUSIC =====================
let isMusicPlaying = false;
let currentVolume  = 0.3;
const VOLUME_STEP  = 0.1;

function updateVolumeUI() {
    const pct = Math.round(currentVolume * 100);
    if (volBarFill) volBarFill.style.width = pct + '%';
    if (volLabel)   volLabel.innerText = pct + '%';
    if (bgMusic)    bgMusic.volume = currentVolume;
    if (musicToggle) {
        if      (currentVolume === 0) musicToggle.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
        else if (currentVolume < 0.5) musicToggle.innerHTML = '<i class="fa-solid fa-volume-low"></i>';
        else                           musicToggle.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
    }
}

function tryPlayMusic() {
    if (!bgMusic || isMusicPlaying) return;
    bgMusic.volume = currentVolume;
    bgMusic.play().then(() => {
        isMusicPlaying = true;
        updateVolumeUI();
        if (musicPanel) musicPanel.classList.add('playing');
        if (musicToggle) musicToggle.title = 'Click to mute';
    }).catch(() => {});
}

// ===================== ENTER SPLASH =====================
const enterSplash = document.getElementById('enter-splash');
const enterBtn    = document.getElementById('enter-btn');
const splashCv    = document.getElementById('splash-canvas');

if (splashCv) {
    const sCtx = splashCv.getContext('2d');
    splashCv.width = window.innerWidth; splashCv.height = window.innerHeight;
    const sCols = Math.floor(splashCv.width / 14);
    const sDrops = Array.from({ length: sCols }).fill(1);
    const splashChars = '01RAVIDU@#&*';
    setInterval(() => {
        sCtx.fillStyle = 'rgba(0,0,0,0.05)';
        sCtx.fillRect(0, 0, splashCv.width, splashCv.height);
        sCtx.fillStyle = 'rgba(0,229,255,0.3)'; sCtx.font = '14px monospace';
        for (let i = 0; i < sDrops.length; i++) {
            sCtx.fillText(splashChars[Math.floor(Math.random() * splashChars.length)], i * 14, sDrops[i] * 14);
            if (sDrops[i] * 14 > splashCv.height && Math.random() > 0.975) sDrops[i] = 0;
            sDrops[i]++;
        }
    }, 60);
}

if (enterBtn && enterSplash) {
    enterBtn.addEventListener('click', () => {
        // 1. Start music immediately (user gesture unlocks autoplay)
        if (bgMusic) {
            bgMusic.volume = currentVolume;
            bgMusic.play().then(() => {
                isMusicPlaying = true;
                updateVolumeUI();
                if (musicPanel) musicPanel.classList.add('playing');
                if (musicToggle) musicToggle.title = 'Click to mute';
            }).catch(() => {});
        }
        // 2. Fade out splash, show boot sequence
        enterSplash.style.opacity = '0';
        enterSplash.style.visibility = 'hidden';
        setTimeout(() => { enterSplash.style.display = 'none'; }, 800);
        setTimeout(addBootLine, 400);
    });
}

if (musicToggle && bgMusic) {
    // Set initial icon to show music is stopped (click to play)
    musicToggle.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
    musicToggle.title = 'Click to play music';

    musicToggle.addEventListener('click', () => {
        if (isMusicPlaying) {
            bgMusic.pause();
            isMusicPlaying = false;
            musicToggle.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
            musicToggle.title = 'Click to play music';
            if (musicPanel) musicPanel.classList.remove('playing');
        } else {
            bgMusic.volume = currentVolume;
            bgMusic.play().then(() => {
                isMusicPlaying = true;
                updateVolumeUI();
                musicToggle.title = 'Click to mute';
                if (musicPanel) musicPanel.classList.add('playing');
            }).catch(err => {
                console.log('Play failed:', err);
            });
        }
    });
}

if (volUp) {
    volUp.addEventListener('click', () => {
        currentVolume = Math.min(1, parseFloat((currentVolume + VOLUME_STEP).toFixed(1)));
        updateVolumeUI();
        if (!isMusicPlaying && bgMusic) { bgMusic.play(); isMusicPlaying = true; }
    });
}

if (volDown) {
    volDown.addEventListener('click', () => {
        currentVolume = Math.max(0, parseFloat((currentVolume - VOLUME_STEP).toFixed(1)));
        updateVolumeUI();
    });
}

// ===================== BOOT SEQUENCE =====================
const bootLogLines = [
    "> INITIATING RAVIDU.SYS KERNEL...",
    "> LOADING NEURAL NETWORK WEIGHTS...",
    "> ESTABLISHING DATABASE CONNECTIONS...",
    "> BYPASSING SECURITY PROTOCOLS...",
    "> INJECTING LUA SCRIPTS...",
    "> MOUNTING REACT COMPONENTS...",
    "> CALIBRATING DISCORD API WEBHOOKS...",
    "> SYSTEM READY."
];
let lineIndex = 0;

function addBootLine() {
    if (lineIndex < bootLogLines.length) {
        const p = document.createElement('p');
        p.innerText = bootLogLines[lineIndex];
        if (bootLines) bootLines.appendChild(p);
        const progress = ((lineIndex + 1) / bootLogLines.length) * 100;
        if (bootFill) bootFill.style.width = `${progress}%`;
        lineIndex++;
        setTimeout(addBootLine, Math.random() * 250 + 80);
    } else {
        if (bootStatus) { bootStatus.innerText = "ACCESS GRANTED"; bootStatus.style.color = "#00ff66"; }
        setTimeout(() => {
            if (bootScreen) { bootScreen.style.opacity = '0'; bootScreen.style.visibility = 'hidden'; }
            initTypewriter();
        }, 800);
    }
}

window.addEventListener('load', () => {
    // Boot starts after user clicks Enter on splash
});

// ===================== CUSTOM CURSOR =====================
const cursorDot  = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');

window.addEventListener('mousemove', (e) => {
    if (!cursorDot || !cursorRing) return;
    cursorDot.style.left  = `${e.clientX}px`;
    cursorDot.style.top   = `${e.clientY}px`;
    cursorRing.animate({ left: `${e.clientX}px`, top: `${e.clientY}px` }, { duration: 150, fill: "forwards" });
});

document.querySelectorAll('a, button, input, textarea, select').forEach(el => {
    el.addEventListener('mouseenter', () => {
        if (cursorRing) { cursorRing.style.width = '50px'; cursorRing.style.height = '50px'; cursorRing.style.backgroundColor = 'rgba(0, 229, 255, 0.1)'; }
    });
    el.addEventListener('mouseleave', () => {
        if (cursorRing) { cursorRing.style.width = '30px'; cursorRing.style.height = '30px'; cursorRing.style.backgroundColor = 'transparent'; }
    });
});

// ===================== MATRIX BACKGROUND =====================
const mxCanvas = document.getElementById('matrix-canvas');
if (mxCanvas) {
    const mCtx   = mxCanvas.getContext('2d');
    mxCanvas.width  = window.innerWidth;
    mxCanvas.height = window.innerHeight;

    const chars   = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';
    const fontSize = 14;
    const columns  = Math.floor(mxCanvas.width / fontSize);
    const drops    = Array.from({ length: columns }).fill(1);

    setInterval(() => {
        mCtx.fillStyle = 'rgba(2, 2, 5, 0.05)';
        mCtx.fillRect(0, 0, mxCanvas.width, mxCanvas.height);
        mCtx.fillStyle = '#00e5ff';
        mCtx.font = fontSize + 'px monospace';
        for (let i = 0; i < drops.length; i++) {
            const text = chars.charAt(Math.floor(Math.random() * chars.length));
            mCtx.fillText(text, i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > mxCanvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
    }, 50);

    window.addEventListener('resize', () => {
        mxCanvas.width  = window.innerWidth;
        mxCanvas.height = window.innerHeight;
    });
}

// ===================== TYPEWRITER =====================
const roles  = ["FIVEM_ARCHITECT", "DISCORD_ENGINEER", "MLO_3D_DESIGNER", "FULL_STACK_DEV"];
let roleIdx  = 0, charIdx = 0, isDeleting = false;
const roleEl = document.getElementById('role-text');

function initTypewriter() {
    if (!roleEl) return;
    const word = roles[roleIdx];
    roleEl.innerText = isDeleting ? word.substring(0, charIdx - 1) : word.substring(0, charIdx + 1);
    isDeleting ? charIdx-- : charIdx++;
    let speed = isDeleting ? 50 : 100;
    if (!isDeleting && charIdx === word.length) { speed = 2000; isDeleting = true; }
    else if (isDeleting && charIdx === 0)        { isDeleting = false; roleIdx = (roleIdx + 1) % roles.length; speed = 500; }
    setTimeout(initTypewriter, speed);
}

// ===================== SCROLL REVEALS =====================
const numbers = document.querySelectorAll('.strip-num');

new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('revealed');
        entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => { bar.style.width = bar.getAttribute('data-width'); });
        if (entry.target.classList.contains('about-stat-strip')) {
            numbers.forEach(num => {
                if (num.classList.contains('counted')) return;
                num.classList.add('counted');
                const target = parseInt(num.getAttribute('data-count'));
                let count = 0, inc = target / 50;
                const tick = () => { count += inc; num.innerText = count < target ? Math.ceil(count) : target; if (count < target) requestAnimationFrame(tick); };
                tick();
            });
        }
    });
}, { threshold: 0.15 }).observe && document.querySelectorAll('[data-reveal]').forEach(el => {
    new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('revealed');
            entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => { bar.style.width = bar.getAttribute('data-width'); });
            if (entry.target.classList.contains('about-stat-strip')) {
                numbers.forEach(num => {
                    if (num.classList.contains('counted')) return;
                    num.classList.add('counted');
                    const target = parseInt(num.getAttribute('data-count'));
                    let count = 0, inc = target / 50;
                    const tick = () => { count += inc; num.innerText = count < target ? Math.ceil(count) : target; if (count < target) requestAnimationFrame(tick); };
                    tick();
                });
            }
        });
    }, { threshold: 0.15 }).observe(el);
});

// ===================== NAV TRACKING =====================
const navLinks = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
    let current = '';
    document.querySelectorAll('.section').forEach(section => {
        if (pageYOffset >= (section.offsetTop - section.clientHeight / 3)) current = section.getAttribute('id');
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) link.classList.add('active');
    });
});

// ===================== MOBILE NAV =====================
const hamburger        = document.getElementById('hamburger');
const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
const mobileNavClose   = document.getElementById('mobile-nav-close');

if (hamburger && mobileNavOverlay && mobileNavClose) {
    hamburger.addEventListener('click',       () => mobileNavOverlay.classList.add('active'));
    mobileNavClose.addEventListener('click',  () => mobileNavOverlay.classList.remove('active'));
    document.querySelectorAll('.mob-link').forEach(link => link.addEventListener('click', () => mobileNavOverlay.classList.remove('active')));
}

// ===================== CONTACT FORM =====================
const form       = document.getElementById('contactForm');
const successMsg = document.getElementById('form-success');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const orig = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> TRANSMITTING...';
        setTimeout(() => { btn.innerHTML = orig; form.reset(); successMsg.style.display = 'flex'; setTimeout(() => { successMsg.style.display = 'none'; }, 5000); }, 1500);
    });
}

// ===================== RADAR CHART =====================
const radarCanvas = document.getElementById('radar-canvas');
if (radarCanvas) {
    const rCtx = radarCanvas.getContext('2d');
    const cx = 150, cy = 150, radius = 100;
    const skills = [
        { name: "Lua",   val: 0.95 }, { name: "JS",    val: 0.90 },
        { name: "Node",  val: 0.88 }, { name: "MLO",   val: 0.87 },
        { name: "SQL",   val: 0.80 }, { name: "FiveM", val: 0.95 }
    ];
    setTimeout(() => {
        rCtx.clearRect(0, 0, 300, 300);
        rCtx.strokeStyle = 'rgba(0,229,255,0.2)'; rCtx.lineWidth = 1;
        for (let i = 1; i <= 5; i++) {
            rCtx.beginPath();
            skills.forEach((_, j) => {
                const a = (Math.PI * 2 * j) / skills.length - Math.PI / 2;
                const r = radius * (i / 5);
                j === 0 ? rCtx.moveTo(cx + r * Math.cos(a), cy + r * Math.sin(a)) : rCtx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
            });
            rCtx.closePath(); rCtx.stroke();
        }
        skills.forEach((sk, j) => {
            const a = (Math.PI * 2 * j) / skills.length - Math.PI / 2;
            rCtx.beginPath(); rCtx.moveTo(cx, cy); rCtx.lineTo(cx + radius * Math.cos(a), cy + radius * Math.sin(a)); rCtx.stroke();
            rCtx.fillStyle = '#6b8a9e'; rCtx.font = '12px monospace'; rCtx.textAlign = 'center';
            rCtx.fillText(sk.name, cx + (radius + 20) * Math.cos(a), cy + (radius + 20) * Math.sin(a) + 4);
        });
        rCtx.beginPath();
        skills.forEach((sk, j) => {
            const a = (Math.PI * 2 * j) / skills.length - Math.PI / 2;
            const r = radius * sk.val;
            j === 0 ? rCtx.moveTo(cx + r * Math.cos(a), cy + r * Math.sin(a)) : rCtx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
        });
        rCtx.closePath(); rCtx.fillStyle = 'rgba(0,229,255,0.2)'; rCtx.fill();
        rCtx.strokeStyle = '#00e5ff'; rCtx.lineWidth = 2; rCtx.stroke();
        skills.forEach((sk, j) => {
            const a = (Math.PI * 2 * j) / skills.length - Math.PI / 2;
            const r = radius * sk.val;
            rCtx.beginPath(); rCtx.arc(cx + r * Math.cos(a), cy + r * Math.sin(a), 4, 0, Math.PI * 2);
            rCtx.fillStyle = '#000'; rCtx.fill(); rCtx.stroke();
        });
    }, 1500);
}
