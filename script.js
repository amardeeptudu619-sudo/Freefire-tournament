
const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");
const filters = document.querySelectorAll(".filter");
const cards = document.querySelectorAll(".tournament-card");
const emptyMessage = document.getElementById("emptyMessage");

document.getElementById("year").textContent = new Date().getFullYear();

// Mobile navigation
menuBtn.addEventListener("click", () => {
  const open = navMenu.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(open));
});

navMenu.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => navMenu.classList.remove("open"));
});

// Filter tournaments
filters.forEach(button => {
  button.addEventListener("click", () => {
    filters.forEach(filter => filter.classList.remove("active"));
    button.classList.add("active");

    let visible = 0;
    const selected = button.dataset.filter;

    cards.forEach(card => {
      const match = selected === "all" || card.dataset.type === selected;
      card.hidden = !match;
      if (match) visible++;
    });

    emptyMessage.hidden = visible > 0;
  });
});

// Join buttons open Gmail with a prefilled enquiry
document.querySelectorAll(".register-btn").forEach(button => {
  button.addEventListener("click", () => {
    const eventName = button.dataset.event;
    const subject = encodeURIComponent(`YouFF Tournament - ${eventName}`);
    const body = encodeURIComponent(
      `Hello YouFF Organiser,\n\nI am interested in ${eventName}.\nPlease share the event date, rules and registration details.\n\nThank you.`
    );

    const url = `https://mail.google.com/mail/?view=cm&fs=1&to=vivekfromindia18@gmail.com&su=${subject}&body=${body}`;
    window.open(url, "_blank", "noopener");
  });
});

// Animated arena background: glowing particles and energy streaks
const canvas = document.getElementById("arenaCanvas");
const ctx = canvas.getContext("2d");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let width = 0;
let height = 0;
let particles = [];
let streaks = [];
let frame = 0;

function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * ratio);
  canvas.height = Math.floor(height * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  particles = Array.from(
    { length: Math.min(45, Math.floor(width / 10)) },
    () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.8 + .4,
      speed: Math.random() * .35 + .12,
      phase: Math.random() * Math.PI * 2
    })
  );

  streaks = Array.from({ length: 5 }, () => makeStreak(true));
}

function makeStreak(randomY = false) {
  return {
    x: Math.random() * width,
    y: randomY ? Math.random() * height : -40,
    length: 25 + Math.random() * 65,
    speed: 2 + Math.random() * 3,
    alpha: .12 + Math.random() * .28
  };
}

function animateArena() {
  if (document.hidden) {
    requestAnimationFrame(animateArena);
    return;
  }

  frame++;
  ctx.clearRect(0, 0, width, height);

  // Tiny glowing particles
  particles.forEach(p => {
    p.y -= p.speed;
    p.phase += .018;
    if (p.y < -5) {
      p.y = height + 5;
      p.x = Math.random() * width;
    }

    const glow = .25 + (Math.sin(p.phase) + 1) * .2;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(72, 227, 255, ${glow})`;
    ctx.fill();
  });

  // Diagonal energy streaks
  if (frame % 65 === 0 && streaks.length < 7) {
    streaks.push(makeStreak());
  }

  streaks.forEach((s, index) => {
    s.x += s.speed;
    s.y += s.speed * .7;

    const gradient = ctx.createLinearGradient(
      s.x, s.y, s.x - s.length, s.y - s.length * .7
    );
    gradient.addColorStop(0, `rgba(72,227,255,${s.alpha})`);
    gradient.addColorStop(1, "rgba(167,139,250,0)");

    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(s.x - s.length, s.y - s.length * .7);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 1.4;
    ctx.stroke();

    if (s.x > width + 100 || s.y > height + 100) {
      streaks[index] = makeStreak();
    }
  });

  requestAnimationFrame(animateArena);
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

if (!reduceMotion) {
  requestAnimationFrame(animateArena);
                        }
