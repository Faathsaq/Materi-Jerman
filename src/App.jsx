import { useState, useEffect, useRef } from "react";
import { HashRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform, useInView, useSpring } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import jermanImg from "./assets/jerman.jpg";
import dalgonaImg from "./assets/dalgona.jpg";
import deutschIcon from "./assets/Deutsch.jpg";
import heroImg1 from "./assets/1.jpg";
import heroImg2 from "./assets/2.jpg";
import heroImg3 from "./assets/3.jpg";

gsap.registerPlugin(ScrollTrigger);

const C = {
  espresso: "#2C1A0E",
  mocha:    "#6B3E1A",
  caramel:  "#C9773A",
  latte:    "#E8D5BC",
  cream:    "#FDF6EE",
  foam:     "#FAF0E2",
  bark:     "#3D2010",
  gold:     "#D4943A",
};

const ease = {
  out:   [0.16, 1, 0.3, 1],
  inOut: [0.87, 0, 0.13, 1],
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body {
    background: ${C.espresso};
    font-family: 'DM Sans', sans-serif;
    color: ${C.espresso};
    overflow-x: hidden;
    width: 100%;
  }
  #root { width: 100%; min-height: 100vh; background: ${C.espresso}; }
  .site-wrap { min-height: 100vh; background: ${C.cream}; width: 100%; display: flex; flex-direction: column; }

  /* NAV */
  .nav {
    background: ${C.espresso};
    padding: 0 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 56px;
    border-bottom: 3px solid ${C.caramel};
    position: sticky;
    top: 0;
    z-index: 100;
    width: 100%;
  }
  .nav-logo { font-family: 'DM Serif Display', serif; color: ${C.latte}; font-size: 20px; letter-spacing: 0.01em; text-decoration: none; }
  .nav-links { display: flex; gap: 4px; }
  .nav-link {
    color: ${C.latte}; font-size: 13px; font-weight: 400; padding: 7px 14px;
    border-radius: 6px; text-decoration: none; border: 1.5px solid transparent;
    transition: border-color 0.15s, color 0.15s; letter-spacing: 0.03em; position: relative; overflow: hidden;
  }
  .nav-link:hover { border-color: ${C.caramel}; color: ${C.caramel}; }
  .nav-link.active { border-color: ${C.caramel}; color: ${C.caramel}; }

  /* HERO */
  .hero { position: relative; height: 420px; overflow: hidden; border-bottom: 3px solid ${C.espresso}; width: 100%; }
  .hero-slide {
    position: absolute; inset: 0;
    width: 100%; height: 100%;
    opacity: 0;
    transition: opacity 0s;
  }
  .hero-slide.active { opacity: 1; }
  .hero-slide img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .hero-dots {
    position: absolute; bottom: 16px; right: 24px;
    display: flex; gap: 8px; z-index: 10;
  }
  .hero-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: rgba(255,255,255,0.4); border: none; cursor: pointer;
    padding: 0; transition: background 0.3s, transform 0.3s;
  }
  .hero-dot.active { background: ${C.caramel}; transform: scale(1.3); }
  .hero-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(28,14,4,0.82) 0%, rgba(28,14,4,0.3) 60%, transparent 100%);
    display: flex; flex-direction: column; justify-content: flex-end; padding: 40px 36px;
  }
  .hero-tag {
    display: inline-block; background: ${C.caramel}; color: ${C.cream};
    font-size: 10px; font-weight: 500; padding: 4px 12px; border-radius: 4px;
    letter-spacing: 0.1em; margin-bottom: 12px; width: fit-content; text-transform: uppercase;
  }
  .hero-title { font-family: 'DM Serif Display', serif; font-size: 48px; color: #FDF6EE; line-height: 1.1; margin-bottom: 12px; }
  .hero-sub { font-size: 15px; color: ${C.latte}; line-height: 1.6; max-width: 500px; font-weight: 300; }

  /* GSAP TEXT — split words */
  .gsap-word { display: inline-block; overflow: hidden; }
  .gsap-word-inner { display: inline-block; }

  /* SECTION */
  .section-header { padding: 28px 36px 16px; display: flex; align-items: center; gap: 14px; border-bottom: 0.5px solid ${C.latte}; width: 100%; }
  .section-title { font-family: 'DM Serif Display', serif; font-size: 22px; color: ${C.espresso}; white-space: nowrap; }
  .section-line { flex: 1; height: 1px; background: ${C.latte}; transform-origin: left; }

  /* CARDS */
  .cards-grid { display: grid; grid-template-columns: 1fr 1fr; border-bottom: 2px solid ${C.espresso}; width: 100%; align-items: start; }
  .card {
    border-right: 1.5px solid ${C.espresso}; overflow: hidden; cursor: pointer;
    background: ${C.cream}; text-decoration: none; display: block; color: inherit; position: relative; width: 100%;
  }
  .card:last-child { border-right: none; }

  /* SHIMMER on images */
  .img-wrap { overflow: hidden; width: 100%; position: relative; height: 260px; display: block; }
  .img-wrap::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.28) 50%, transparent 60%);
    transform: translateX(-100%);
    pointer-events: none;
    z-index: 2;
  }
  .img-wrap.shimmer::after { transform: translateX(100%); transition: transform 0.65s ease; }

  .card-img { width: 100%; height: 100%; object-fit: cover; display: block; border-bottom: 1.5px solid ${C.espresso}; transition: transform 0.7s cubic-bezier(0.16,1,0.3,1); }
  .card:hover .card-img { transform: scale(1.07); }

  .card-body { padding: 20px 24px; }
  .card-tag { display: inline-block; font-size: 10px; font-weight: 500; padding: 3px 10px; border-radius: 4px; margin-bottom: 10px; letter-spacing: 0.06em; text-transform: uppercase; border: 1.5px solid; }
  .tag-story  { background: #F0E0C8; color: ${C.mocha}; border-color: ${C.mocha}; }
  .tag-recipe { background: #D6EADE; color: #2A5C25; border-color: #2A5C25; }
  .card-title { font-family: 'DM Serif Display', serif; font-size: 20px; color: ${C.espresso}; margin-bottom: 8px; line-height: 1.25; }
  .card-excerpt { font-size: 13px; color: ${C.mocha}; line-height: 1.6; font-weight: 300; }
  .card-cta { display: inline-flex; align-items: center; gap: 6px; margin-top: 14px; font-size: 12px; font-weight: 500; color: ${C.caramel}; letter-spacing: 0.04em; }

  /* QUOTE */
  .quote-strip { background: ${C.bark}; padding: 32px 36px; display: flex; align-items: center; justify-content: center; gap: 16px; width: 100%; border-top: 2px solid ${C.caramel}; }
  .quote-deco { color: ${C.caramel}; font-size: 40px; font-family: 'DM Serif Display', serif; line-height: 1; opacity: 0.7; }
  .quote-text { font-family: 'DM Serif Display', serif; font-style: italic; font-size: 18px; color: ${C.latte}; text-align: center; line-height: 1.5; max-width: 500px; }

  /* FOOTER */
  .footer { background: ${C.espresso}; padding: 16px 36px; display: flex; justify-content: space-between; align-items: center; border-top: 2px solid ${C.caramel}; width: 100%; margin-top: auto; }
  .footer-logo { font-family: 'DM Serif Display', serif; color: ${C.latte}; font-size: 16px; }
  .footer-text { color: ${C.mocha}; font-size: 11px; letter-spacing: 0.04em; }

  /* PAGE */
  .page-wrap { max-width: 720px; margin: 0 auto; padding: 48px 36px 80px; }
  .page-back { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: ${C.caramel}; margin-bottom: 32px; cursor: pointer; font-weight: 500; letter-spacing: 0.04em; text-decoration: none; border: 1.5px solid ${C.caramel}; padding: 6px 14px; border-radius: 6px; transition: background 0.15s; }
  .page-back:hover { background: #F0E0C8; }

  /* PAGE HERO IMG with shimmer */
  .page-img-wrap { position: relative; overflow: hidden; border-radius: 8px; border: 2px solid ${C.espresso}; margin-bottom: 32px; }
  .page-img-wrap::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.3) 50%, transparent 65%);
    transform: translateX(-100%);
    pointer-events: none; z-index: 2;
  }
  .page-img-wrap.shimmer::after { transform: translateX(100%); transition: transform 0.8s ease; }
  .page-hero-img { width: 100%; height: 280px; object-fit: cover; display: block; }

  .page-tag { display: inline-block; font-size: 10px; font-weight: 500; padding: 3px 12px; border-radius: 4px; letter-spacing: 0.08em; text-transform: uppercase; border: 1.5px solid; margin-bottom: 14px; }
  .page-title { font-family: 'DM Serif Display', serif; font-size: 40px; color: ${C.espresso}; line-height: 1.15; margin-bottom: 8px; }
  .page-sub { font-size: 14px; color: ${C.mocha}; margin-bottom: 32px; font-weight: 300; border-bottom: 0.5px solid ${C.latte}; padding-bottom: 24px; }
  .page-body { font-size: 16px; color: ${C.espresso}; line-height: 1.8; font-weight: 300; }
  .page-body p { margin-bottom: 18px; }

  /* RECIPE */
  .recipe-intro { background: ${C.foam}; border: 2px solid ${C.espresso}; border-radius: 8px; padding: 20px 24px; margin: 32px 0; }
  .recipe-intro-title { font-family: 'DM Serif Display', serif; font-size: 18px; color: ${C.espresso}; margin-bottom: 12px; }
  .ingredient-list { list-style: none; display: flex; flex-direction: column; gap: 8px; }
  .ingredient-item { display: flex; align-items: center; gap: 10px; font-size: 14px; color: ${C.mocha}; }
  .ing-dot { width: 7px; height: 7px; border-radius: 50%; background: ${C.caramel}; flex-shrink: 0; }
  .steps { display: flex; flex-direction: column; gap: 16px; margin-top: 28px; }
  .step { display: flex; gap: 16px; padding: 16px 20px; background: ${C.cream}; border: 1.5px solid ${C.latte}; border-radius: 8px; border-left: 4px solid ${C.caramel}; }
  .step-num { font-family: 'DM Serif Display', serif; font-size: 24px; color: ${C.caramel}; line-height: 1; min-width: 28px; }
  .step-text { font-size: 14px; color: ${C.espresso}; line-height: 1.65; padding-top: 3px; }

  /* MISC */
  .cursor-glow { pointer-events: none; position: fixed; z-index: 9999; width: 320px; height: 320px; border-radius: 50%; background: radial-gradient(circle, rgba(201,119,58,0.08) 0%, transparent 70%); transform: translate(-50%, -50%); transition: opacity 0.3s; }
  .noise-overlay { position: fixed; inset: 0; pointer-events: none; z-index: 1; opacity: 0.025; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E"); }
  .scroll-progress { position: fixed; top: 56px; left: 0; height: 3px; background: ${C.caramel}; z-index: 99; transform-origin: left; }
  @keyframes ripple { 0% { transform: scale(0); opacity: 0.4; } 100% { transform: scale(2.5); opacity: 0; } }
  .ripple-el { position: absolute; border-radius: 50%; background: ${C.caramel}; pointer-events: none; animation: ripple 0.6s ease-out forwards; }

  /* RESPONSIVE */
  @media (max-width: 768px) {
    .nav { padding: 0 16px; height: auto; min-height: 56px; flex-wrap: wrap; gap: 4px; padding-top: 10px; padding-bottom: 10px; }
    .nav-logo { font-size: 17px; }
    .nav-links { gap: 2px; }
    .nav-link { font-size: 12px; padding: 5px 10px; }
    .hero { height: 280px; }
    .hero-title { font-size: 30px; }
    .hero-sub { font-size: 13px; }
    .hero-overlay { padding: 24px 20px; }
    .section-header { padding: 20px 16px 12px; }
    .section-title { font-size: 18px; }
    .cards-grid { grid-template-columns: 1fr; }
    .card { border-right: none; border-bottom: 1.5px solid ${C.espresso}; }
    .card:last-child { border-bottom: none; }
    .card-img { height: 200px; }
    .img-wrap { height: 200px; }
    .card-body { padding: 16px; }
    .card-title { font-size: 18px; }
    .quote-strip { padding: 24px 20px; }
    .quote-text { font-size: 15px; }
    .footer { padding: 14px 16px; flex-direction: column; gap: 6px; text-align: center; }
    .page-wrap { padding: 28px 16px 60px; }
    .page-title { font-size: 28px; }
    .page-hero-img { height: 200px; }
    .page-body { font-size: 15px; }
    .recipe-intro { padding: 16px; }
    .step { padding: 12px 14px; }
  }
  @media (max-width: 480px) {
    .hero-title { font-size: 24px; }
    .nav-logo { font-size: 15px; }
    .card-img { height: 180px; }
    .img-wrap { height: 180px; }
  }
`;

// ── GSAP helpers ───────────────────────────────────────────────

/** Shimmer sweep on an .img-wrap element */
function useShimmerOnView(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => {
        el.classList.add("shimmer");
        // GSAP extra: subtle brightness flash
        gsap.fromTo(el.querySelector("img, .page-hero-img") || el,
          { filter: "brightness(0.85) saturate(0.7)" },
          { filter: "brightness(1.08) saturate(1.1)", duration: 0.5, ease: "power2.out",
            onComplete: () => gsap.to(el.querySelector("img") || el, { filter: "brightness(1) saturate(1)", duration: 0.4 }) }
        );
      },
    });
    return () => trigger.kill();
  }, []);
}

/** Hover shimmer for card images */
function useHoverShimmer(wrapRef) {
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onEnter = () => {
      gsap.fromTo(el,
        { "--shine-x": "-100%" },
        { "--shine-x": "100%", duration: 0.65, ease: "power2.inOut", overwrite: true }
      );
      el.classList.add("shimmer");
      setTimeout(() => el.classList.remove("shimmer"), 700);
    };
    el.addEventListener("mouseenter", onEnter);
    return () => el.removeEventListener("mouseenter", onEnter);
  }, []);
}

/** Split text into per-word spans and animate in with GSAP */
function GsapText({ text, tag: Tag = "h1", className = "", delay = 0, style = {} }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const words = text.split(" ");
    el.innerHTML = words
      .map(w => `<span class="gsap-word"><span class="gsap-word-inner" style="display:inline-block;transform:translateY(110%);opacity:0">${w}</span></span>`)
      .join(" ");
    const inners = el.querySelectorAll(".gsap-word-inner");
    const rect = el.getBoundingClientRect();
    const alreadyVisible = rect.top < window.innerHeight;
    if (alreadyVisible) {
      gsap.to(inners, { y: "0%", opacity: 1, duration: 0.65, ease: "power3.out", stagger: 0.06, delay });
    } else {
      gsap.to(inners, {
        y: "0%", opacity: 1, duration: 0.65, ease: "power3.out", stagger: 0.06, delay,
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    }
  }, [text, delay]);
  return <Tag ref={ref} className={className} style={style} />;
}

/** Paragraph fade+slide in with GSAP ScrollTrigger */
function GsapPara({ children, delay = 0 }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const alreadyVisible = rect.top < window.innerHeight;
    if (alreadyVisible) {
      gsap.fromTo(el, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay });
    } else {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay,
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      });
    }
  }, [delay]);
  return <p ref={ref} style={{ opacity: 0 }}>{children}</p>;
}

// ── ShimmerImg ─────────────────────────────────────────────────
function ShimmerImg({ src, alt, className, style, onError }) {
  const wrapRef = useRef(null);
  useShimmerOnView(wrapRef);
  useHoverShimmer(wrapRef);
  return (
    <div ref={wrapRef} className="img-wrap" style={style}>
      <img src={src} alt={alt} className={className} onError={onError} />
    </div>
  );
}

// ── ShimmerPageImg ─────────────────────────────────────────────
function ShimmerPageImg({ src, alt }) {
  const wrapRef = useRef(null);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    // entrance shimmer
    setTimeout(() => {
      el.classList.add("shimmer");
      gsap.fromTo(el.querySelector("img"),
        { filter: "brightness(0.8) saturate(0.6)", scale: 1.04 },
        { filter: "brightness(1.05) saturate(1.05)", scale: 1, duration: 0.9, ease: "power2.out",
          onComplete: () => gsap.to(el.querySelector("img"), { filter: "brightness(1) saturate(1)", duration: 0.3 }) }
      );
    }, 300);
  }, []);
  return (
    <div ref={wrapRef} className="page-img-wrap">
      <img src={src} alt={alt} className="page-hero-img" onError={e => { e.target.style.display = "none"; }} />
    </div>
  );
}

// ── Misc ───────────────────────────────────────────────────────
function CursorGlow() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const move = (e) => { el.style.left = e.clientX + "px"; el.style.top = e.clientY + "px"; };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return <div className="cursor-glow" ref={ref} />;
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  return <motion.div className="scroll-progress" style={{ scaleX, width: "100%" }} />;
}

function NavLink({ to, children }) {
  const location = useLocation();
  const active = location.pathname === to;
  const ref = useRef(null);
  const handleClick = (e) => {
    const btn = ref.current;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const r = document.createElement("div");
    r.className = "ripple-el";
    r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px;opacity:0.15;`;
    btn.appendChild(r);
    setTimeout(() => r.remove(), 600);
  };
  return (
    <Link to={to} ref={ref} onClick={handleClick} className={`nav-link${active ? " active" : ""}`} style={{ overflow: "hidden" }}>
      {children}
    </Link>
  );
}

