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

// full radial burst behind the about section
makeRays(document.querySelector(".rays"), {
  cx: 300, cy: 300, rInner: 60, rOuter: 420, start: 0, end: 360, count: 48,
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

// --- Footer year ------------------------------------------------------------

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();
