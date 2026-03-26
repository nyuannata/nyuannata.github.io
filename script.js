// Custom Cursor
const cursorDot = document.querySelector(".cursor-dot");
const cursorOutline = document.querySelector(".cursor-outline");

// Particle Network Setup
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;

// Get mouse position
let mouse = {
    x: null,
    y: null,
    radius: (canvas.height/80) * (canvas.width/80)
};

window.addEventListener("mousemove", (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    mouse.x = posX;
    mouse.y = posY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    // Global variables for CSS box parallax
    const globalX = (posX - window.innerWidth / 2) / 60;
    const globalY = (posY - window.innerHeight / 2) / 60;
    document.documentElement.style.setProperty('--mouse-x', `${globalX}px`);
    document.documentElement.style.setProperty('--mouse-y', `${globalY}px`);

    // Add slight delay for outline for a cool effect
    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 150, fill: "forwards" });
});

// Particle Class
class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }
    // Draw dot
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    // Update particle
    update() {
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if(this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }

        // Check collision / mouse distance -> Dodge Cursor effect optionally
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx*dx + dy*dy);
        
        // Move particle
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

// Init Particle Network
function initParticles() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 10000;
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 0.5;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 1) - 0.5;
        let directionY = (Math.random() * 1) - 0.5;
        let color = '#00ff41'; // Matrix green
        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

// Connect particles
function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) 
                         + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            if (distance < (canvas.width/7) * (canvas.height/7)) {
                opacityValue = 1 - (distance/30000);
                ctx.strokeStyle = `rgba(0, 255, 65, ${opacityValue})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
        // Also connect to mouse!
        if (mouse.x != null) {
            let dx = particlesArray[a].x - mouse.x;
            let dy = particlesArray[a].y - mouse.y;
            let mouseDistance = dx*dx + dy*dy;
            if (mouseDistance < 25000) {
                let mouseOpacity = 1 - (mouseDistance/25000);
                ctx.strokeStyle = `rgba(0, 255, 65, ${mouseOpacity})`;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }
    }
}

// Animate loop
function animateParticles() {
    requestAnimationFrame(animateParticles);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}

window.addEventListener('resize', function() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    mouse.radius = (canvas.height/80) * (canvas.width/80);
    initParticles();
});

window.addEventListener('mouseout', function() {
    mouse.x = undefined;
    mouse.y = undefined;
});

// Start Background Network
initParticles();
animateParticles();

// Cursor Hover Effects
document.querySelectorAll("a, button, .glass-card, .skill-tag").forEach(element => {
    element.addEventListener("mouseenter", () => {
        cursorOutline.classList.add("cursor-hover");
    });
    element.addEventListener("mouseleave", () => {
        cursorOutline.classList.remove("cursor-hover");
    });
});

// Mobile Navigation Toggle
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
const links = document.querySelectorAll(".nav-links li");

hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    
    // Icon toggle
    const icon = hamburger.querySelector("i");
    if (navLinks.classList.contains("active")) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-times");
    } else {
        icon.classList.remove("fa-times");
        icon.classList.add("fa-bars");
    }
});

// Close mobile menu when a link is clicked
links.forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        const icon = hamburger.querySelector("i");
        icon.classList.remove("fa-times");
        icon.classList.add("fa-bars");
    });
});

// Navbar Scroll Effect
const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});

// Scroll Reveal Animation with Intersection Observer
const reveals = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");

const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const revealOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return;
        } else {
            entry.target.classList.add("active");
            // Optional: stop observing once revealed
            // observer.unobserve(entry.target);
        }
    });
}, revealOptions);

reveals.forEach(reveal => {
    revealOnScroll.observe(reveal);
});

// Active Link Highlight on Scroll
const sections = document.querySelectorAll("section");
const navItems = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute("id");
        }
    });

    navItems.forEach(item => {
        item.classList.remove("active");
        if (item.getAttribute("href").substring(1) === current) {
            item.classList.add("active");
        }
    });
});

// Form Submission Prevention (Just to prevent reload visually without backend)
document.querySelector(".contact-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = e.target.querySelector("button");
    const originalText = btn.innerHTML;
    
    btn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
    
    setTimeout(() => {
        btn.innerHTML = 'Sent Successfully! <i class="fas fa-check"></i>';
        btn.style.background = '#00c853'; // Green color
        btn.style.boxShadow = '0 4px 15px rgba(0, 200, 83, 0.3)';
        
        e.target.reset(); // clear form
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            btn.style.boxShadow = '';
        }, 3000);
    }, 1500);
});
