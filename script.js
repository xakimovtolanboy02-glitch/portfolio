const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let w, h, points;
const mouse = { x: null, y: null, radius: 160 };

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);

window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

resize();

window.addEventListener('click', (e) => {
  for (const p of points) {
    const dx = p.x - e.clientX;
    const dy = p.y - e.clientY;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;

    if (dist < 200) {
      const force = (200 - dist) / 200;
      p.vx += (dx / dist) * force * 4;
      p.vy += (dy / dist) * force * 4;
    }
  }
});

const NUM_POINTS = 70;
const MAX_DIST = 150;

points = Array.from({ length: NUM_POINTS }, () => ({
  x: Math.random() * w,
  y: Math.random() * h,
  vx: (Math.random() - 0.5) * 0.3,
  vy: (Math.random() - 0.5) * 0.3,
  r: Math.random() * 1.5 + 1
}));

function animate() {
  ctx.clearRect(0, 0, w, h);

  for (const p of points) {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > w) p.vx *= -1;
    if (p.y < 0 || p.y > h) p.vy *= -1;

    // sichqonchadan sekin uzoqlashish effekti
    if (mouse.x !== null) {
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius;
        p.x += (dx / dist) * force * 1.2;
        p.y += (dy / dist) * force * 1.2;
      }
    }
  }

  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const dx = points[i].x - points[j].x;
      const dy = points[i].y - points[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < MAX_DIST) {
        const opacity = 1 - dist / MAX_DIST;
        ctx.strokeStyle = `rgba(94, 234, 212, ${opacity * 0.6})`;
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(points[i].x, points[i].y);
        ctx.lineTo(points[j].x, points[j].y);
        ctx.stroke();
      }
    }

    // porlash (glow) effekti
    const gradient = ctx.createRadialGradient(
      points[i].x, points[i].y, 0,
      points[i].x, points[i].y, 6
    );

    gradient.addColorStop(0, 'rgba(94, 234, 212, 0.9)');
    gradient.addColorStop(1, 'rgba(94, 234, 212, 0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(points[i].x, points[i].y, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  requestAnimationFrame(animate);
}

animate();

function typeWriter(elementId, text, speed, callback) {
  const el = document.getElementById(elementId);
  let idx = 0;

  function type() {
    if (idx < text.length) {
      el.textContent += text.charAt(idx);
      idx++;
      setTimeout(type, speed);
    } else if (callback) {
      callback();
    }
  }

  type();
}

function typeNav(callback) {
  const links = document.querySelectorAll('#typed-nav a');
  let i = 0;

  function typeNext() {
    if (i < links.length) {
      const link = links[i];
      const text = link.dataset.text;
      let idx = 0;

      function type() {
        if (idx < text.length) {
          link.textContent += text.charAt(idx);
          idx++;
          setTimeout(type, 35);
        } else {
          i++;
          typeNext();
        }
      }

      type();
    } else if (callback) {
      callback();
    }
  }

  typeNext();
}

typeWriter('typed-kicker', '// Portfolio', 90, () => {
  typeWriter('typed-name', "To'lanboy Xakimov", 90, () => {
    typeWriter(
      'typed-tagline',
      "Software Engineer — veb-saytlar va ilovalar yasashga qiziqaman. Frontend va backend bo'yicha ishlashni yoqtiraman.",
      25,
      () => {
        typeNav();
      }
    );
  });
});
