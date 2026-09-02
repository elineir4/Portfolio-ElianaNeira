import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import WebGLBackground from "./components/WebGLBackground";
import SplitText from "./components/SplitText";

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
    { id: "home", label: "Home" },
    { id: "projects", label: "Proyectos" },
    { id: "skills", label: "Tecnologías" },
    { id: "contact", label: "Contacto" },
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
            Hablemos
            <Icon name="arrow_forward" size="14px" className="group-hover:translate-x-1 transition-transform" />
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
  const items = ["PROYECTOS DESTACADOS", "DESARROLLO WEB", "CÓDIGO CON PROPÓSITO", "SOLUCIONES DIGITALES", "DESARROLLADORA"];
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
  const portraitRef = useRef<HTMLDivElement>(null);
  const bgTextRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // 3D portrait tilt via cursor
    const portrait = portraitRef.current;
    if (!portrait) return;

    const onMove = (e: MouseEvent) => {
      const rect = portrait.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (window.innerWidth / 2);
      const dy = (e.clientY - cy) / (window.innerHeight / 2);
      gsap.to(portrait, {
        rotateY: dx * 14,
        rotateX: -dy * 10,
        duration: 0.6,
        ease: "power2.out",
        transformPerspective: 900,
        transformOrigin: "center center",
      });
    };
    const onLeave = () => {
      gsap.to(portrait, { rotateY: 0, rotateX: 0, duration: 1, ease: "elastic.out(1, 0.5)" });
    };
    window.addEventListener("mousemove", onMove);
    portrait.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      portrait.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <section
      id="home"
      className="relative flex items-center justify-center overflow-x-clip pt-28 pb-16 px-5 md:px-12 lg:px-16"
    >
      <div className="relative z-10 w-full max-w-container-max mx-auto min-h-[690px] lg:h-[580px] overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-[#151515] via-[#0e0e0e] to-[#080808] shadow-2xl flex flex-col items-center justify-center text-center lg:block">
        <div className="absolute top-7 left-7 right-7 lg:top-8 lg:left-10 lg:right-10 flex items-start justify-between font-label-sm text-[9px] tracking-[0.2em] text-white/80 uppercase">
          <div className="flex flex-col gap-1 text-left">
            <span>DESARROLLADORA FULL STACK</span>
            <span className="text-white/40">DESARROLLADORA DIGITAL</span>
          </div>
          <span className="flex items-center gap-2">
            DISPONIBLE PARA PROYECTOS Y OPORTUNIDADES
            <span className="text-crimson text-lg leading-none">+</span>
          </span>
        </div>

        {/* Giant BG word */}
        <h1
          ref={bgTextRef}
          className="hidden lg:block font-hero leading-none text-crimson/20 uppercase absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[94%] text-center whitespace-nowrap z-0 select-none pointer-events-none"
          style={{ fontSize: "clamp(6rem, 16vw, 16rem)", WebkitTextStroke: "1px rgba(139,26,43,0.2)" }}
        >
          PORTAFOLIO
        </h1>

        {/* Portrait */}
        <div
          ref={portraitRef}
          className="hidden lg:block relative z-10 w-64 h-[380px] mt-16 lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:bottom-0 lg:w-[min(36vw,33rem)] lg:h-[560px] lg:mt-0"
          style={{ willChange: "transform" }}
        >
          <img
            src="/images/eliana.png"
            alt="Retrato de Eliana"
            className="hero-image h-full object-top drop-shadow-2xl grayscale"
            style={{
              filter: "contrast(1.05) brightness(0.92)",
            }}
          />
        </div>

        {/* Text block */}
        <div className="relative z-20 mt-8 px-7 lg:absolute lg:left-10 lg:bottom-0 lg:-translate-y-3 lg:mt-0 lg:px-0 flex flex-col items-center lg:items-start gap-1 text-center lg:text-left w-full lg:w-[36%]">
          <div className="w-full overflow-hidden">
            <SplitText
              text="Hola, soy"
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
              className="font-hero text-5xl lg:text-7xl xl:text-8xl leading-[0.8] font-bold text-white tracking-tight block text-center lg:text-left whitespace-nowrap"
              delay={0.5}
              stagger={0.015}
            />
          </div>
          <div className="w-full overflow-hidden">
            <SplitText
              text="DESARROLLADORA FULL STACK"
              as="h3"
              className="font-hero text-3xl lg:text-5xl xl:text-6xl leading-[0.9] font-bold text-white tracking-tight block text-center lg:text-left whitespace-normal"
              delay={0.5}
              stagger={0.015}
            />
          </div>
          <div className="hero-loc mt-2 flex items-center justify-center lg:justify-start gap-2 font-label-sm text-[9px] text-white/40 uppercase tracking-widest opacity-0">
            <Icon name="location_on" fill={1} size="14px" className="text-crimson" />
            DESARROLLADORA EN ARGENTINA
          </div>
        </div>

        <aside className="relative z-20 mt-10 lg:absolute lg:right-10 lg:bottom-1 lg:mt-0 w-full lg:w-52 text-left px-7 lg:px-0">
          <div className="space-y-4 border-l border-white/10 pl-5">
            {[
              "Transformo ideas en experiencias digitales",
              "Soluciones centradas en las personas",
              "Interfaces claras y funcionales",
              "Diseño adaptable a cada dispositivo",
            ].map((feature) => (
              <div key={feature} className="flex items-start gap-3">
                <span className="font-label-sm text-crimson text-base leading-none">+</span>
                <span className="font-body-md text-xs leading-relaxed text-white/55">{feature}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30 scroll-bounce">
        <span className="font-label-sm text-[10px] tracking-[0.3em] uppercase">Desplazar</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white/60 to-transparent" />
      </div>
    </section>
  );
}

// ─── Projects ─────────────────────────────────────────────────────────────────
const PROJECTS = [
  {
    id: "01", title: "DON SPIEDO", category: "Sitio web para rotisería", span: "lg:col-span-8",
    img: "/images/Screenshot 2026-09-02 111111.png",
    github: "https://github.com/elineir4/Rotiseria-Don-Spiedo",
    tags: ["HTML", "CSS", "JavaScript"], heroH: "h-64 md:h-[420px]",
  },
  {
    id: "02", title: "TIENDA DE ROPA", category: "E-commerce web", span: "lg:col-span-4",
    img: "/images/Screenshot 2026-09-02 111016.png",
    github: "https://github.com/elineir4/Scotch-Road",
    tags: ["HTML", "CSS", "JavaScript"], heroH: "h-64 md:h-[420px]",
  },
  {
    id: "03", title: "MUNDO RUTA", category: "Proyecto grupal en C#", span: "lg:col-span-5",
    img: "/images/108c984febcd771d13f4774865e8940a.jpg",
    github: "https://github.com/juampimedina06/mundo-ruta",
    tags: ["C#", ".NET", "Trabajo grupal"], heroH: "h-64 md:h-80",
  },
  {
    id: "04", title: "AN INSTALACIONES", category: "Proyecto personal en C#", span: "lg:col-span-7",
    img: "/images/WhatsApp Image 2026-08-31 at 22.24.03.jpeg",
    github: "https://github.com/elineir4/AN-Instalaciones",
    tags: ["C#", ".NET", "Aplicación web"], heroH: "h-64 md:h-80",
  },
];

function ProjectCard({ p, i }: { p: (typeof PROJECTS)[0]; i: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current!.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    gsap.to(cardRef.current, {
      rotateY: x * 6,
      rotateX: -y * 4,
      duration: 0.4,
      ease: "power2.out",
      transformPerspective: 1000,
    });
  };
  const onLeave = () => {
    gsap.to(cardRef.current, { rotateY: 0, rotateX: 0, duration: 0.8, ease: "elastic.out(1, 0.6)" });
  };

  return (
    <a
      ref={cardRef}
      href={p.github}
      target="_blank"
      rel="noreferrer"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`project-card ${p.span} group hover-target relative overflow-hidden glass-panel cursor-none`}
      style={{ willChange: "transform" }}
    >
      {/* Image */}
      <div className={`${p.heroH} w-full relative overflow-hidden bg-surface-container`}>
        <div
          className="absolute inset-0 bg-cover bg-center w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-[1.04]"
          style={{ backgroundImage: `url('${p.img}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/50 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-500" />
        {/* Neon border glow on hover */}
        <div className="absolute inset-0 border border-transparent group-hover:border-crimson/50 transition-colors duration-500" />
      </div>

      {/* Info */}
      <div className="absolute bottom-0 left-0 w-full p-6 md:p-8">
        <div className="flex justify-between items-end">
          <div>
            <div className="flex gap-2 mb-3 flex-wrap">
              {p.tags.map((tag) => (
                <span key={tag} className="font-label-sm text-[10px] text-crimson/70 border border-crimson/20 px-2 py-0.5 uppercase tracking-widest">
                  {tag}
                </span>
              ))}
            </div>
            <span className="font-label-sm text-white/40 uppercase tracking-widest block mb-1 text-[10px]">
              {p.category}
            </span>
            <h3 className="font-sub-hero text-2xl md:text-4xl font-bold text-white group-hover:text-crimson transition-colors duration-300">
              {p.title}
            </h3>
          </div>
          <span className="font-hero text-5xl md:text-7xl text-white/[0.06] font-bold group-hover:text-crimson/20 transition-colors duration-300 leading-none">
            {p.id}
          </span>
        </div>
      </div>

      {/* Arrow reveal */}
      <div className="absolute top-6 right-6 w-10 h-10 border border-white/10 group-hover:border-crimson flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
        <Icon name="arrow_outward" size="16px" className="text-crimson" />
      </div>
    </a>
  );
}

function Projects() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const cards = sectionRef.current?.querySelectorAll(".project-card");
    if (!cards) return;
    gsap.fromTo(
      cards,
      { y: 140, opacity: 0, scale: 0.88, rotateX: 8 },
      {
        y: 0, opacity: 1, scale: 1, rotateX: 0,
        duration: 1.2,
        stagger: 0.22,
        ease: "power4.out",
        transformOrigin: "center bottom",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      }
    );
  }, []);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="py-stack-md md:py-stack-lg px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto"
    >
      <div className="flex justify-between items-end mb-14 border-b border-white/5 pb-8 overflow-hidden">
        <div>
          <p className="font-label-sm text-xs text-crimson tracking-[0.3em] uppercase mb-4">Trabajo seleccionado</p>
          <h2 className="font-sub-hero text-5xl md:text-7xl font-bold text-white uppercase leading-[0.9]">
            Mis<br />
            <span className="text-crimson">proyectos</span>
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-gutter">
        {PROJECTS.map((p, i) => (
          <ProjectCard key={p.id} p={p} i={i} />
        ))}
      </div>
    </section>
  );
}

// ─── Skills & Process ─────────────────────────────────────────────────────────
const SKILLS = [
  { label: "HTML", group: "code" },
  { label: "CSS", group: "code" },
  { label: "JavaScript", group: "code" },
  { label: "C#", group: "code" },
  { label: ".NET", group: "code" },
  { label: "ASP.NET", group: "code" },
  { label: "Entity Framework", group: "code" },
  { label: "Blazor", group: "code" },
];

const PROCESS = [
  { icon: "manage_search", title: "Entender", desc: "Conozco la necesidad y defino el objetivo principal de cada solución." },
  { icon: "architecture", title: "Planificar", desc: "Organizo la información, el flujo de trabajo y la arquitectura técnica." },
  { icon: "code", title: "Desarrollar", desc: "Construyo interfaces y funcionalidades con tecnologías web y .NET." },
  { icon: "widgets", title: "Integrar", desc: "Conecto la aplicación con datos y servicios usando Entity Framework y APIs." },
  { icon: "tune", title: "Probar", desc: "Reviso el funcionamiento, mejoro la experiencia y corrijo los detalles necesarios." },
  { icon: "rocket_launch", title: "Entregar", desc: "Presento una solución mantenible, clara y lista para seguir creciendo." },
];

function SkillPill({ label, delay }: { label: string; delay: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  const onMove = (e: React.MouseEvent<HTMLSpanElement>) => {
    const rect = ref.current!.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(ref.current, { x: x * 0.25, y: y * 0.25, duration: 0.3, ease: "power2.out" });
  };
  const onLeave = () => {
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" });
  };

  return (
    <span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="skill-pill inline-block px-4 py-2 border border-white/10 font-label-sm text-white/50 hover:border-crimson hover:text-white hover:bg-crimson/10 transition-colors duration-200 cursor-default text-[10px] uppercase tracking-widest opacity-0"
      style={{ transitionDelay: `${delay}ms` }}
    >
      {label}
    </span>
  );
}

function Skills() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    gsap.fromTo(
      el.querySelectorAll(".process-step"),
      { x: -90, opacity: 0, rotateY: -8 },
      {
        x: 0, opacity: 1, rotateY: 0, duration: 0.95, stagger: 0.18, ease: "power4.out",
        scrollTrigger: { trigger: el.querySelector(".process-timeline"), start: "top 80%" },
      }
    );

    gsap.fromTo(
      el.querySelectorAll(".skill-pill"),
      { scale: 0.55, y: 24, opacity: 0 },
      {
        scale: 1, y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: "back.out(1.7)",
        scrollTrigger: { trigger: el.querySelector(".skills-pills"), start: "top 80%" },
      }
    );

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
      id="skills"
      ref={sectionRef}
      className="py-stack-md md:py-stack-lg px-margin-mobile md:px-margin-desktop bg-surface-container-lowest/70 border-y border-white/5 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-crimson/4 rounded-full blur-3xl pointer-events-none translate-x-1/2 -translate-y-1/2" />

      <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 md:gap-32 relative z-10">
        {/* Left */}
        <div>
          <p className="section-title font-label-sm text-[10px] text-crimson tracking-[0.3em] uppercase mb-4">Capabilities</p>
          <h2 className="section-title font-sub-hero text-4xl md:text-6xl font-bold text-white uppercase mb-12">
            Mis<br /><span className="text-white/20">tecnologías</span>
          </h2>

          <div className="mb-10">
            <h3 className="font-label-sm text-[10px] text-white/30 uppercase tracking-[0.3em] mb-6 border-b border-white/5 pb-4">Perfil</h3>
            <div className="space-y-6">
              {[
                { deg: "Desarrolladora Full Stack", school: "Frontend, backend y bases de datos", year: "01" },
                { deg: "Enfoque en soluciones .NET", school: "C# · ASP.NET · Blazor · Entity Framework", year: "02" },
              ].map(({ deg, school, year }) => (
                <div key={deg} className="flex justify-between items-start border-b border-white/5 pb-5">
                  <div>
                    <span className="font-body-md text-white font-medium block">{deg}</span>
                    <span className="font-label-sm text-white/30 text-[10px] mt-1 block">{school}</span>
                  </div>
                  <span className="font-label-sm text-crimson text-[10px] shrink-0 ml-6">{year}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-label-sm text-[10px] text-white/30 uppercase tracking-[0.3em] mb-6 border-b border-white/5 pb-4">Herramientas</h3>
            <div className="skills-pills flex flex-wrap gap-3">
              {SKILLS.map((s, i) => <SkillPill key={s.label} label={s.label} delay={i * 40} />)}
            </div>
          </div>
        </div>

        {/* Right: Process */}
        <div>
          <p className="section-title font-label-sm text-[10px] text-crimson tracking-[0.3em] uppercase mb-4">Methodology</p>
          <h2 className="section-title font-sub-hero text-4xl md:text-6xl font-bold text-white uppercase mb-12">
            Mi forma<br /><span className="text-white/20">de trabajar</span>
          </h2>

          <div className="process-timeline relative border-l border-white/5 ml-5 space-y-0">
            {PROCESS.map((step, i) => (
              <div key={step.title} className="process-step relative pl-10 pb-8">
                {/* Node */}
                <div className={`absolute left-[-10px] top-0 w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                  i === 0 ? "bg-crimson border-crimson" : "bg-obsidian border-white/10"
                }`}>
                  {i === 0 && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                {/* Step num */}
                <div className="flex items-baseline gap-4 mb-2">
                  <span className="font-label-sm text-[10px] text-crimson tracking-widest">{String(i + 1).padStart(2, "0")}</span>
                  <h4 className="font-sub-hero text-lg font-bold text-white">{step.title}</h4>
                </div>
                <p className="font-body-md text-white/35 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Quote */}
          <div className="mt-8 pl-10 border-l-2 border-crimson/50">
            <p className="font-sub-hero text-xl text-white/70 italic leading-relaxed">
              "Una buena solución no solo debe verse bien, también debe{" "}
              <span className="text-crimson not-italic font-bold">funcionar bien.</span>"
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────
function Contact() {
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
      const response = await fetch("https://formsubmit.co/ajax/neiraeliana2406@gmail.com", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(e.currentTarget),
      });

      if (!response.ok) throw new Error("No se pudo enviar el mensaje");

      setSent(true);
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setSent(false), 3500);
    } catch {
      setError("No se pudo enviar el mensaje. Intentá nuevamente en unos segundos.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-stack-lg px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] gap-16 lg:gap-20 items-start">
        {/* Left */}
        <div>
          <p className="contact-reveal font-label-sm text-[10px] text-crimson tracking-[0.3em] uppercase mb-4">Hablemos</p>
          <h2 className="contact-reveal min-w-0 w-full overflow-visible font-sub-hero text-3xl md:text-5xl lg:text-6xl font-bold text-white uppercase leading-[0.95] mb-8 break-words">
            Construyamos<br />algo<br /><span className="text-crimson">juntos</span>
          </h2>
          <p className="contact-reveal font-body-md text-white/40 mb-12 max-w-sm text-base leading-relaxed">
            Estoy disponible para proyectos freelance y oportunidades laborales en equipos de desarrollo.
            Conversemos sobre cómo puedo aportar a tu próximo proyecto.
          </p>

          {/* Availability badge */}
          <div className="contact-reveal flex items-center gap-4 mb-12 p-5 border border-white/5 bg-surface-container/30 w-fit">
            <div className="relative">
              <div className="w-3 h-3 rounded-full bg-crimson" />
              <div className="w-3 h-3 rounded-full bg-crimson/50 absolute inset-0 animate-ping" />
            </div>
            <div>
              <span className="font-label-sm text-[10px] text-white/30 block uppercase tracking-widest">Estado</span>
              <span className="font-sub-hero text-sm font-bold text-white">Disponible</span>
            </div>
          </div>

          <div className="contact-reveal space-y-5">
            <a
              href="https://wa.me/543515290303"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 group hover-target w-fit"
            >
              <span className="w-10 h-10 border border-white/10 group-hover:border-crimson flex items-center justify-center text-white/40 group-hover:text-crimson transition-colors">
                <Icon name="phone" size="16px" />
              </span>
              <span className="font-body-md text-white/50 group-hover:text-white transition-colors text-sm">
                WhatsApp · +54 351 529-0303
              </span>
            </a>
            <a
              href="mailto:neiraeliana2406@gmail.com"
              className="flex items-center gap-4 group hover-target w-fit"
            >
              <span className="w-10 h-10 border border-white/10 group-hover:border-crimson flex items-center justify-center text-white/40 group-hover:text-crimson transition-colors">
                <Icon name="mail" size="16px" />
              </span>
              <span className="font-body-md text-white/50 group-hover:text-white transition-colors text-sm">
                neiraeliana2406@gmail.com
              </span>
            </a>
            <a
              href="https://www.linkedin.com/in/eliana-neira-898099240/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 group hover-target w-fit"
            >
              <span className="w-10 h-10 border border-white/10 group-hover:border-crimson flex items-center justify-center text-white/40 group-hover:text-crimson transition-colors">
                <Icon name="link" size="16px" />
              </span>
              <span className="font-body-md text-white/50 group-hover:text-white transition-colors text-sm">
                linkedin.com/in/eliana-neira-898099240
              </span>
            </a>
          </div>
        </div>

        {/* Right: Form */}
        <div className="contact-reveal glass-panel p-8 md:p-12 relative overflow-hidden">
          {/* Decorative corner */}
          <div className="absolute top-0 right-0 w-24 h-24 border-t border-r border-crimson/20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-24 h-24 border-b border-l border-crimson/20 pointer-events-none" />

          {sent ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <Icon name="check_circle" fill={1} size="48px" className="text-crimson" />
              <p className="font-sub-hero text-xl font-bold text-white">¡Mensaje enviado!</p>
              <p className="font-body-md text-white/40 text-sm text-center">
                Me pondré en contacto contigo pronto.
              </p>
            </div>
          ) : (
            <form id="contactForm" onSubmit={submit} className="space-y-8">
              <input type="hidden" name="_subject" value="Nuevo mensaje desde tu portfolio" />
              <input type="hidden" name="_template" value="table" />
              <input type="hidden" name="_captcha" value="false" />
              {[
                { id: "name", label: "Tu nombre", type: "text", placeholder: "María González" },
                { id: "email", label: "Correo electrónico", type: "email", placeholder: "maria@ejemplo.com" },
              ].map(({ id, label, type, placeholder }) => (
                <div key={id} className="flex flex-col">
                  <label className="font-label-sm text-white/30 uppercase tracking-[0.2em] mb-3 text-[10px]">{label}</label>
                  <input
                    className="input-underline"
                    type={type}
                    name={id}
                    placeholder={placeholder}
                    value={form[id as "name" | "email"]}
                    onChange={(e) => setForm({ ...form, [id]: e.target.value })}
                    required
                  />
                </div>
              ))}
              <div className="flex flex-col">
                <label className="font-label-sm text-white/30 uppercase tracking-[0.2em] mb-3 text-[10px]">Cuéntame tu proyecto</label>
                <textarea
                  className="input-underline resize-none"
                  name="message"
                  placeholder="¿Qué tienes en mente?"
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="w-full bg-crimson text-white font-sub-hero font-bold py-5 px-8 hover:bg-white hover:text-obsidian transition-all duration-300 uppercase tracking-widest hover-target glow-hover flex items-center justify-center gap-3 mt-2"
              >
                {sending ? "Enviando..." : "Enviar mensaje"}
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
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="font-hero text-2xl text-crimson tracking-widest">ELIANA</div>
        <p className="font-label-sm text-[10px] text-white/20 uppercase tracking-widest order-3 md:order-none">
          © 2026 · Hecho con código · C# + .NET + JavaScript
        </p>
        <nav className="flex gap-8">
          { ["GitHub", "LinkedIn", "Correo"].map((l) => (
            <a
              key={l}
              href={
                l === "GitHub"
                  ? "https://github.com/elineir4"
                  : l === "LinkedIn"
                    ? "https://www.linkedin.com/in/eliana-neira-898099240/"
                    : "mailto:neiraeliana2406@gmail.com"
              }
              target={l === "Correo" ? undefined : "_blank"}
              rel={l === "Correo" ? undefined : "noreferrer"}
              className="font-label-sm text-[10px] text-white/20 hover:text-crimson transition-colors uppercase tracking-widest hover-target"
            >
              {l}
            </a>
          ))}
        </nav>
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
    <div className="bg-obsidian text-on-surface min-h-full">
      <WebGLBackground />
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
