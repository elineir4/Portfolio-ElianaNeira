import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import WebGLBackground from "./components/WebGLBackground";
import SplitText from "./components/SplitText";
import ProjectCarousel from "./components/ProjectCarousel";
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

// ─── Icon ────────────────────────────────────────────────────────────────────
function Icon({
  name,
  fill = 0,
  size = "24px",
  className = "",
}: {
  name: string;
  fill?: 0 | 1;
  size?: string;
  className?: string;
}) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{ fontSize: size, fontVariationSettings: `'FILL' ${fill}` }}
    >
      {name}
    </span>
  );
}

// ─── Cursor ──────────────────────────────────────────────────────────────────
function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const outlineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.innerWidth <= 768) return;

    const onMove = (e: MouseEvent) => {
      const x = e.clientX, y = e.clientY;
      if (dotRef.current) { dotRef.current.style.left = `${x}px`; dotRef.current.style.top = `${y}px`; }
      outlineRef.current?.animate({ left: `${x}px`, top: `${y}px` }, { duration: 120, fill: "forwards" });
    };
    window.addEventListener("mousemove", onMove);

    const enter = () => { dotRef.current?.classList.add("hovered"); outlineRef.current?.classList.add("hovered"); };
    const leave = () => { dotRef.current?.classList.remove("hovered"); outlineRef.current?.classList.remove("hovered"); };
    const targets = document.querySelectorAll("a, button, .hover-target");
    targets.forEach(el => { el.addEventListener("mouseenter", enter); el.addEventListener("mouseleave", leave); });

    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot hidden md:block" />
      <div ref={outlineRef} className="cursor-outline hidden md:block" />
    </>
  );
}

