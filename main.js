// ================= HEADER & HAMBURGER SCROLL =================
let lastScrollTop = 0;
const header = document.querySelector('.header');
const hamburger = document.getElementById('hamburger');

window.addEventListener('scroll', () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if(scrollTop > lastScrollTop){
        // scrolling down -> hide header but keep hamburger visible
        header.style.top = '-60px';
        hamburger.style.top = '15px';
    } else {
        // scrolling up -> show header & hamburger
        header.style.top = '0';
        hamburger.style.top = '15px';
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;

    // === Scroll reveal animations ===
    revealOnScroll();
});

// ================= HAMBURGER MENU =================
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close nav when link clicked (mobile)
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// ================= SMOOTH SCROLL =================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e){
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if(target){
            target.scrollIntoView({behavior:'smooth', block:'start'});
        }
    });
});

// ================= SCROLL REVEAL FUNCTION =================
function revealOnScroll() {
    const revealElements = document.querySelectorAll('.hero-content, .about-section, .developer-section, .developer-card, .connect-section, .footer');

    revealElements.forEach(el => {
        const windowHeight = window.innerHeight;
        const elementTop = el.getBoundingClientRect().top;
        const revealPoint = 150; // Trigger point

        if(elementTop < windowHeight - revealPoint){
            el.classList.add('active');
        } else {
            el.classList.remove('active'); // reverse animation when scrolling up
        }
    });
}

// ================= DEVELOPER CAROUSEL SWIPE =================
const carousel = document.querySelector('.developer-carousel');
let isDown = false, startX, scrollLeft;
let touchStartX = 0, touchScrollLeft = 0;

// Mouse events
carousel.addEventListener('mousedown', e => {
    isDown = true;
    carousel.classList.add('active');
    startX = e.pageX - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
    carousel.style.scrollBehavior = 'auto'; // disable smooth during drag
});
carousel.addEventListener('mouseleave', () => { 
    isDown = false; 
    carousel.classList.remove('active'); 
});
carousel.addEventListener('mouseup', () => { 
    isDown = false; 
    carousel.classList.remove('active'); 
    carousel.style.scrollBehavior = 'smooth'; 
});
carousel.addEventListener('mousemove', e => {
    if(!isDown) return;
    e.preventDefault();
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - startX) * 1.5;
    carousel.scrollLeft = scrollLeft - walk;
});

// Touch events
carousel.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].pageX;
  touchScrollLeft = carousel.scrollLeft;
  carousel.style.scrollBehavior = 'auto';
});
carousel.addEventListener('touchmove', e => {
  const touchX = e.touches[0].pageX;
  const walk = (touchX - touchStartX) * 1.5;
  carousel.scrollLeft = touchScrollLeft - walk;
});
carousel.addEventListener('touchend', () => {
  carousel.style.scrollBehavior = 'smooth';
});

// ================= EMAILJS INIT =================
(function(){
    emailjs.init('l5k-cYdf5ZBJNUscH'); // Public Key
})();

const form = document.getElementById('connect-form');
let isSending = false; // prevents double send

// Create popup if missing
let popup = document.getElementById('form-popup');
if(!popup){
    popup = document.createElement('div');
    popup.id = 'form-popup';
    popup.className = 'form-popup';
    document.body.appendChild(popup);
}

function showPopup(message){
    popup.textContent = message;
    popup.classList.add('show');
    setTimeout(() => popup.classList.remove('show'), 3000);
}

// Remove old listeners by cloning the form
const newForm = form.cloneNode(true);
form.parentNode.replaceChild(newForm, form);

newForm.addEventListener('submit', function(e){
    e.preventDefault();

    if(isSending) return;
    isSending = true;

    const btn = newForm.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = "Sending...";

    Promise.all([
        emailjs.sendForm('service_sqdtvkh','template_s6bkhxq', newForm),
        emailjs.sendForm('service_sqdtvkh','template_c6e1wbq', newForm)
    ])
    .then(() => {
        showPopup("Message sent successfully! 📩");
        newForm.reset();
    })
    .catch((error) => {
        console.error("EmailJS Error:", error);
        showPopup("Failed to send message. Please try again.");
    })
    .finally(() => {
        btn.disabled = false;
        btn.textContent = "Send Message";
        isSending = false;
    });
});

// ================= INITIAL REVEAL =================
window.addEventListener('load', revealOnScroll);