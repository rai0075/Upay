// FAQ Toggle
document.querySelectorAll(".faq-question").forEach(button => {
  button.addEventListener("click", () => {
    const answer = button.nextElementSibling;
    answer.style.display = answer.style.display === "block" ? "none" : "block";
  });
});

// Mobile Menu Toggle
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

menuToggle.addEventListener("click", () => {
  navMenu.classList.toggle("show");
});



function drawMeter(canvasId, value) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext("2d");
  const centerX = canvas.width / 2;
  const centerY = canvas.height - 10;
  const radius = 70;

  let start = null;
  let duration = 1500; // animation duration (ms)
  let targetValue = value;

  function animate(timestamp) {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);

    // Ease-out animation
    const currentValue = targetValue * (1 - Math.pow(1 - progress, 3));

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Base arc (gray)
    ctx.beginPath();
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 15;
    ctx.arc(centerX, centerY, radius, Math.PI, 0, false);
    ctx.stroke();

    // Progress arc (gold)
    ctx.beginPath();
    ctx.strokeStyle = "#FFD700";
    ctx.lineWidth = 15;
    ctx.arc(
      centerX,
      centerY,
      radius,
      Math.PI,
      Math.PI - (currentValue / 100) * Math.PI,
      true
    );
    ctx.stroke();

    // Needle
    const angle = Math.PI - (currentValue / 100) * Math.PI;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + radius * Math.cos(angle), centerY - radius * Math.sin(angle));
    ctx.strokeStyle = "#673AB7"; // purple
    ctx.lineWidth = 4;
    ctx.stroke();

    // Needle dot
    ctx.beginPath();
    ctx.arc(centerX, centerY, 6, 0, 2 * Math.PI);
    ctx.fillStyle = "#673AB7";
    ctx.fill();

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
}

// Trigger when section is visible
function initMeters() {
  drawMeter("meter1", 80);  // Overview
  drawMeter("meter2", 70);  // Traffic Score
  drawMeter("meter3", 95);  // Feedback

  // Stars sync
  document.querySelectorAll(".stars").forEach(starEl => {
    const rating = parseInt(starEl.getAttribute("data-stars"));
    starEl.textContent = "★".repeat(rating) + "☆".repeat(5 - rating);
  });
}

// Observer for scroll animation
const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      initMeters();
      observer.unobserve(entry.target); // run once
    }
  });
}, { threshold: 0.3 });

observer.observe(document.querySelector(".score-meters"));

// Also re-run on click
document.querySelectorAll(".meter").forEach(m => {
  m.addEventListener("click", () => initMeters());
});





// Smooth scroll with easing
function smoothScroll(target, duration = 1000) {
  const targetEl = document.querySelector(target);
  const startPosition = window.pageYOffset;
  const targetPosition = targetEl.getBoundingClientRect().top + startPosition;
  const distance = targetPosition - startPosition;
  let startTime = null;

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = easeInOutCubic(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  }

  function easeInOutCubic(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t * t + b;
    t -= 2;
    return c / 2 * (t * t * t + 2) + b;
  }

  requestAnimationFrame(animation);
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    smoothScroll(this.getAttribute("href"), 1200);
  });
});

// Hero animation
const hero = document.querySelector(".hero");
const heroContent = document.querySelector(".hero-content");

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  const heroHeight = hero.offsetHeight;

  // Parallax + scale for hero content
  heroContent.style.transform = `translateY(${scrollY * 0.3}px) scale(${1 - scrollY * 0.0004})`;
  heroContent.style.opacity = Math.max(1 - scrollY / 400, 0);

  // Sticky background effect
  if (scrollY < heroHeight) {
    hero.style.backgroundAttachment = "fixed";
  } else {
    hero.style.backgroundAttachment = "scroll";
  }
});
