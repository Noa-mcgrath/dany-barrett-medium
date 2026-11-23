// ============================================================
// Awaken Your Soul — interactions
// ============================================================

// --- Generate decorative SVG ray ornaments ---------------------------------

function makeRays(group, { cx, cy, rInner, rOuter, start, end, count }) {
  if (!group) return;
  const ns = "http://www.w3.org/2000/svg";
  for (let i = 0; i <= count; i++) {
    const angle = start + ((end - start) * i) / count;
    const rad = (angle * Math.PI) / 180;
    const line = document.createElementNS(ns, "line");
    line.setAttribute("x1", cx + rInner * Math.cos(rad));
    line.setAttribute("y1", cy + rInner * Math.sin(rad));
    line.setAttribute("x2", cx + rOuter * Math.cos(rad));
    line.setAttribute("y2", cy + rOuter * Math.sin(rad));
    line.setAttribute("stroke", "currentColor");
    line.setAttribute("stroke-width", "0.6");
    group.appendChild(line);
  }
}

// perspective ray grid fanning down from the top of the about section
makeRays(document.querySelector(".rays"), {
  cx: 300, cy: 0, rInner: 70, rOuter: 820, start: 10, end: 170, count: 52,
});

// crown of rays above the portrait arch
makeRays(document.querySelector(".crown-rays"), {
  cx: 60, cy: 40, rInner: 14, rOuter: 36, start: 200, end: 340, count: 18,
});

// half-fan ornament in the services section
makeRays(document.querySelector(".fan-rays"), {
  cx: 100, cy: 50, rInner: 8, rOuter: 46, start: 180, end: 360, count: 30,
});

// --- Scroll-reveal animations ----------------------------------------------

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// --- Nav: scrolled state + active-section tracking ---------------------------

const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".nav-links a");

if (siteNav) {
  const onScroll = () => siteNav.classList.toggle("scrolled", window.scrollY > 60);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

if (navLinks.length) {
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) =>
          link.classList.toggle("active", link.hash === `#${entry.target.id}`)
        );
      });
    },
    // a section becomes "active" when it crosses the middle of the viewport
    { rootMargin: "-45% 0px -50% 0px" }
  );

  navLinks.forEach((link) => {
    const section = link.hash ? document.querySelector(link.hash) : null;
    if (section) spy.observe(section);
  });
}

// --- Stardust fields (footer + booking milky way) ----------------------------

function scatterStardust(container, count) {
  if (!container) return;
  const frag = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const speck = document.createElement("span");
    const isStar = i % 14 === 0; // a few proper four-point stars among the dust
    speck.className = "dust";
    if (isStar) speck.classList.add("dust--star");
    if (i % 4 === 0) speck.classList.add("dust--wine");
    const size = isStar ? 6 + Math.random() * 6 : 0.8 + Math.random() * 2.2;
    speck.style.cssText = [
      `left:${(Math.random() * 100).toFixed(2)}%`,
      `top:${(Math.random() * 94).toFixed(2)}%`,
      `width:${size.toFixed(1)}px`,
      `height:${size.toFixed(1)}px`,
      `animation-delay:${(-Math.random() * 6).toFixed(2)}s`,
      `animation-duration:${(3.5 + Math.random() * 4).toFixed(2)}s`,
    ].join(";");
    frag.appendChild(speck);
  }
  container.appendChild(frag);
}

scatterStardust(document.querySelector(".footer-bg"), 110);
scatterStardust(document.querySelector(".milkyway-bg"), 70);

// --- Spinning spiral galaxy in the booking section ----------------------------

const galaxyRotor = document.querySelector(".milkyway-rotor");
if (galaxyRotor) {
  const CX = 600;
  const SWEEP = 2.6 * Math.PI; // how far each arm winds around the core
  const R_START = 55;
  const R_END = 560;
  const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
  const armPoint = (offset, t) => {
    const theta = offset + t * SWEEP;
    const r = R_START + (R_END - R_START) * Math.pow(t, 0.8);
    return [CX + r * Math.cos(theta), CX + r * Math.sin(theta)];
  };

  // soft glowing spiral arm ribbons
  const armsGroup = document.querySelector(".galaxy-arm-paths");
  if (armsGroup) {
    const ns = "http://www.w3.org/2000/svg";
    const armPath = (offset) => {
      let d = "";
      for (let s = 0; s <= 48; s++) {
        const [x, y] = armPoint(offset, s / 48);
        d += `${s ? " L" : "M"} ${x.toFixed(1)} ${y.toFixed(1)}`;
      }
      return d;
    };
    const ribbons = [
      { offset: 0, color: "rgba(240, 228, 206, 0.18)", width: 62 },
      { offset: 0, color: "rgba(222, 140, 168, 0.3)", width: 40 },
      { offset: 0.35, color: "rgba(150, 120, 200, 0.27)", width: 46 },
      { offset: Math.PI, color: "rgba(240, 228, 206, 0.15)", width: 62 },
      { offset: Math.PI, color: "rgba(120, 155, 210, 0.3)", width: 40 },
      { offset: Math.PI + 0.35, color: "rgba(150, 120, 200, 0.24)", width: 46 },
    ];
    ribbons.forEach(({ offset, color, width }) => {
      const path = document.createElementNS(ns, "path");
      path.setAttribute("d", armPath(offset));
      path.setAttribute("stroke", color);
      path.setAttribute("stroke-width", width);
      path.setAttribute("stroke-linecap", "round");
      armsGroup.appendChild(path);
    });
  }

  // stars along the arms + core bulge, all spinning with the rotor
  const frag = document.createDocumentFragment();
  const addSpeck = (x, y, size, colorRoll) => {
    const speck = document.createElement("span");
    speck.className = "dust";
    if (colorRoll < 0.2) speck.classList.add("dust--pink");
    else if (colorRoll < 0.4) speck.classList.add("dust--violet");
    else if (colorRoll < 0.57) speck.classList.add("dust--blue");
    else if (colorRoll < 0.66) speck.classList.add("dust--wine");
    speck.style.cssText = [
      `left:${((x / 1200) * 100).toFixed(2)}%`,
      `top:${((y / 1200) * 100).toFixed(2)}%`,
      `width:${size.toFixed(1)}px`,
      `height:${size.toFixed(1)}px`,
      `animation-delay:${(-Math.random() * 6).toFixed(2)}s`,
      `animation-duration:${(3.5 + Math.random() * 4).toFixed(2)}s`,
    ].join(";");
    frag.appendChild(speck);
  };
  for (let i = 0; i < 680; i++) {
    const t = Math.pow(Math.random(), 0.85);
    const [ax, ay] = armPoint((i % 2) * Math.PI, t);
    const drift = 10 + 34 * t;
    const bright = Math.random() > 0.95;
    addSpeck(
      ax + gauss() * drift,
      ay + gauss() * drift,
      bright ? 2.4 + Math.random() * 1.2 : 0.5 + Math.random() * 1.7,
      Math.random()
    );
  }
  for (let i = 0; i < 130; i++) {
    // dense warm bulge around the galactic core
    const r = Math.abs(gauss()) * 110;
    const theta = Math.random() * 2 * Math.PI;
    addSpeck(
      CX + r * Math.cos(theta),
      CX + r * Math.sin(theta),
      0.6 + Math.random() * 1.6,
      Math.random() * 0.4 + 0.55
    );
  }
  galaxyRotor.appendChild(frag);
}

