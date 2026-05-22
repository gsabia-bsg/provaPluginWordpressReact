import { useState, useEffect, useRef, useMemo } from "react";
import "./index.css";
import "./App.css";

/* ──────────────────────────────────────────────────────────
   HOOKS UTILI
   ────────────────────────────────────────────────────────── */

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

function useCounter(target, duration = 1600) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const start = performance.now();
          const tick = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setValue(Math.round(eased * target));
            if (p < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
          io.unobserve(el);
        }
      });
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [target, duration]);
  return [value, ref];
}

/* ──────────────────────────────────────────────────────────
   ICONE SVG
   ────────────────────────────────────────────────────────── */

const Icon = {
  brand: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v18M3 12h18" />
    </svg>
  ),
  web: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="4" width="18" height="14" rx="2" />
      <path d="M3 9h18M7 14h4" />
    </svg>
  ),
  ux: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
    </svg>
  ),
  code: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M8 6l-5 6 5 6M16 6l5 6-5 6M14 4l-4 16" />
    </svg>
  ),
  strategy: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3a14 14 0 010 18M3 12h18" />
    </svg>
  ),
  copy: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 4h12l4 4v12H4zM16 4v4h4" />
      <path d="M8 13h8M8 17h5" />
    </svg>
  ),
  arrow: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  plus: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  ),
  sun: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4" strokeLinecap="round" />
    </svg>
  ),
  moon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M20 14.5A8 8 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z" />
    </svg>
  ),
  menu: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  ),
  close: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
      <path d="M5 12l5 5 9-11" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  up: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 14l6-6 6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

/* ──────────────────────────────────────────────────────────
   NAVBAR + MOBILE MENU + THEME TOGGLE + SCROLL PROGRESS
   ────────────────────────────────────────────────────────── */

function Navbar({ theme, onToggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? (y / h) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const links = [
    { href: "#about", label: "About" },
    { href: "#services", label: "Servizi" },
    { href: "#work", label: "Lavori" },
    { href: "#pricing", label: "Prezzi" },
    { href: "#faq", label: "FAQ" },
  ];

  return (
    <>
      <div className="scroll-progress" style={{ transform: `scaleX(${progress / 100})` }} />
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <a href="#top" className="nav-logo">
          <span className="logo-dot" />AUREO
        </a>
        <ul className="nav-links">
          {links.map((l) => (
            <li key={l.href}><a href={l.href}>{l.label}</a></li>
          ))}
          <li>
            <button
              className="icon-btn"
              onClick={onToggleTheme}
              aria-label="Cambia tema"
              title={theme === "dark" ? "Tema chiaro" : "Tema scuro"}
            >
              {theme === "dark" ? Icon.sun : Icon.moon}
            </button>
          </li>
          <li>
            <a href="#contact" className="nav-cta">Contattaci {Icon.arrow}</a>
          </li>
        </ul>
        <button className="burger" onClick={() => setMenuOpen(true)} aria-label="Apri menu">
          {Icon.menu}
        </button>
      </nav>

      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <div className="mm-head">
          <div className="nav-logo"><span className="logo-dot" />AUREO</div>
          <button className="icon-btn" onClick={() => setMenuOpen(false)} aria-label="Chiudi menu">
            {Icon.close}
          </button>
        </div>
        <ul className="mm-links">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={() => setMenuOpen(false)}>{l.label}</a>
            </li>
          ))}
        </ul>
        <div className="mm-foot">
          <button className="icon-btn" onClick={onToggleTheme} aria-label="Cambia tema">
            {theme === "dark" ? Icon.sun : Icon.moon}
            <span style={{ marginLeft: 8 }}>{theme === "dark" ? "Tema chiaro" : "Tema scuro"}</span>
          </button>
          <a href="#contact" className="nav-cta" onClick={() => setMenuOpen(false)}>
            Contattaci {Icon.arrow}
          </a>
        </div>
      </div>
    </>
  );
}

/* ──────────────────────────────────────────────────────────
   HERO
   ────────────────────────────────────────────────────────── */

