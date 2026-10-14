import { createContext, useContext, useState, type ReactNode } from "react";

export type Language = "es" | "en";

const translations = {
  es: {
    nav: { home: "Inicio", projects: "Proyectos", skills: "Tecnologías", contact: "Contacto", talk: "Hablemos" },
    hero: {
      role: "DESARROLLADORA FULL STACK",
      digital: "DESARROLLADORA DIGITAL",
      availability: "DISPONIBLE PARA PROYECTOS Y OPORTUNIDADES",
      greeting: "Hola, soy",
      location: "DESARROLLADORA EN ARGENTINA",
      features: [
        "Transformo ideas en experiencias digitales",
        "Soluciones centradas en las personas",
        "Interfaces claras y funcionales",
        "Diseño adaptable a cada dispositivo",
      ],
      scroll: "Desplazar",
    },
    marquee: ["PROYECTOS DESTACADOS", "DESARROLLO WEB", "CÓDIGO CON PROPÓSITO", "SOLUCIONES DIGITALES", "DESARROLLADORA"],
    projects: {
      eyebrow: "Trabajo seleccionado",
      headingFirst: "Mis",
      headingSecond: "proyectos",
      imagePlaceholder: "Imagen no disponible",
      carouselControls: {
        previous: "Proyecto anterior",
        next: "Proyecto siguiente",
      },
      carouselLabel: "Proyectos del portfolio",
      actions: { code: "Ver código", page: "Ver página", close: "Cerrar" },
      items: {
        "01": { title: "DON SPIEDO", category: "Sitio web para rotisería", tags: ["HTML", "CSS", "JavaScript"] },
        "02": { title: "TIENDA DE ROPA", category: "E-commerce web", tags: ["HTML", "CSS", "JavaScript"] },
        "03": { title: "MUNDO RUTA", category: "Proyecto grupal en C#", tags: ["C#", ".NET", "Trabajo grupal"] },
        "04": { title: "AN INSTALACIONES", category: "Proyecto personal en C#", tags: ["C#", ".NET", "Aplicación web"] },
        "05": { title: "DELICIAS LOLI", category: "Landing page para boutique dulce", tags: ["React", "Vite"] },
        "06": { title: "LOPEZ DOJO", category: "Landing page para gimnasio", tags: ["React", "Vite"] },
      },
    },
    skills: {
      eyebrow: "Capacidades",
      headingFirst: "Mis",
      headingSecond: "tecnologías",
      profile: "Perfil",
      tools: "Herramientas",
      profileItems: [
        { title: "Desarrolladora Full Stack", detail: "Frontend, backend y bases de datos" },
        { title: "Enfoque en soluciones .NET", detail: "C# · ASP.NET · Blazor · Entity Framework" },
      ],
    },
    education: {
      eyebrow: "Formación académica",
      headingFirst: "Mis",
      headingSecond: "estudios",
      items: [
        { title: "Secundario terminado", detail: "Ciencias Sociales y Humanidades", year: "2023", icon: "school" },
        { title: "Tecnicatura en Desarrollo de Software", detail: "En curso", year: "", icon: "code" },
      ],
    },
    contact: {
      eyebrow: "Hablemos",
      heading: ["Construyamos", "algo", "juntos"],
      description: "Estoy disponible para proyectos freelance y oportunidades laborales en equipos de desarrollo. Conversemos sobre cómo puedo aportar a tu próximo proyecto.",
      statusLabel: "Estado",
      status: "Disponible",
      success: "¡Mensaje enviado!",
      successDetail: "Me pondré en contacto contigo pronto.",
      name: "Tu nombre",
      email: "Correo electrónico",
      message: "Cuéntame tu proyecto",
      namePlaceholder: "María González",
      emailPlaceholder: "maria@ejemplo.com",
      messagePlaceholder: "¿Qué tienes en mente?",
      sending: "Enviando...",
      submit: "Enviar mensaje",
      error: "No se pudo enviar el mensaje. Intentá nuevamente en unos segundos.",
      subject: "Nuevo mensaje desde tu portfolio",
      sendError: "No se pudo enviar el mensaje",
    },
    footer: { email: "Correo" },
  },
  en: {
    nav: { home: "Home", projects: "Projects", skills: "Technologies", contact: "Contact", talk: "Let's talk" },
    hero: {
      role: "FULL STACK DEVELOPER",
      digital: "DIGITAL DEVELOPER",
      availability: "AVAILABLE FOR PROJECTS AND OPPORTUNITIES",
      greeting: "Hi, I'm",
      location: "DEVELOPER IN ARGENTINA",
      features: [
        "I turn ideas into digital experiences",
        "People-centered solutions",
        "Clear and functional interfaces",
        "Design adaptable to every device",
      ],
      scroll: "Scroll",
    },
    marquee: ["SELECTED PROJECTS", "WEB DEVELOPMENT", "CODE WITH PURPOSE", "DIGITAL SOLUTIONS", "DEVELOPER"],
    projects: {
      eyebrow: "Selected work",
      headingFirst: "My",
      headingSecond: "projects",
      imagePlaceholder: "Image unavailable",
      carouselControls: {
        previous: "Previous project",
        next: "Next project",
      },
      carouselLabel: "Portfolio projects",
      actions: { code: "View code", page: "View page", close: "Close" },
      items: {
        "01": { title: "DON SPIEDO", category: "Rotisserie website", tags: ["HTML", "CSS", "JavaScript"] },
        "02": { title: "CLOTHING STORE", category: "E-commerce website", tags: ["HTML", "CSS", "JavaScript"] },
        "03": { title: "MUNDO RUTA", category: "Group project in C#", tags: ["C#", ".NET", "Group work"] },
        "04": { title: "AN INSTALACIONES", category: "Personal project in C#", tags: ["C#", ".NET", "Web application"] },
        "05": { title: "DELICIAS LOLI", category: "Sweet shop landing page", tags: ["React", "Vite"] },
        "06": { title: "LOPEZ DOJO", category: "Gym landing page", tags: ["React", "Vite"] },
      },
    },
    skills: {
      eyebrow: "Capabilities",
      headingFirst: "My",
      headingSecond: "technologies",
      profile: "Profile",
      tools: "Tools",
      profileItems: [
        { title: "Full Stack Developer", detail: "Frontend, backend and databases" },
        { title: "Focused on .NET solutions", detail: "C# · ASP.NET · Blazor · Entity Framework" },
      ],
    },
    education: {
      eyebrow: "Academic background",
      headingFirst: "My",
      headingSecond: "education",
      items: [
        { title: "High school completed", detail: "Social Sciences and Humanities", year: "2023", icon: "school" },
        { title: "Software Development Technician", detail: "In progress", year: "", icon: "code" },
      ],
    },
    contact: {
      eyebrow: "Let's talk",
      heading: ["Let's build", "something", "together"],
      description: "I'm available for freelance projects and job opportunities in development teams. Let's talk about how I can contribute to your next project.",
      statusLabel: "Status",
      status: "Available",
      success: "Message sent!",
      successDetail: "I'll get in touch with you soon.",
      name: "Your name",
      email: "Email address",
      message: "Tell me about your project",
      namePlaceholder: "Maria Gonzalez",
      emailPlaceholder: "maria@example.com",
      messagePlaceholder: "What do you have in mind?",
      sending: "Sending...",
      submit: "Send message",
      error: "The message could not be sent. Please try again in a few seconds.",
      subject: "New message from your portfolio",
      sendError: "The message could not be sent",
    },
    footer: { email: "Email" },
  },
} as const;

export type Translations = (typeof translations)[Language];

type LanguageContextValue = {
  language: Language;
  toggleLanguage: () => void;
  t: Translations;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("es");
  const toggleLanguage = () => setLanguage((current) => (current === "es" ? "en" : "es"));

  return <LanguageContext.Provider value={{ language, toggleLanguage, t: translations[language] }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
