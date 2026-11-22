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
    const section = document.querySelector(link.hash);
    if (section) spy.observe(section);
  });
}

// --- Stardust field in the footer -------------------------------------------

const footerBg = document.querySelector(".footer-bg");
if (footerBg) {
  const frag = document.createDocumentFragment();
  for (let i = 0; i < 110; i++) {
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
  footerBg.appendChild(frag);
}

// --- Footer year ------------------------------------------------------------

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

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
