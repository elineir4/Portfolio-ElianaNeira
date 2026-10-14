import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ProjectCarousel.css";

gsap.registerPlugin(ScrollTrigger);

type Project = {
  id: string;
  img: string;
  github: string;
  website?: string;
};

type ProjectDescription = {
  title: string;
  category: string;
  tags: readonly string[];
};

type ProjectCarouselProps = {
  projects: readonly Project[];
  descriptions: Record<string, ProjectDescription>;
  actions: {
    code: string;
    page: string;
  };
  controls: {
    previous: string;
    next: string;
  };
  label: string;
  imagePlaceholder: string;
};

export default function ProjectCarousel({
  projects,
  descriptions,
  actions,
  controls,
  label,
  imagePlaceholder,
}: ProjectCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel || projects.length < 2) return;

    const media = gsap.matchMedia();
    media.add("(min-width: 641px)", () => {
      const trigger = ScrollTrigger.create({
        trigger: carousel,
        pin: true,
        start: "top top",
        end: () => `+=${(projects.length - 1) * Math.min(window.innerHeight * 0.72, 700)}`,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          setActiveIndex(Math.round(self.progress * (projects.length - 1)));
        },
      });
      return () => trigger.kill();
    });

    return () => media.revert();
  }, [projects.length]);

  const showPrevious = () => {
    setActiveIndex((current) => (current - 1 + projects.length) % projects.length);
  };
  const showNext = () => {
    setActiveIndex((current) => (current + 1) % projects.length);
  };

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const cards = Array.from(stage.querySelectorAll<HTMLElement>(".music-project-card"));
    if (!cards.length) return;

    const cardWidth = cards[0].offsetWidth;
    const visibleRange = Math.min(2, projects.length - 1);

    cards.forEach((card, index) => {
      const offset = index - activeIndex;
      const distance = Math.abs(offset);
      const isVisible = distance <= visibleRange;

      gsap.set(card, { xPercent: -50, yPercent: -50 });
      gsap.to(card, {
        x: offset * cardWidth * 0.9,
        y: distance * 12,
        z: -distance * 100,
        rotateY: offset * -28,
        scale: distance === 0 ? 1 : Math.max(0.56, 0.82 - distance * 0.08),
        opacity: isVisible ? (distance === 0 ? 1 : 0.72 / distance) : 0,
        zIndex: projects.length - distance,
        duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 0.8,
        ease: "power3.inOut",
        overwrite: true,
      });

      card.style.pointerEvents = isVisible ? "auto" : "none";
      card.setAttribute("aria-hidden", String(!isVisible));
    });

    return () => {
      cards.forEach((card) => gsap.killTweensOf(card));
    };
  }, [activeIndex, projects.length]);

  if (!projects.length) return null;

  return (
    <div
      ref={carouselRef}
      className="project-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
    >
      <div ref={stageRef} className="project-carousel-stage">
        {projects.map((project, index) => {
          const description = descriptions[project.id];
          const isActive = index === activeIndex;
          const image = `${import.meta.env.BASE_URL}${project.img.replace(/^\//, "")}`;

          return (
            <article
              key={project.id}
              className="music-project-card"
              aria-label={`${description?.title ?? project.id}, ${index + 1} of ${projects.length}`}
            >
              <img
                className="music-project-cover"
                src={image}
                alt=""
                draggable={false}
                loading={index < 3 ? "eager" : "lazy"}
              />
              <div className="music-project-shade" />

              {description ? (
                <div className="music-project-info">
                  <div className="music-project-tags">
                    {description.tags.map((tag) => <span key={tag}>{tag}</span>)}
                  </div>
                  <p className="music-project-category">{description.category}</p>
                  <h3>{description.title}</h3>
                  {isActive && (
                    <div className="music-project-links">
                      <a href={project.github} target="_blank" rel="noreferrer">
                        {actions.code}
                      </a>
                      {project.website && (
                        <a href={project.website} target="_blank" rel="noreferrer">
                          {actions.page}
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <p className="music-project-category">{imagePlaceholder}</p>
              )}
            </article>
          );
        })}
      </div>

      <div className="project-carousel-progress" aria-live="polite">
        <span className="project-carousel-count" aria-live="polite">
          {String(activeIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
        </span>
        <span className="project-carousel-progress-track" aria-hidden="true">
          <span style={{ transform: `scaleX(${(activeIndex + 1) / projects.length})` }} />
        </span>
        <button
          className="project-carousel-arrow project-carousel-arrow--previous"
          type="button"
          aria-label={controls.previous}
          onClick={showPrevious}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
        </button>
        <button
          className="project-carousel-arrow project-carousel-arrow--next"
          type="button"
          aria-label={controls.next}
          onClick={showNext}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
        </button>
      </div>
    </div>
  );
}