function Nav() {
  return (
    <motion.nav className="nav" initial={{ y: -56, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, ease: ease.out }}>
      <motion.div whileHover={{ scale: 1.04 }} transition={{ type: "spring", stiffness: 400 }}>
        <Link to="/" className="nav-logo">Deutsch Entdecken</Link>
      </motion.div>
      <div className="nav-links">
        <NavLink to="/">Startseite</NavLink>
        <NavLink to="/artikel">Geschichten</NavLink>
        <NavLink to="/rezept">Rezepte</NavLink>
      </div>
    </motion.nav>
  );
}

function Footer() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.footer ref={ref} className="footer" initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
      <span className="footer-logo">Deutsch Entdecken</span>
      <span className="footer-text">Sprache · Kultur · Genuss · 2025</span>
    </motion.footer>
  );
}

const pageVariants = {
  initial: { opacity: 0, y: 24, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit:    { opacity: 0, y: -16, filter: "blur(4px)" },
};
function PageTransition({ children }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.45, ease: ease.out }}>
      {children}
    </motion.div>
  );
}

// ── HOME ───────────────────────────────────────────────────────
function Home() {
  const { scrollY } = useScroll();
  const imgY = useTransform(scrollY, [0, 420], [0, 80]);
  const overlayOpacity = useTransform(scrollY, [0, 300], [1, 0.4]);

  const heroImages = [heroImg1, heroImg2, heroImg3];
  const [activeSlide, setActiveSlide] = useState(0);
  const slideRefs = useRef([]);
  const intervalRef = useRef(null);

  const goToSlide = (next) => {
    const current = slideRefs.current[activeSlide];
    const nextEl = slideRefs.current[next];
    if (!current || !nextEl) return;
    // GSAP crossfade
    gsap.to(current, { opacity: 0, duration: 0.9, ease: "power2.inOut" });
    gsap.fromTo(nextEl, { opacity: 0 }, { opacity: 1, duration: 0.9, ease: "power2.inOut" });
    // shimmer on new slide
    const shine = document.createElement("div");
    shine.style.cssText = `position:absolute;inset:0;background:linear-gradient(105deg,transparent 35%,rgba(255,255,255,0.18) 50%,transparent 65%);pointer-events:none;z-index:3;`;
    nextEl.appendChild(shine);
    gsap.fromTo(shine, { xPercent: -100 }, { xPercent: 100, duration: 0.9, ease: "power2.inOut", onComplete: () => shine.remove() });
    setActiveSlide(next);
  };

  useEffect(() => {
    // init: make first slide visible
    if (slideRefs.current[0]) gsap.set(slideRefs.current[0], { opacity: 1 });
    // entrance shimmer on first slide
    const shine = document.createElement("div");
    shine.style.cssText = `position:absolute;inset:0;background:linear-gradient(105deg,transparent 35%,rgba(255,255,255,0.22) 50%,transparent 65%);pointer-events:none;z-index:3;`;
    slideRefs.current[0]?.appendChild(shine);
    gsap.fromTo(shine, { xPercent: -100 }, { xPercent: 100, duration: 1, delay: 0.5, ease: "power2.inOut", onComplete: () => shine.remove() });

    intervalRef.current = setInterval(() => {
      setActiveSlide(prev => {
        const next = (prev + 1) % heroImages.length;
        const currentEl = slideRefs.current[prev];
        const nextEl = slideRefs.current[next];
        if (currentEl && nextEl) {
          gsap.to(currentEl, { opacity: 0, duration: 0.9, ease: "power2.inOut" });
          gsap.fromTo(nextEl, { opacity: 0 }, { opacity: 1, duration: 0.9, ease: "power2.inOut" });
          const s = document.createElement("div");
          s.style.cssText = `position:absolute;inset:0;background:linear-gradient(105deg,transparent 35%,rgba(255,255,255,0.15) 50%,transparent 65%);pointer-events:none;z-index:3;`;
          nextEl.appendChild(s);
          gsap.fromTo(s, { xPercent: -100 }, { xPercent: 100, duration: 0.9, ease: "power2.inOut", onComplete: () => s.remove() });
        }
        return next;
      });
    }, 4000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const cards = [
    { to: "/artikel", img: jermanImg, alt: "Deutsch lernen", tag: "Geschichte", tagClass: "tag-story", title: "Deutsch entdecken", excerpt: "Am Anfang dachte ich, dass Deutsch ein schwieriges Fach sein würde. Aber es wurde eine einzigartige Erfahrung...", cta: "Weiterlesen →" },
    { to: "/rezept", img: dalgonaImg, alt: "Dalgona coffee", tag: "Rezept", tagClass: "tag-recipe", title: "Choco Dalgona Coffee", excerpt: "Cremiger Kaffeeschaum mit Schokolade — in wenigen Minuten selbst gemacht, mit Ovaltine und Chocolatos-Topping.", cta: "Zum Rezept →" },
  ];

  return (
    <PageTransition>
      {/* HERO SLIDESHOW */}
      <div className="hero">
        <motion.div style={{ y: imgY, scale: 1.12, transformOrigin: "center", height: "100%", width: "100%", position: "absolute", inset: 0 }}>
          {heroImages.map((src, i) => (
            <div
              key={i}
              ref={el => slideRefs.current[i] = el}
              className="hero-slide"
              style={{ opacity: 0 }}
            >
              <img src={src} alt={`Hero ${i + 1}`} onError={e => { e.target.parentNode.style.background = C.bark; }} />
            </div>
          ))}
        </motion.div>

        <motion.div className="hero-overlay" style={{ opacity: overlayOpacity }}>
          <motion.div className="hero-tag" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
            Blog auf Deutsch
          </motion.div>
          <GsapText text="Sprache lernen, Welt entdecken." tag="h1" className="hero-title" delay={0.5} />
          <motion.p className="hero-sub" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.6 }}>
            Geschichten und Rezepte auf Deutsch — für alle, die mehr wollen.
          </motion.p>
        </motion.div>

        {/* DOTS */}
        <div className="hero-dots">
          {heroImages.map((_, i) => (
            <button
              key={i}
              className={`hero-dot${activeSlide === i ? " active" : ""}`}
              onClick={() => { clearInterval(intervalRef.current); goToSlide(i); }}
            />
          ))}
        </div>
      </div>

      {/* SECTION HEADER */}
      <motion.div className="section-header" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
        <GsapText text="Neueste Beiträge" tag="h2" className="section-title" />
        <motion.div className="section-line" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }} />
      </motion.div>

      {/* CARDS */}
      <div className="cards-grid">
        {cards.map((card, i) => (
          <motion.div
            key={card.to}
            style={{ height: "100%" }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: i * 0.12 }}
          >
            <Link to={card.to} className="card">
              <ShimmerImg
                src={card.img}
                alt={card.alt}
                className="card-img"
                onError={e => { e.target.style.background = C.mocha; }}
              />
              <div className="card-body">
                <motion.span className={`card-tag ${card.tagClass}`} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.1 }}>
                  {card.tag}
                </motion.span>
                <GsapText text={card.title} tag="h3" className="card-title" delay={0.1 + i * 0.08} />
                <GsapPara delay={0.2 + i * 0.08}>{card.excerpt}</GsapPara>
                <motion.span className="card-cta" whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 400 }}>
                  {card.cta}
                </motion.span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* QUOTE */}
      <motion.div className="quote-strip" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
        <span className="quote-deco">"</span>
        <GsapText text="Sprache lernen bedeutet, eine neue Seele zu gewinnen." tag="p" className="quote-text" />
        <span className="quote-deco">"</span>
      </motion.div>
    </PageTransition>
  );
}

