/* =========================================================
   Soham Kiran Gavate — Portfolio interactions
   ========================================================= */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;

  /* ---------------- Preloader ---------------- */
  function initPreloader() {
    const pre = document.getElementById("preloader");
    const counter = document.getElementById("counter");
    const bar = document.getElementById("loadBar");
    const hero = document.getElementById("hero");

    const finish = () => {
      document.body.classList.add("is-loaded");
      if (hero) hero.classList.add("is-in");
    };

    if (!pre || prefersReduced) {
      if (pre) pre.classList.add("is-done");
      finish();
      return;
    }

    let n = 0;
    const tick = setInterval(() => {
      n += Math.floor(Math.random() * 8) + 3;
      if (n >= 100) {
        n = 100;
        clearInterval(tick);
        setTimeout(() => {
          pre.classList.add("is-done");
          finish();
        }, 400);
      }
      if (counter) counter.textContent = n;
      if (bar) bar.style.width = n + "%";
    }, 90);
  }

  /* ---------------- Custom cursor ---------------- */
  function initCursor() {
    if (isTouch) return;
    const dot = document.getElementById("cursorDot");
    const ring = document.getElementById("cursorRing");
    if (!dot || !ring) return;

    let mx = window.innerWidth / 2,
      my = window.innerHeight / 2;
    let rx = mx,
      ry = my;

    window.addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
    });

    const raf = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    const hoverables = document.querySelectorAll(
      'a, button, [data-cursor]'
    );
    hoverables.forEach((el) => {
      const type = el.getAttribute("data-cursor");
      el.addEventListener("mouseenter", () => {
        ring.classList.add("is-hover");
        if (type === "view") {
          ring.classList.add("is-view");
          dot.classList.add("is-hide");
        }
      });
      el.addEventListener("mouseleave", () => {
        ring.classList.remove("is-hover", "is-view");
        dot.classList.remove("is-hide");
      });
    });

    document.addEventListener("mouseleave", () => {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    });
    document.addEventListener("mouseenter", () => {
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    });
  }

  /* ---------------- Scroll progress + nav hide ---------------- */
  function initScroll() {
    const progress = document.getElementById("progressBar");
    const nav = document.getElementById("nav");
    let lastY = 0;

    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
      if (progress) progress.style.width = scrolled * 100 + "%";

      const y = h.scrollTop;
      if (nav) {
        if (y > lastY && y > 300) nav.classList.add("is-hidden");
        else nav.classList.remove("is-hidden");
      }
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------------- Reveal on scroll ---------------- */
  function initReveal() {
    const els = document.querySelectorAll(".reveal");
    if (prefersReduced || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            // subtle stagger for siblings in same container
            const delay = Math.min(parseInt(el.dataset.delay || 0, 10), 400);
            setTimeout(() => el.classList.add("is-in"), delay);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    // stagger reveal items that share a parent grid
    document.querySelectorAll(".skills__grid, .journey__grid, .about__stats, .hero__meta").forEach((group) => {
      group.querySelectorAll(".reveal").forEach((el, i) => {
        el.dataset.delay = i * 60;
      });
    });

    els.forEach((el) => io.observe(el));
  }

  /* ---------------- Animated counters ---------------- */
  function initCounters() {
    const stats = document.querySelectorAll(".stat");
    if (!("IntersectionObserver" in window)) {
      stats.forEach((s) => {
        const num = s.querySelector(".stat__num");
        num.textContent = s.dataset.count + (s.dataset.suffix || "");
      });
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const s = entry.target;
          const num = s.querySelector(".stat__num");
          const target = parseFloat(s.dataset.count);
          const suffix = s.dataset.suffix || "";
          io.unobserve(s);

          if (prefersReduced) {
            num.textContent = target + suffix;
            return;
          }
          const dur = 1400;
          const start = performance.now();
          const step = (now) => {
            const p = Math.min((now - start) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            num.textContent = Math.round(target * eased) + (p === 1 ? suffix : "");
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        });
      },
      { threshold: 0.6 }
    );
    stats.forEach((s) => io.observe(s));
  }

  /* ---------------- Mobile menu ---------------- */
  function initMenu() {
    const toggle = document.getElementById("navToggle");
    const menu = document.getElementById("mobileMenu");
    if (!toggle || !menu) return;

    const close = () => {
      toggle.classList.remove("is-open");
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      menu.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };
    toggle.addEventListener("click", () => {
      const open = menu.classList.toggle("is-open");
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      menu.setAttribute("aria-hidden", String(!open));
      document.body.style.overflow = open ? "hidden" : "";
    });
    menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
  }

  /* ---------------- Hero canvas (connected dots grid) ---------------- */
  function initCanvas() {
    const canvas = document.getElementById("heroCanvas");
    if (!canvas || prefersReduced) return;
    const ctx = canvas.getContext("2d");
    let w, h, points, raf;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    const mouse = { x: -9999, y: -9999 };

    function resize() {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * DPR;
      canvas.height = h * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      build();
    }

    function build() {
      const density = Math.max(26, Math.round((w * h) / 26000));
      const count = Math.min(density, 90);
      points = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.4 + 0.6,
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      const maxDist = 130;

      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        // mouse repel
        const dmx = p.x - mouse.x;
        const dmy = p.y - mouse.y;
        const dm = Math.hypot(dmx, dmy);
        if (dm < 120) {
          p.x += (dmx / dm) * (120 - dm) * 0.015;
          p.y += (dmy / dm) * (120 - dm) * 0.015;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(10,10,10,0.5)";
        ctx.fill();

        for (let j = i + 1; j < points.length; j++) {
          const q = points[j];
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < maxDist) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(10,10,10,${(1 - d / maxDist) * 0.16})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    }

    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    canvas.addEventListener("mouseleave", () => {
      mouse.x = -9999;
      mouse.y = -9999;
    });

    // pause when offscreen
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          if (!raf) raf = requestAnimationFrame(draw);
        } else {
          cancelAnimationFrame(raf);
          raf = null;
        }
      });
    });
    io.observe(canvas);

    resize();
  }

  /* ---------------- Year ---------------- */
  function initYear() {
    const y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
  }

  /* ---------------- Boot ---------------- */
  document.addEventListener("DOMContentLoaded", () => {
    initPreloader();
    initCursor();
    initScroll();
    initReveal();
    initCounters();
    initMenu();
    initCanvas();
    initYear();
  });
})();