// ─── Nav ─────────────────────────────────────────────────────────────────────
function Nav() {
  const { language, toggleLanguage, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setActive(id);
    setMobileOpen(false);
  };

  const links = [
    { id: "home", label: t.nav.home },
    { id: "projects", label: t.nav.projects },
    { id: "education", label: t.nav.education },
    { id: "tools", label: t.nav.tools },
    { id: "contact", label: t.nav.contact },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 border-b border-white/5 ${
        scrolled ? "bg-obsidian/95 backdrop-blur-xl py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <button
          onClick={() => scrollTo("home")}
          className="font-sub-hero text-2xl font-bold tracking-tighter text-white hover:text-crimson transition-colors hover-target"
        >
          ELIANA
        </button>

        <nav className="hidden md:flex gap-8 items-center">
          {links.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`font-label-sm text-xs tracking-widest uppercase hover-target transition-all duration-300 ${
                active === id
                  ? "text-crimson border-b border-crimson pb-1"
                  : "text-on-surface-variant hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={() => scrollTo("contact")}
            className="hidden md:inline-flex items-center gap-2 border border-crimson text-crimson font-label-sm text-xs px-6 py-3 hover:bg-crimson hover:text-white transition-all duration-300 uppercase tracking-widest hover-target group"
          >
            {t.nav.talk}
          </button>
          <button
            type="button"
            onClick={toggleLanguage}
            aria-label={language === "es" ? "Switch to English" : "Cambiar a español"}
            className="font-label-sm text-xs tracking-widest text-white hover:text-crimson transition-colors hover-target"
          >
            {language === "es" ? "EN" : "ES"}
          </button>
          <button
            className="md:hidden text-white hover:text-crimson transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <Icon name={mobileOpen ? "close" : "menu"} />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-obsidian/98 border-t border-white/5 px-margin-mobile py-8 flex flex-col gap-6">
          {links.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="font-sub-hero text-xl font-bold text-left text-on-surface-variant hover:text-crimson transition-colors"
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

// ─── Marquee ─────────────────────────────────────────────────────────────────
function Marquee() {
  const { t } = useLanguage();
  const items = t.marquee;
  const row = [...items, ...items, ...items];
  return (
    <div className="marquee-container overflow-hidden">
      {[0, 1].map((i) => (
        <div key={i} className="marquee-content" aria-hidden={i === 1}>
          {row.map((item, j) => (
            <span key={j}>
              {item}
              {j < row.length - 1 && <span className="sep">✦</span>}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const { t } = useLanguage();

  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] items-center justify-center overflow-x-clip px-0 pb-16 pt-24"
    >
      <div className="relative z-10 flex min-h-[720px] w-full flex-col items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_center,_#151515_0%,_#0a0a0a_65%)] text-center lg:block lg:h-[calc(100svh-6rem)] lg:min-h-[640px]">
        <div className="absolute top-7 left-5 right-5 lg:top-8 lg:left-20 lg:right-20 flex flex-col items-center gap-3 text-center lg:flex-row lg:items-start lg:justify-between lg:text-left font-label-sm text-[9px] tracking-[0.2em] text-white/80 uppercase">
          <div className="flex flex-col items-center gap-1 text-center lg:items-start lg:text-left">
            <span>{t.hero.role}</span>
            <span className="text-white/60">{t.hero.digital}</span>
          </div>
          <span className="flex max-w-full items-center justify-center gap-2 border border-crimson/30 bg-crimson/10 px-3 py-2 text-center lg:max-w-none lg:self-auto lg:justify-end lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:text-right">
            {t.hero.availability}
            <span className="text-crimson text-lg leading-none">+</span>
          </span>
        </div>

        {/* Giant BG word */}
        <h1
          className="hidden lg:block font-hero leading-none text-crimson/20 uppercase absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[94%] text-center whitespace-nowrap z-0 select-none pointer-events-none"
          style={{ fontSize: "clamp(6rem, 16vw, 16rem)", WebkitTextStroke: "1px rgba(139,26,43,0.2)" }}
        >
          PORTAFOLIO
        </h1>

        {/* Portrait */}
        {/* Text block */}
        <div className="relative z-20 mt-24 px-5 sm:px-7 lg:absolute lg:left-20 lg:bottom-0 lg:-translate-y-3 lg:mt-0 lg:px-0 flex flex-col items-center lg:items-start gap-1 text-center lg:text-left w-full lg:w-[36%]">
          <div className="w-full overflow-hidden">
            <SplitText
              text={t.hero.greeting}
              as="h2"
              className="font-sub-hero text-2xl lg:text-3xl font-semibold italic text-crimson tracking-tight block text-center lg:text-left"
              delay={0.1}
              stagger={0.03}
            />
          </div>
          <div className="w-full overflow-hidden">
            <SplitText
              text="ELIANA"
              as="h3"
              className="font-hero text-4xl sm:text-5xl lg:text-7xl xl:text-8xl leading-[0.8] font-bold text-white/85 tracking-tight block text-center lg:text-left whitespace-nowrap"
              delay={0.5}
              stagger={0.015}
            />
          </div>
          <div className="w-full overflow-hidden">
            <SplitText
              text={t.hero.role}
              as="h3"
              className="font-hero text-2xl sm:text-3xl lg:text-5xl xl:text-6xl leading-[0.9] font-bold text-white/80 tracking-tight block text-center lg:text-left whitespace-normal"
              delay={0.5}
              stagger={0.015}
            />
          </div>
          <div className="hero-loc mt-2 flex items-center justify-center lg:justify-start gap-2 font-label-sm text-[9px] text-white/60 uppercase tracking-widest opacity-0">
            <Icon name="location_on" fill={1} size="14px" className="text-crimson" />
            {t.hero.location}
          </div>
        </div>

        {/* Mobile portrait */}
        <div className="hidden lg:block relative z-10 mt-7 h-56 w-44 lg:absolute lg:left-1/2 lg:bottom-0 lg:mt-0 lg:h-[min(78vh,42rem)] lg:w-[min(36vw,33rem)] lg:-translate-x-1/2">
          <img
            src="/images/eliana.png"
            alt="Retrato de Eliana"
            className="hero-image h-full object-top drop-shadow-2xl grayscale"
            style={{ filter: "contrast(1.05) brightness(0.92)" }}
          />
        </div>

        <aside className="relative z-20 mt-10 lg:absolute lg:right-20 lg:bottom-1 lg:mt-0 w-full lg:w-52 text-left px-7 lg:px-0">
          <div className="space-y-4 border-l border-white/10 pl-5">
            {t.hero.features.map((feature) => (
              <div key={feature} className="flex items-start gap-3">
                <span className="font-label-sm text-crimson text-base leading-none">+</span>
                <span className="font-body-md text-xs leading-relaxed text-white/70">{feature}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30 scroll-bounce">
        <span className="font-label-sm text-[10px] tracking-[0.3em] uppercase">{t.hero.scroll}</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white/60 to-transparent" />
      </div>
    </section>
  );
}

// ─── Projects ─────────────────────────────────────────────────────────────────
const PROJECTS = [
  {
    id: "01",
    img: "/images/proyecto-2.png",
    github: "https://github.com/elineir4/Rotiseria-Don-Spiedo",
    website: "https://rotiseria-don-spiedo.vercel.app/",
  },
  {
    id: "02",
    img: "/images/proyecto-1.png",
    github: "https://github.com/elineir4/Scotch-Road",
    website: "https://scotchroad.vercel.app/",
  },
  {
    id: "03",
    img: "/images/mundo-ruta.png",
    github: "https://github.com/juampimedina06/mundo-ruta",
    website: undefined,
  },
  {
    id: "04",
    img: "/images/whatsapp.jpeg",
    github: "https://github.com/elineir4/AN-Instalaciones",
    website: undefined,
  },
  {
    id: "05",
    img: "/images/delicias-loli.png",
    github: "https://github.com/elineir4/deliciasLoli",
    website: "https://delicias-loli.vercel.app/",
  },
  {
    id: "06",
    img: "/images/lopez-dojo.png",
    github: "https://github.com/elineir4/lopez-dojo",
    website: "https://lopez-dojo.vercel.app/",
  },
];

function Projects() {
  const { t } = useLanguage();

  return (
    <section
      id="projects"
      className="w-full max-w-container-max mx-auto py-stack-md md:py-stack-lg px-margin-mobile md:px-margin-desktop"
    >
      <div className="mb-14 flex justify-center overflow-hidden border-b border-white/5 pb-8 text-center">
        <div>
          <p className="font-label-sm text-xs text-crimson tracking-[0.3em] uppercase mb-4">{t.projects.eyebrow}</p>
          <h2 className="font-sub-hero text-5xl md:text-7xl font-bold text-white uppercase leading-[0.9]">
            {t.projects.headingFirst}<br />
            <span className="text-crimson">{t.projects.headingSecond}</span>
          </h2>
        </div>
      </div>

      <ProjectCarousel
        projects={PROJECTS}
        descriptions={t.projects.items}
        actions={t.projects.actions}
        controls={t.projects.carouselControls}
        label={t.projects.carouselLabel}
        imagePlaceholder={t.projects.imagePlaceholder}
      />
    </section>
  );
}

// ─── Education ────────────────────────────────────────────────────────────────
function EducationSection() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedStudy, setSelectedStudy] = useState<number | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    gsap.fromTo(
      el.querySelectorAll(".section-title"),
      { y: 80, opacity: 0, scale: 0.92 },
      {
        y: 0, opacity: 1, scale: 1, duration: 1, ease: "power4.out",
        scrollTrigger: { trigger: el, start: "top 80%" },
      }
    );
  }, []);

  return (
    <section
      id="education"
      ref={sectionRef}
      className="w-full py-stack-md md:py-stack-lg px-margin-mobile md:px-margin-desktop bg-surface-container-lowest/70 border-y border-white/5 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-crimson/4 rounded-full blur-3xl pointer-events-none translate-x-1/2 -translate-y-1/2" />

      <div className="relative z-10 mx-auto w-full max-w-4xl">
        <div className="mb-12 text-center md:mb-16">
          <p className="section-title font-label-sm text-[10px] text-crimson tracking-[0.3em] uppercase mb-4">{t.education.eyebrow}</p>
          <h2 className="section-title font-sub-hero text-4xl md:text-6xl font-bold text-white uppercase mb-12">
            {t.education.headingFirst}<br /><span className="text-white/35">{t.education.headingSecond}</span>
          </h2>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          {t.education.items.map((item, i) => (
            <button
              key={item.title}
              type="button"
              aria-expanded={selectedStudy === i}
              aria-controls="education-description"
              onClick={() => setSelectedStudy(selectedStudy === i ? null : i)}
              className={`group relative overflow-hidden border text-left transition duration-300 ${
                selectedStudy === i ? "border-crimson" : "border-white/10 hover:border-crimson/60"
              }`}
            >
              <img
                src={item.image}
                alt={item.imageAlt}
                className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-transparent" />
              <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 sm:p-6">
                <span>
                  <span className="mb-2 block font-label-sm text-[10px] uppercase tracking-[0.25em] text-crimson">
                    {item.year || t.education.inProgress}
                  </span>
                  <span className="block font-sub-hero text-xl font-bold text-white sm:text-2xl">{item.title}</span>
                </span>
                <Icon
                  name={selectedStudy === i ? "close" : "add"}
                  size="22px"
                  className="mb-1 shrink-0 text-white transition-transform duration-300 group-hover:rotate-90"
                />
              </span>
            </button>
          ))}
        </div>
        {selectedStudy !== null && (
          <div
            id="education-description"
            role="status"
            className="mt-5 border border-white/10 bg-white/[0.02] p-5 sm:p-7"
          >
            <div className="mb-3 flex items-center gap-3">
              <Icon name={t.education.items[selectedStudy].icon} size="20px" className="text-crimson" />
              <h3 className="font-sub-hero text-lg font-bold text-white">
                {t.education.items[selectedStudy].title}
              </h3>
            </div>
            <p className="font-body-md text-sm leading-relaxed text-white/60">
              {t.education.items[selectedStudy].detail}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

const TOOLS = [
  { label: "React", icon: "hub" },
  { label: "C#", icon: "terminal" },
  { label: ".NET", icon: "settings" },
  { label: "Git", icon: "account_tree" },
  { label: "GitHub", icon: "code" },
  { label: "Jira", icon: "view_kanban" },
  { label: "Trello", icon: "dashboard" },
  { label: "HTML", icon: "code" },
  { label: "CSS", icon: "palette" },
  { label: "JavaScript", icon: "data_object" },
  { label: "SQL Server", icon: "database" },
];

function Tools() {
  const { t } = useLanguage();

  return (
    <section
      id="tools"
      className="tools-section relative w-full overflow-hidden border-y border-white/5 bg-surface-container-lowest/70 py-stack-md md:py-stack-lg"
      aria-labelledby="tools-heading"
    >
      <div className="pointer-events-none absolute inset-0 opacity-30 tools-grid-texture" />
      <div className="relative z-10 mx-auto w-full max-w-container-max px-margin-mobile md:px-margin-desktop">
        <div className="mb-10 flex items-end justify-between gap-6 border-b border-white/10 pb-6 md:mb-12">
          <div>
            <p className="mb-3 font-label-sm text-[10px] uppercase tracking-[0.3em] text-crimson">{t.skills.toolsEyebrow}</p>
            <h2 id="tools-heading" className="font-hero text-5xl uppercase leading-none text-white sm:text-6xl md:text-7xl">
              SKILLS
            </h2>
          </div>
          <span className="hidden pb-1 font-label-sm text-[10px] uppercase tracking-[0.2em] text-white/35 sm:block">
            {String(TOOLS.length).padStart(2, "0")} {t.skills.toolCountLabel}
          </span>
        </div>

        <div className="skills-marquee" aria-label={t.skills.toolCountLabel}>
          <div className="skills-marquee-track">
            {[0, 1].map((copy) => (
              <ul key={copy} className="skills-marquee-list" aria-hidden={copy === 1}>
                {TOOLS.map(({ label, icon }) => (
                  <li
                    key={label}
                    className="tool-card group relative z-0 flex flex-col items-center justify-center gap-3 border border-white/15 bg-white/[0.02] px-3 py-4 text-center transition duration-300 hover:z-10 hover:scale-110 hover:border-crimson/70 hover:bg-crimson/[0.06]"
                  >
                    <Icon
                      name={icon}
                      size="32px"
                      className="text-white/75 transition-colors duration-300 group-hover:text-crimson"
                    />
                    <span className="font-label-sm text-[10px] uppercase tracking-[0.12em] text-white/70 transition-colors duration-300 group-hover:text-white">
                      {label}
                    </span>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────
function Contact() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.fromTo(
      sectionRef.current?.querySelectorAll(".contact-reveal") ?? [],
      { y: 100, opacity: 0, scale: 0.94 },
      {
        y: 0, opacity: 1, scale: 1, duration: 1.1, stagger: 0.14, ease: "power4.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      }
    );
  }, []);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setError("");

    try {
      const response = await fetch("https://formsubmit.co/ajax/14b6052248858ad54d361a0b9c45d406", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(e.currentTarget),
      });

      if (!response.ok) throw new Error(t.contact.sendError);

      setSent(true);
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setSent(false), 3500);
    } catch {
      setError(t.contact.error);
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="w-full max-w-container-max mx-auto py-stack-lg px-margin-mobile md:px-margin-desktop"
    >
      <div className="mb-12 border-b border-white/10 pb-8">
        <p className="contact-reveal mb-4 font-label-sm text-[10px] uppercase tracking-[0.3em] text-crimson">{t.contact.eyebrow}</p>
        <h2 className="contact-reveal max-w-3xl font-sub-hero text-4xl font-bold uppercase leading-[1.02] tracking-tight text-white sm:text-5xl md:text-6xl">
          {t.contact.heading[0]} {t.contact.heading[1]}{" "}
          <span className="text-crimson">{t.contact.heading[2]}</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
        <div className="flex flex-col">
          <p className="contact-reveal mb-8 max-w-lg font-body-md text-base leading-relaxed text-white/60 md:text-lg">
            {t.contact.description}
          </p>

          <div className="contact-reveal mb-8 flex w-fit items-center gap-4 border border-white/10 bg-white/[0.03] px-5 py-4">
            <div className="relative h-3 w-3 shrink-0">
              <div className="h-3 w-3 rounded-full bg-crimson" />
              <div className="absolute inset-0 h-3 w-3 animate-ping rounded-full bg-crimson/50" />
            </div>
            <div>
              <span className="block font-label-sm text-[10px] uppercase tracking-widest text-white/45">{t.contact.statusLabel}</span>
              <span className="font-sub-hero text-sm font-bold text-white">{t.contact.status}</span>
            </div>
          </div>

          <div className="contact-reveal divide-y divide-white/10 border-y border-white/10">
            <a
              href="https://github.com/elineir4"
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-4 py-4 hover-target"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/10 text-crimson transition-colors group-hover:border-crimson">
                <Icon name="code" size="17px" />
              </span>
              <span className="min-w-0">
                <span className="block font-label-sm text-[9px] uppercase tracking-[0.18em] text-white/40">GitHub</span>
                <span className="font-body-md text-sm text-white/80 transition-colors group-hover:text-white">github.com/elineir4</span>
              </span>
            </a>
            <a
              href="https://www.linkedin.com/in/eliana-neira-898099240/"
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-4 py-4 hover-target"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/10 text-crimson transition-colors group-hover:border-crimson">
                <Icon name="link" size="17px" />
              </span>
              <span className="min-w-0">
                <span className="block font-label-sm text-[9px] uppercase tracking-[0.18em] text-white/40">LinkedIn</span>
                <span className="font-body-md text-sm text-white/80 transition-colors group-hover:text-white">Eliana Neira</span>
              </span>
            </a>
          </div>
        </div>

        <div className="contact-reveal relative overflow-hidden border border-white/10 bg-[#101010] p-5 sm:p-7 md:p-9">
          <div className="absolute right-0 top-0 h-20 w-20 border-r border-t border-crimson/40" />
          {sent ? (
            <div className="flex min-h-80 flex-col items-center justify-center gap-4">
              <Icon name="check_circle" fill={1} size="48px" className="text-crimson" />
              <p className="font-sub-hero text-xl font-bold text-white">{t.contact.success}</p>
              <p className="font-body-md text-white/60 text-sm text-center">
                {t.contact.successDetail}
              </p>
            </div>
          ) : (
            <form id="contactForm" onSubmit={submit} className="relative space-y-6">
              <div className="mb-2">
                <span className="mb-2 block font-label-sm text-[9px] uppercase tracking-[0.22em] text-crimson">{t.contact.eyebrow}</span>
                <p className="font-sub-hero text-lg font-semibold text-white">{t.contact.formHeading}</p>
              </div>
              <input type="hidden" name="_subject" value={t.contact.subject} />
              <input type="hidden" name="_template" value="table" />
              <input type="hidden" name="_captcha" value="false" />
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="flex flex-col">
                  <label htmlFor="contact-name" className="mb-2 font-label-sm text-[10px] uppercase tracking-[0.15em] text-white/55">{t.contact.name}</label>
                  <input
                    id="contact-name"
                    className="input-underline"
                    type="text"
                    name="name"
                    autoComplete="name"
                    placeholder={t.contact.namePlaceholder}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="contact-email" className="mb-2 font-label-sm text-[10px] uppercase tracking-[0.15em] text-white/55">{t.contact.email}</label>
                  <input
                    id="contact-email"
                    className="input-underline"
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder={t.contact.emailPlaceholder}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <label htmlFor="contact-message" className="mb-2 font-label-sm text-[10px] uppercase tracking-[0.15em] text-white/55">{t.contact.message}</label>
                <textarea
                  id="contact-message"
                  className="input-underline resize-none"
                  name="message"
                  placeholder={t.contact.messagePlaceholder}
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="glow-hover hover-target mt-1 flex w-full items-center justify-center gap-3 bg-crimson px-6 py-4 font-sub-hero font-bold uppercase tracking-widest text-white transition-all duration-300 hover:bg-white hover:text-obsidian disabled:cursor-wait disabled:opacity-60"
              >
                {sending ? t.contact.sending : t.contact.submit}
                <Icon name={sending ? "hourglass_empty" : "send"} size="16px" />
              </button>
              {error && <p className="font-body-md text-sm text-error text-center" role="alert">{error}</p>}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="w-full py-12 bg-obsidian border-t border-white/5">
      <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="font-hero text-2xl text-crimson tracking-widest">ELIANA</div>
      </div>
    </footer>
  );
}

// ─── GSAP Hero entrance ───────────────────────────────────────────────────────
function useHeroEntrance() {
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.1 });
    tl.fromTo(".hero-sub", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, 0.9)
      .fromTo(".hero-loc", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, 1.1)
      .fromTo(".hero-cta", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, 1.25);
  }, []);
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  useHeroEntrance();

  return (
    <LanguageProvider>
      <div className="bg-obsidian text-on-surface min-h-full">
        <WebGLBackground />
        <Cursor />
        <Nav />
        <main>
          <Hero />
          <Projects />
          <EducationSection />
          <Tools />
          <Contact />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}
