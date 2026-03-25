// Custom Cursor
const cursorDot = document.querySelector(".cursor-dot");
const cursorOutline = document.querySelector(".cursor-outline");
const shapes = document.querySelectorAll(".shape");

window.addEventListener("mousemove", (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

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

    // Interactive Background Shapes Parallax
    shapes.forEach((shape, index) => {
        // Make the speed multiplier larger so it's very noticeable
        const speed = (index + 1) * 3; 
        
        // Calculate offset from center of screen
        const moveX = (posX - window.innerWidth / 2) * speed / 40;
        const moveY = (posY - window.innerHeight / 2) * speed / 40;
        
        shape.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
});

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