// ── ARTIKEL ────────────────────────────────────────────────────
function Artikel() {
  const paragraphs = [
    "Am Anfang dachte ich, dass Deutsch ein schwieriges und langweiliges Fach sein würde, weil viele Wörter für mich fremd klangen. Aber nachdem ich Deutsch gelernt habe, wurde es zu einer einzigartigen und interessanten Erfahrung.",
    "Jedes Mal, wenn ich Deutsch lerne, habe ich das Gefühl, eine neue Welt zu entdecken. Ich lerne neue Wörter, eine andere Aussprache und interessante Aspekte der deutschen Kultur kennen. Es macht Spaß, wenn ich endlich die Bedeutung eines Satzes verstehe oder neue Vokabeln beherrschen kann, die vorher schwierig erschienen.",
    "Trotzdem gibt es einen Teil, der mich oft herausfordert, nämlich das Hörverstehen. Wenn ich deutsche Gespräche oder Audios höre, sprechen die Menschen manchmal so schnell, dass ich nicht alles verstehen kann. Gerade habe ich ein Wort verstanden, da kommen schon viele weitere Wörter. Obwohl das manchmal schwierig ist, motiviert es mich, mehr zu üben und meine Fähigkeiten zu verbessern.",
    "Für mich bedeutet Deutschlernen nicht nur, Wörter und Grammatik auswendig zu lernen. Es bedeutet auch, neue Dinge auszuprobieren und nicht aufzugeben, wenn man auf Schwierigkeiten stößt. Insgesamt habe ich einen sehr positiven Eindruck vom Deutschunterricht.",
    "Ich freue mich, Deutsch gelernt zu haben, und hoffe, die Sprache in Zukunft noch fließender sprechen zu können.",
  ];

  return (
    <PageTransition>
      <div className="page-wrap">
        <motion.div whileHover={{ x: -4 }} transition={{ type: "spring", stiffness: 400 }}>
          <Link to="/" className="page-back">← Zurück zur Startseite</Link>
        </motion.div>

        <ShimmerPageImg
          src={jermanImg}
          alt="Deutsch lernen"
        />

        <motion.span className="page-tag tag-story" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>Geschichte</motion.span>
        <GsapText text="Deutsch entdecken" tag="h1" className="page-title" delay={0.35} style={{ marginTop: 8 }} />
        <motion.p className="page-sub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
          Eine persönliche Reise durch die deutsche Sprache und Kultur.
        </motion.p>

        <div className="page-body">
          {paragraphs.map((p, i) => (
            <GsapPara key={i} delay={i * 0.07}>{p}</GsapPara>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}

// ── REZEPT ─────────────────────────────────────────────────────
function Rezept() {
  const steps = [
    "Instantkaffee, Zucker und heißes Wasser in eine Schüssel geben.",
    "Die Mischung mit einem Mixer oder Schneebesen schlagen, bis ein cremiger und fester Kaffeeschaum entsteht.",
    "Das Schokoladenpulver mit 10 Esslöffeln heißem Wasser in zwei Gläsern mischen.",
    "Eiswürfel in die Gläser geben und mit UHT-Milch auffüllen.",
    "Den Dalgona-Kaffeeschaum vorsichtig auf die Milch verteilen.",
    "Mit Chocolatos als Topping dekorieren und servieren.",
  ];
  const ingredients1 = ["4 g Instantkaffee (z. B. Nescafé)", "4 Teelöffel Zucker", "4 Esslöffel heißes Wasser"];
  const ingredients2 = ["2 Beutel Schokoladengetränkepulver (Ovaltine)", "10 Esslöffel heißes Wasser", "200 ml UHT-Milch", "Eiswürfel", "2 Beutel Chocolatos (Topping)"];

  return (
    <PageTransition>
      <div className="page-wrap">
        <motion.div whileHover={{ x: -4 }} transition={{ type: "spring", stiffness: 400 }}>
          <Link to="/" className="page-back">← Zurück zur Startseite</Link>
        </motion.div>

        <ShimmerPageImg
          src={dalgonaImg}
          alt="Choco Dalgona Coffee"
        />

        <motion.span className="page-tag tag-recipe" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>Rezept</motion.span>
        <GsapText text="Choco Dalgona Coffee" tag="h1" className="page-title" delay={0.35} style={{ marginTop: 8 }} />
        <motion.p className="page-sub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
          Cremiger Kaffeeschaum mit Schokolade — für 2 Gläser, in etwa 10 Minuten.
        </motion.p>

        <motion.div className="recipe-intro" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <p className="recipe-intro-title">Zutaten</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" }}>
            {[{ label: "Kaffeeschaum", items: ingredients1 }, { label: "Schoko-Basis", items: ingredients2 }].map((group, gi) => (
              <div key={group.label}>
                <p style={{ fontSize: 11, fontWeight: 500, color: C.caramel, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>{group.label}</p>
                <ul className="ingredient-list">
                  {group.items.map((item, ii) => (
                    <motion.li key={item} className="ingredient-item" initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: gi * 0.1 + ii * 0.06 }}>
                      <span className="ing-dot" />{item}
                    </motion.li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>

        <GsapText text="Zubereitung" tag="h2" style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: C.espresso, marginBottom: 4 }} />

        <div className="steps">
          {steps.map((s, i) => (
            <motion.div
              key={i} className="step"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ delay: i * 0.07, duration: 0.45 }}
              whileHover={{ x: 6, boxShadow: `4px 4px 0px ${C.caramel}`, transition: { duration: 0.2 } }}
            >
              <span className="step-num">{i + 1}</span>
              <p className="step-text">{s}</p>
            </motion.div>
          ))}
        </div>

        <motion.p
          style={{ marginTop: 40, fontFamily: "'DM Serif Display', serif", fontSize: 20, color: C.caramel, textAlign: "center" }}
          initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
        >
          Guten Appetit und viel Spaß beim Genießen! ☕
        </motion.p>
      </div>
    </PageTransition>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/artikel" element={<Artikel />} />
        <Route path="/rezept" element={<Rezept />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  useEffect(() => {
    // Set page title
    document.title = "Deutsch";

    // Set favicon dari local image
    const link = document.querySelector("link[rel~='icon']") || document.createElement("link");
    link.rel = "icon";
    link.type = "image/jpeg";
    link.href = deutschIcon;
    document.head.appendChild(link);
  }, []);
  return (
    <Router>
      <style>{styles}</style>
      <div className="noise-overlay" />
      <CursorGlow />
      <ScrollProgress />
      <div className="site-wrap">
        <Nav />
        <AnimatedRoutes />
        <Footer />
      </div>
    </Router>
  );
}