function Stat({ to, suffix = "", label }) {
  const [val, ref] = useCounter(to);
  return (
    <div className="stat" ref={ref}>
      <div className="stat-num">{val}{suffix}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-content">
        <span className="hero-tag">
          <span className="pulse-dot" />
          Disponibili per nuovi progetti
        </span>

        <h1 className="hero-title">
          Creiamo esperienze<br />
          <em>che restano.</em>
        </h1>

        <p className="hero-sub">
          Design, strategia e sviluppo digitale per brand che vogliono lasciare il segno.
        </p>

        <div className="hero-actions">
          <a href="#services" className="btn-primary">
            Scopri i servizi {Icon.arrow}
          </a>
          <a href="#work" className="btn-ghost">
            Vedi i progetti
          </a>
        </div>

        <div className="hero-stats">
          <Stat to={200} suffix="+" label="Clienti" />
          <Stat to={450} suffix="+" label="Progetti" />
          <Stat to={8} label="Anni" />
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────
   MARQUEE CLIENTI
   ────────────────────────────────────────────────────────── */

function Marquee() {
  const items = [
    "ATELIER NORD", "MONTI&FIGLI", "OFFICINA 47", "VERDE LAB",
    "BISANZIO COFFEE", "FORMA SRL", "PERLA HOTELS", "VIVAIO 11",
    "MAREA STUDIO", "ROVERE CAPITAL"
  ];
  return (
    <div className="marquee">
      <div className="marquee-track">
        {[...items, ...items].map((t, i) => (
          <span key={i} className="m-item">
            <span className="m-dot">✦</span>{t}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   ABOUT
   ────────────────────────────────────────────────────────── */

function About() {
  const ref = useReveal();
  return (
    <section className="about reveal" id="about" ref={ref}>
      <div className="about-label">Chi siamo</div>
      <div className="about-grid">
        <div className="about-left">
          <h2>Un team che trasforma idee in realtà digitali memorabili.</h2>
          <div className="about-line" />
        </div>
        <div className="about-right">
          <p>
            Siamo uno studio creativo con sede a Milano. Lavoriamo con aziende di ogni dimensione
            per costruire identità visive, prodotti digitali e strategie di comunicazione che funzionano davvero.
          </p>
          <p>Ogni progetto è unico. Ogni soluzione è su misura.</p>
          <div className="about-bullets">
            <div><span>01</span>Approccio strategico, non solo estetico</div>
            <div><span>02</span>Trasparenza e timeline chiare</div>
            <div><span>03</span>Supporto post-lancio incluso</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────
   SERVICES
   ────────────────────────────────────────────────────────── */

const services = [
  { icon: Icon.brand, title: "Brand Identity", desc: "Logo, palette, tipografia e sistema visivo completo che racconta la tua storia." },
  { icon: Icon.web, title: "Web Design", desc: "Siti web e landing page ad alte conversioni, curati in ogni dettaglio." },
  { icon: Icon.ux, title: "UX / UI Design", desc: "Interfacce intuitive e piacevoli da usare. Dall'idea al prototipo." },
  { icon: Icon.code, title: "Sviluppo React", desc: "Applicazioni web moderne, veloci e scalabili costruite con tecnologie attuali." },
  { icon: Icon.strategy, title: "Strategia Digitale", desc: "Analisi, posizionamento e roadmap per raggiungere i tuoi obiettivi online." },
  { icon: Icon.copy, title: "Copywriting", desc: "Testi che convincono, emozionano e convertono. In italiano e in inglese." },
];

function Services() {
  const ref = useReveal();
  return (
    <section className="services reveal" id="services" ref={ref}>
      <div className="section-header">
        <span className="section-tag">Cosa facciamo</span>
        <h2>Servizi pensati<br /><em>per il tuo successo.</em></h2>
      </div>
      <div className="services-grid">
        {services.map((s, i) => (
          <article className="service-card" key={i} style={{ animationDelay: `${i * 0.08}s` }}>
            <span className="service-num">0{i + 1}</span>
            <span className="service-icon">{s.icon}</span>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
            <span className="service-arrow">{Icon.arrow}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────
   PROCESS
   ────────────────────────────────────────────────────────── */

const steps = [
  { n: "01", t: "Discovery", d: "Workshop iniziale, analisi del brand, dei competitor e degli obiettivi reali." },
  { n: "02", t: "Strategia", d: "Definiamo posizionamento, tono di voce e roadmap. Niente lavoro al buio." },
  { n: "03", t: "Design", d: "Concept, iterazioni, prototipi interattivi. Sempre con il tuo feedback." },
  { n: "04", t: "Launch", d: "Sviluppo, test e go-live. Poi supporto continuo per crescere." },
];

function Process() {
  const ref = useReveal();
  return (
    <section className="process reveal" id="process" ref={ref}>
      <div className="section-header light">
        <span className="section-tag">Il metodo</span>
        <h2>Quattro fasi.<br /><em>Zero sorprese.</em></h2>
      </div>
      <div className="process-grid">
        {steps.map((s, i) => (
          <div className="process-step" key={i}>
            <div className="ps-num">{s.n}</div>
            <h3>{s.t}</h3>
            <p>{s.d}</p>
            {i < steps.length - 1 && <div className="ps-connector" />}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────
   WORK / PORTFOLIO con filtro
   ────────────────────────────────────────────────────────── */

const projects = [
  { t: "Nexairon", c: "Brand · Web", cat: "brand", year: "2026", hue: "var(--rust)", glyph: "N" },
  { t: "Atelier Nord", c: "Identity", cat: "brand", year: "2025", hue: "var(--olive)", glyph: "A" },
  { t: "Verde Lab",  c: "Web App", cat: "web", year: "2025", hue: "#5a7a3a", glyph: "V" },
  { t: "Perla Hotels", c: "Brand · Web", cat: "web", year: "2025", hue: "var(--gold)", glyph: "P" },
  { t: "Officina 47", c: "UX/UI", cat: "ux", year: "2024", hue: "#7c5a3a", glyph: "47" },
  { t: "Bisanzio Coffee", c: "Brand", cat: "brand", year: "2024", hue: "#3a2a1a", glyph: "B" },
];

const filters = [
  { k: "all", l: "Tutti" },
  { k: "brand", l: "Brand" },
  { k: "web", l: "Web" },
  { k: "ux", l: "UX/UI" },
];

function Work() {
  const [filter, setFilter] = useState("all");
  const ref = useReveal();
  const visible = useMemo(
    () => filter === "all" ? projects : projects.filter(p => p.cat === filter),
    [filter]
  );
  return (
    <section className="work reveal" id="work" ref={ref}>
      <div className="work-head">
        <div>
          <span className="section-tag">Selected work</span>
          <h2>Progetti che amiamo<br /><em>e di cui andiamo fieri.</em></h2>
        </div>
        <div className="work-filters">
          {filters.map(f => (
            <button
              key={f.k}
              className={`chip ${filter === f.k ? "active" : ""}`}
              onClick={() => setFilter(f.k)}
            >
              {f.l}
            </button>
          ))}
        </div>
      </div>
      <div className="work-grid">
        {visible.map((p, i) => (
          <a className="work-card" key={`${p.t}-${i}`} href="#" style={{ "--hue": p.hue }}>
            <div className="wc-visual">
              <span className="wc-glyph">{p.glyph}</span>
              <div className="wc-grain" />
              <div className="wc-overlay">
                <span>Vedi caso studio</span>{Icon.arrow}
              </div>
            </div>
            <div className="wc-meta">
              <div>
                <h3>{p.t}</h3>
                <span className="wc-cat">{p.c}</span>
              </div>
              <span className="wc-year">{p.year}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────
   TESTIMONIALS
   ────────────────────────────────────────────────────────── */

const testimonials = [
  {
    q: "Hanno trasformato il nostro brand in qualcosa che finalmente ci somiglia. Strategia chiara, esecuzione impeccabile.",
    n: "Chiara Bianchi",
    r: "CEO, Atelier Nord",
    i: "CB",
  },
  {
    q: "Il sito che hanno costruito ha triplicato le richieste in tre mesi. Velocità e attenzione ai dettagli rare.",
    n: "Marco Rossi",
    r: "Founder, Verde Lab",
    i: "MR",
  },
  {
    q: "Lavorare con Aureo è stato come avere un team interno. Trasparenti, puntuali, propositivi.",
    n: "Elena Conti",
    r: "Marketing Director, Perla Hotels",
    i: "EC",
  },
];

function Testimonials() {
  const ref = useReveal();
  const [active, setActive] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % testimonials.length), 6000);
    return () => clearInterval(id);
  }, []);
  return (
    <section className="testimonials reveal" ref={ref}>
      <div className="section-header">
        <span className="section-tag">Dicono di noi</span>
        <h2>La fiducia<br /><em>è la nostra metrica.</em></h2>
      </div>
      <div className="t-stage">
        {testimonials.map((t, i) => (
          <figure key={i} className={`t-card ${i === active ? "active" : ""}`}>
            <blockquote>
              <span className="t-quote">"</span>
              {t.q}
            </blockquote>
            <figcaption>
              <span className="t-avatar">{t.i}</span>
              <div>
                <div className="t-name">{t.n}</div>
                <div className="t-role">{t.r}</div>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="t-dots">
        {testimonials.map((_, i) => (
          <button
            key={i}
            className={`t-dot ${i === active ? "active" : ""}`}
            onClick={() => setActive(i)}
            aria-label={`Vai a testimonianza ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────
   PRICING
   ────────────────────────────────────────────────────────── */

const plansY = [
  { name: "Starter", price: "990", suffix: "", desc: "Perfetto per chi inizia", features: ["Brand Identity base", "Sito vetrina 5 pagine", "1 revisione", "Consegna in 3 settimane"] },
  { name: "Studio", price: "2.400", suffix: "", desc: "Il più scelto", features: ["Brand Identity completa", "Sito fino a 12 pagine", "3 revisioni", "SEO base", "Supporto 3 mesi"], highlight: true },
  { name: "Enterprise", price: "Su misura", suffix: "", desc: "Per grandi progetti", features: ["Tutto di Studio", "Sviluppo custom React", "Strategia digitale", "Supporto 12 mesi"] },
];

const plansM = [
  { name: "Starter", price: "99", suffix: "/mese", desc: "Pay-as-you-grow", features: ["Restyling logo", "1 landing page", "1 revisione/mese", "Cancellabile in qualunque momento"] },
  { name: "Studio", price: "240", suffix: "/mese", desc: "Crescita continua", features: ["Tutto di Starter", "Aggiornamenti illimitati", "Supporto prioritario", "SEO mensile"], highlight: true },
  { name: "Enterprise", price: "Su misura", suffix: "", desc: "Retainer dedicato", features: ["Team allocato", "SLA garantito", "Audit trimestrale", "Reportistica completa"] },
];

function Pricing() {
  const ref = useReveal();
  const [billing, setBilling] = useState("yearly");
  const plans = billing === "yearly" ? plansY : plansM;
  return (
    <section className="pricing reveal" id="pricing" ref={ref}>
      <div className="section-header">
        <span className="section-tag">Investimento</span>
        <h2>Piani chiari,<br /><em>nessuna sorpresa.</em></h2>
        <div className="billing-toggle" role="tablist">
          <button
            className={billing === "yearly" ? "active" : ""}
            onClick={() => setBilling("yearly")}
            role="tab"
          >
            Progetto
          </button>
          <button
            className={billing === "monthly" ? "active" : ""}
            onClick={() => setBilling("monthly")}
            role="tab"
          >
            Retainer mensile
          </button>
        </div>
      </div>
      <div className="pricing-grid">
        {plans.map((p, i) => (
          <div className={`pricing-card ${p.highlight ? "highlight" : ""}`} key={i}>
            {p.highlight && <div className="popular-badge">Più popolare</div>}
            <div className="plan-name">{p.name}</div>
            <div className="plan-price">
              {p.price === "Su misura"
                ? <span className="price-custom">Su misura</span>
                : <><span className="currency">€</span>{p.price}<span className="plan-suffix">{p.suffix}</span></>}
            </div>
            <div className="plan-desc">{p.desc}</div>
            <ul className="plan-features">
              {p.features.map((f, j) => (
                <li key={j}><span className="check">{Icon.check}</span>{f}</li>
              ))}
            </ul>
            <a href="#contact" className={`plan-btn ${p.highlight ? "btn-primary" : "btn-outline"}`}>
              Inizia ora {Icon.arrow}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────
   FAQ ACCORDION
   ────────────────────────────────────────────────────────── */

const faqs = [
  { q: "Quanto tempo richiede un progetto?", a: "Una landing page richiede 2-3 settimane, un brand completo da 4 a 8. Te lo confermiamo dopo il primo workshop." },
  { q: "Lavorate anche con piccole aziende?", a: "Sì. Abbiamo piani pensati per startup e professionisti, e altri per realtà più strutturate. Nessun progetto è troppo piccolo se l'idea è chiara." },
  { q: "Posso pagare a rate?", a: "Certamente. Sui progetti sopra i 2.000€ proponiamo 50% all'inizio, 30% a metà e 20% alla consegna." },
  { q: "Cosa succede dopo il lancio?", a: "Tutti i piani includono almeno 3 mesi di supporto. Poi puoi passare a un retainer mensile o intervenire on-demand." },
  { q: "Lavorate solo a Milano?", a: "Siamo a Milano ma lavoriamo in remoto con clienti in tutta Europa. Per i progetti più importanti ci incontriamo di persona, dove serve." },
];

function FAQ() {
  const ref = useReveal();
  const [open, setOpen] = useState(0);
  return (
    <section className="faq reveal" id="faq" ref={ref}>
      <div className="section-header">
        <span className="section-tag">Domande frequenti</span>
        <h2>Tutto quello<br /><em>che vuoi sapere.</em></h2>
      </div>
      <div className="faq-list">
        {faqs.map((f, i) => (
          <div key={i} className={`faq-item ${open === i ? "open" : ""}`}>
            <button className="faq-q" onClick={() => setOpen(open === i ? -1 : i)}>
              <span>{f.q}</span>
              <span className="faq-icon">{Icon.plus}</span>
            </button>
            <div className="faq-a"><p>{f.a}</p></div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────
   CONTACT con validazione
   ────────────────────────────────────────────────────────── */

function Contact() {
  const ref = useReveal();
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", budget: "", message: "" });
  const [errors, setErrors] = useState({});

  const handle = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: undefined });
  };

  const validate = () => {
    const err = {};
    if (!form.name.trim()) err.name = "Inserisci il tuo nome";
    if (!form.email.trim()) err.email = "Inserisci la tua email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) err.email = "Email non valida";
    if (!form.message.trim() || form.message.trim().length < 10)
      err.message = "Scrivici almeno qualche dettaglio (10+ caratteri)";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 900);
  };

  return (
    <section className="contact reveal" id="contact" ref={ref}>
      <div className="contact-inner">
        <div className="contact-left">
          <span className="section-tag">Contatti</span>
          <h2>Parliamo<br /><em>del tuo progetto.</em></h2>
          <p>Compila il modulo o scrivici direttamente a <a href="mailto:ciao@aureo.studio"><strong>ciao@aureo.studio</strong></a></p>
          <div className="contact-info">
            <div><span>Sede</span>Milano, Italia · Via Tortona 42</div>
            <div><span>Telefono</span>+39 02 1234 567</div>
            <div><span>Risposta</span>Entro 24 ore lavorative</div>
          </div>
        </div>
        <div className="contact-right">
          {sent ? (
            <div className="sent-msg">
              <div className="sent-icon">{Icon.check}</div>
              <h3>Messaggio inviato</h3>
              <p>Grazie {form.name.split(" ")[0]}! Ti risponderemo entro 24 ore.</p>
              <button className="btn-ghost" onClick={() => { setSent(false); setForm({ name: "", email: "", budget: "", message: "" }); }}>
                Invia un altro messaggio
              </button>
            </div>
          ) : (
            <div className="contact-form">
              <div className={`field ${errors.name ? "has-error" : ""}`}>
                <input name="name" placeholder="Il tuo nome" value={form.name} onChange={handle} />
                {errors.name && <span className="err">{errors.name}</span>}
              </div>
              <div className={`field ${errors.email ? "has-error" : ""}`}>
                <input name="email" placeholder="Email" type="email" value={form.email} onChange={handle} />
                {errors.email && <span className="err">{errors.email}</span>}
              </div>
              <div className="field">
                <select name="budget" value={form.budget} onChange={handle}>
                  <option value="">Budget indicativo (opzionale)</option>
                  <option>&lt; 2.000 €</option>
                  <option>2.000 – 5.000 €</option>
                  <option>5.000 – 15.000 €</option>
                  <option>&gt; 15.000 €</option>
                </select>
              </div>
              <div className={`field ${errors.message ? "has-error" : ""}`}>
                <textarea name="message" placeholder="Raccontaci il tuo progetto..." rows={5} value={form.message} onChange={handle} />
                {errors.message && <span className="err">{errors.message}</span>}
              </div>
              <button className="btn-primary" onClick={submit} disabled={sending}>
                {sending ? "Invio in corso..." : <>Invia messaggio {Icon.arrow}</>}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────
   FOOTER + NEWSLETTER
   ────────────────────────────────────────────────────────── */

function Footer() {
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    setOk(true);
    setEmail("");
    setTimeout(() => setOk(false), 3000);
  };
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="f-col f-brand">
          <div className="footer-logo"><span className="logo-dot" />AUREO</div>
          <p>Studio creativo. Milano, Italia.<br />Creiamo esperienze che restano.</p>
        </div>

        <div className="f-col">
          <h4>Studio</h4>
          <a href="#about">Chi siamo</a>
          <a href="#services">Servizi</a>
          <a href="#process">Metodo</a>
          <a href="#work">Lavori</a>
        </div>

        <div className="f-col">
          <h4>Risorse</h4>
          <a href="#pricing">Prezzi</a>
          <a href="#faq">FAQ</a>
          <a href="#contact">Contatti</a>
          <a href="#">Blog</a>
        </div>

        <div className="f-col">
          <h4>Newsletter</h4>
          <p className="f-small">Una mail al mese. Niente spam, promesso.</p>
          <form className="newsletter" onSubmit={submit}>
            <input
              type="email"
              placeholder="la-tua@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" aria-label="Iscriviti">{Icon.arrow}</button>
          </form>
          {ok && <div className="f-ok">Iscritto. A presto!</div>}
        </div>
      </div>

      <div className="footer-bar">
        <p>© 2026 Aureo Studio. Tutti i diritti riservati. · P.IVA 12345678901</p>
        <div className="footer-links">
          <a href="#">Privacy</a>
          <a href="#">Cookie</a>
          <a href="#">Instagram</a>
          <a href="#">Behance</a>
          <a href="#">LinkedIn</a>
        </div>
      </div>
    </footer>
  );
}

/* ──────────────────────────────────────────────────────────
   SCROLL TO TOP
   ────────────────────────────────────────────────────────── */

function ScrollTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const fn = () => setShow(window.scrollY > 600);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <button
      className={`scroll-top ${show ? "show" : ""}`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Torna su"
    >
      {Icon.up}
    </button>
  );
}

/* ──────────────────────────────────────────────────────────
   APP
   ────────────────────────────────────────────────────────── */

export default function App() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem("aureo-theme");
    if (saved === "dark" || saved === "light") setTheme(saved);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("aureo-theme", theme);
  }, [theme]);

  return (
    <div className="app">
      <Navbar theme={theme} onToggleTheme={() => setTheme(t => t === "dark" ? "light" : "dark")} />
      <Hero />
      <Marquee />
      <About />
      <Services />
      <Process />
      <Work />
      <Testimonials />
      <Pricing />
      <FAQ />
      <Contact />
      <Footer />
      <ScrollTop />
    </div>
  );
}