// --- Booking milky way: star points open session cards -----------------------

const starNodes = document.querySelectorAll(".star-node");
const starCards = document.querySelectorAll(".star-card");

starNodes.forEach((node) => {
  node.addEventListener("click", () => {
    const card = document.getElementById(node.getAttribute("aria-controls"));
    const isOpen = node.getAttribute("aria-expanded") === "true";
    starNodes.forEach((n) => n.setAttribute("aria-expanded", "false"));
    starCards.forEach((c) => { c.hidden = true; });
    if (!isOpen && card) {
      node.setAttribute("aria-expanded", "true");
      card.hidden = false;
    }
  });
});

// --- Star points orbit the galactic axis --------------------------------------

const orbitNodes = Array.from(starNodes)
  .filter((node) => node.dataset.orbit)
  .map((node) => ({
    node,
    a: parseFloat(node.dataset.orbit),
    phase: (parseFloat(node.dataset.phase || 0) * Math.PI) / 180,
  }));

if (orbitNodes.length) {
  const rotor = document.querySelector(".milkyway-rotor");
  const OMEGA = (2 * Math.PI) / 150; // match the galaxy's spin rate
  let orbitAngle = 0;
  let orbitPaused = false;

  const placeOrbitNodes = () => {
    orbitNodes.forEach(({ node, a, phase }) => {
      const theta = phase + orbitAngle;
      node.style.left = `${(50 + a * Math.cos(theta)).toFixed(3)}%`;
      node.style.top = `${(36 + a * 0.7 * Math.sin(theta)).toFixed(3)}%`;
    });
  };
  placeOrbitNodes();

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion) {
    let last = performance.now();
    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.5);
      last = now;
      if (!orbitPaused) {
        orbitAngle += OMEGA * dt;
        placeOrbitNodes();
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    // hold the cosmos still while choosing a star
    const setPaused = (paused) => {
      orbitPaused = paused;
      if (rotor) rotor.classList.toggle("paused", paused);
    };
    orbitNodes.forEach(({ node }) => {
      node.addEventListener("mouseenter", () => setPaused(true));
      node.addEventListener("mouseleave", () => setPaused(false));
      node.addEventListener("focus", () => setPaused(true));
      node.addEventListener("blur", () => setPaused(false));
      node.addEventListener("touchstart", () => setPaused(true), { passive: true });
      node.addEventListener("touchend", () => setTimeout(() => setPaused(false), 800), { passive: true });
    });
  }
}

// --- Footer year ------------------------------------------------------------

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// --- Payment section: revealed after a booking is confirmed -------------------

const paySection = document.getElementById("pay");
if (paySection) {
  let pending = null;
  try {
    pending = JSON.parse(localStorage.getItem("rwd_pay_pending"));
  } catch (e) {}
  const FRESH_MS = 48 * 60 * 60 * 1000; // show for up to 48h after booking
  if (pending && typeof pending.t === "number" && Date.now() - pending.t < FRESH_MS) {
    paySection.hidden = false;

    // spotlight the pay button matching the booked session
    if (pending.service) {
      const match = paySection.querySelector(`.btn--pay[data-service="${pending.service}"]`);
      if (match) match.classList.add("suggested");
    }

    const dismiss = paySection.querySelector(".payment-dismiss");
    if (dismiss) {
      dismiss.addEventListener("click", () => {
        try {
          localStorage.removeItem("rwd_pay_pending");
        } catch (e) {}
        paySection.hidden = true;
      });
    }

    if (window.location.hash === "#pay") {
      paySection.scrollIntoView({ behavior: "smooth" });
    }
  }
}

// --- Get In Touch: reveal email + phone options -------------------------------

const contactToggle = document.querySelector(".contact-toggle");
const contactOptions = document.getElementById("contact-options");

if (contactToggle && contactOptions) {
  contactToggle.addEventListener("click", () => {
    const isOpen = contactToggle.getAttribute("aria-expanded") === "true";
    contactToggle.setAttribute("aria-expanded", String(!isOpen));
    contactOptions.hidden = isOpen;
  });
}
