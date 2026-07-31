"use client";

import { useRef, useState, type PointerEvent } from "react";

const services = [
  {
    number: "01",
    title: "Mobile apps",
    description:
      "Fast, intuitive iOS and Android experiences built around your customers and business goals.",
    tags: ["iOS", "Android", "Cross-platform"],
  },
  {
    number: "02",
    title: "Websites & web apps",
    description:
      "High-performing marketing sites, platforms, and web products that look sharp on every screen.",
    tags: ["Web design", "Frontend", "Web platforms"],
  },
  {
    number: "03",
    title: "Custom software",
    description:
      "Purpose-built tools that replace manual work, connect teams, and help your operation scale.",
    tags: ["Business systems", "Automation", "Dashboards"],
  },
  {
    number: "04",
    title: "APIs & integrations",
    description:
      "Reliable connections between your products, payment providers, data, and third-party services.",
    tags: ["APIs", "Payments", "System integration"],
  },
  {
    number: "05",
    title: "AI & cloud",
    description:
      "Practical AI features and dependable cloud foundations designed for real business value.",
    tags: ["AI solutions", "Cloud", "Architecture"],
  },
];

const process = [
  {
    step: "Discover",
    text: "We get clear on the problem, the people using the product, and what success should look like.",
  },
  {
    step: "Design",
    text: "We map the experience, test the important flows, and shape a visual system that fits your brand.",
  },
  {
    step: "Build",
    text: "We turn the plan into dependable software, sharing progress early and often along the way.",
  },
  {
    step: "Launch",
    text: "We ship with care, measure what matters, and keep improving as your product and business grow.",
  },
];

const projects = [
  {
    number: "01",
    name: "Mynomp",
    type: "Product website",
    summary:
      "An accountability-powered focus platform designed to turn work sessions into lasting momentum.",
    href: "https://www.mynomp.com/",
  },
  {
    number: "02",
    name: "City BBQ App",
    type: "iOS & iPadOS app",
    summary:
      "A customer-focused mobile experience designed around convenient ordering and brand engagement.",
    href: "https://apps.apple.com/us/app/city-barbeque/id979145837",
  },
  {
    number: "03",
    name: "SlimChickens App",
    type: "iOS app",
    summary:
      "A polished restaurant app experience that brings menu discovery and customer interaction together.",
    href: "https://apps.apple.com/us/app/slim-chickens/id1244055810",
  },
];

const heroOutcomes = [
  "move businesses",
  "delight customers",
  "simplify work",
];

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const [outcomeIndex, setOutcomeIndex] = useState(0);

  function handleHeroPointerMove(event: PointerEvent<HTMLElement>) {
    if (event.pointerType !== "mouse") return;

    const hero = heroRef.current;
    if (!hero) return;

    const bounds = hero.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;

    hero.style.setProperty("--pointer-x", `${x}px`);
    hero.style.setProperty("--pointer-y", `${y}px`);
    hero.style.setProperty("--tilt-x", `${((y / bounds.height) - 0.5) * -4}deg`);
    hero.style.setProperty("--tilt-y", `${((x / bounds.width) - 0.5) * 4}deg`);
  }

  function resetHeroPointer() {
    const hero = heroRef.current;
    if (!hero) return;

    hero.style.setProperty("--tilt-x", "0deg");
    hero.style.setProperty("--tilt-y", "0deg");
  }

  function cycleOutcome() {
    setOutcomeIndex((current) => (current + 1) % heroOutcomes.length);
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="WykSofts Inc. home">
          <span className="brand-mark" aria-hidden="true">
            W
          </span>
          <span>WykSofts Inc.</span>
        </a>

        <nav className="main-nav" aria-label="Primary navigation">
          <a href="#services">Services</a>
          <a href="#clients">Clients</a>
          <a href="#pricing">Pricing</a>
          <a href="#about">About</a>
        </nav>

        <a className="nav-cta" href="#pricing">
          Get a quotation
          <span aria-hidden="true">↗</span>
        </a>
      </header>

      <section
        className="hero"
        id="top"
        ref={heroRef}
        onPointerMove={handleHeroPointerMove}
        onPointerLeave={resetHeroPointer}
      >
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-cursor" aria-hidden="true" />
        <div className="hero-main">
          <p className="eyebrow">
            <span />
            Software development & digital solutions
          </p>
          <h1>
            We build digital products that{" "}
            <button
              className="hero-outcome"
              type="button"
              onClick={cycleOutcome}
              aria-label={`Change outcome. Currently: ${heroOutcomes[outcomeIndex]}`}
            >
              <em key={heroOutcomes[outcomeIndex]} aria-live="polite">
                {heroOutcomes[outcomeIndex]}
              </em>
            </button>{" "}
            forward.
          </h1>
          <button className="hero-hint" type="button" onClick={cycleOutcome}>
            <span aria-hidden="true">↻</span>
            Click the orange words
          </button>
        </div>

        <aside className="hero-side">
          <div className="availability">
            <span className="pulse" />
            Available for new projects
          </div>
          <p>
            From a first sketch to a product people rely on, WykSofts turns
            ambitious ideas into thoughtful mobile apps, websites, and custom
            software.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#contact">
              Tell us your idea
              <span aria-hidden="true">↗</span>
            </a>
            <a className="text-link" href="#services">
              Explore our services
              <span aria-hidden="true">↓</span>
            </a>
          </div>
          <div className="location">
            <span>Mirage Towers, Nairobi</span>
            <span>Working with teams everywhere</span>
          </div>
        </aside>
      </section>

      <section className="services section" id="services">
        <div className="section-heading">
          <p className="section-kicker">What we do</p>
          <h2>One partner for the whole digital journey.</h2>
          <p>
            Strategy, design, and engineering come together in one focused
            team—so good ideas become useful, polished products.
          </p>
        </div>

        <div className="service-list">
          {services.map((service) => (
            <article className="service-row" key={service.number}>
              <span className="service-number">{service.number}</span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <div className="service-tags" aria-label={`${service.title} capabilities`}>
                {service.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <span className="service-arrow" aria-hidden="true">
                ↗
              </span>
            </article>
          ))}
        </div>
      </section>

      <section className="clients section" id="clients">
        <div className="section-heading client-heading">
          <p className="section-kicker">Selected clients</p>
          <h2>Client products we&apos;ve helped bring to life.</h2>
          <p>
            A selection of web and mobile experiences delivered for growing
            brands and ambitious teams.
          </p>
        </div>

        <div className="project-grid">
          {projects.map((project) => (
            <a
              className="project-card"
              href={project.href}
              key={project.name}
              target="_blank"
              rel="noreferrer"
              aria-label={`View ${project.name} project`}
            >
              <div className="project-meta">
                <span>{project.number}</span>
                <span>
                  {project.type} <b aria-hidden="true">↗</b>
                </span>
              </div>
              <div className="project-monogram" aria-hidden="true">
                {project.name.charAt(0)}
              </div>
              <div>
                <h3>{project.name}</h3>
                <p>{project.summary}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="approach section" id="approach">
        <div className="approach-intro">
          <p className="section-kicker light">How we work</p>
          <h2>Clear thinking. Close collaboration. No black box.</h2>
          <p>
            You stay close to the work from day one, with visible progress,
            honest trade-offs, and decisions tied back to your goals.
          </p>
        </div>

        <ol className="process-list">
          {process.map((item, index) => (
            <li key={item.step}>
              <span>0{index + 1}</span>
              <div>
                <h3>{item.step}</h3>
                <p>{item.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="about section" id="about">
        <p className="section-kicker">Why WykSofts</p>
        <div className="about-layout">
          <h2>
            Built with care.
            <br />
            Made to last.
          </h2>
          <div className="about-copy">
            <p className="about-lead">
              We are a software company for organizations that want more than
              code—they want a product partner who understands the bigger
              picture.
            </p>
            <div className="principles">
              <article>
                <span>01</span>
                <h3>Business first</h3>
                <p>
                  Every technical decision starts with the outcome it needs to
                  create for your business and users.
                </p>
              </article>
              <article>
                <span>02</span>
                <h3>Quality throughout</h3>
                <p>
                  Thoughtful design, clean engineering, and clear communication
                  are part of the process—not last-minute extras.
                </p>
              </article>
              <article>
                <span>03</span>
                <h3>Ready to grow</h3>
                <p>
                  We build foundations that can evolve as your customers,
                  operations, and ambition expand.
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="pricing section" id="pricing">
        <div className="pricing-copy">
          <p className="section-kicker">Simple starting point</p>
          <h2>Quality digital work, sized for where you are.</h2>
          <p>
            Every project is different. Share what you need and we&apos;ll send a
            clear, scope-based quotation with the deliverables, timeline, and
            total cost.
          </p>
        </div>

        <aside className="price-card">
          <p>Projects start from</p>
          <div className="price">
            <span>$</span>
            <strong>100</strong>
          </div>
          <p>
            A practical entry point for focused landing pages, small digital
            improvements, and clearly scoped work.
          </p>
          <a
            className="button quote-button"
            href="mailto:support@mynomp.com?subject=Request%20a%20WykSofts%20quotation&body=Project%20type%3A%0AWhat%20you%20need%3A%0ATimeline%3A%0ABudget%3A"
          >
            Get a quotation
            <span aria-hidden="true">↗</span>
          </a>
          <small>Final pricing depends on scope and requirements.</small>
        </aside>
      </section>

      <section className="contact section" id="contact">
        <div className="contact-orbit" aria-hidden="true">
          <span>WYKSOFTS</span>
        </div>
        <p className="section-kicker light">Have a project in mind?</p>
        <h2>Let&apos;s build what&apos;s next.</h2>
        <p>
          Tell us what you&apos;re working on, where you are today, and what a
          great outcome would look like.
        </p>
        <div className="contact-actions">
          <a
            className="button contact-button"
            href="mailto:support@mynomp.com?subject=Let%27s%20build%20a%20project"
          >
            Email our team
            <span aria-hidden="true">↗</span>
          </a>
          <a className="contact-phone" href="tel:+254703285070">
            +254 703 285 070
          </a>
          <span className="office-location">Mirage Towers, Nairobi</span>
        </div>
      </section>

      <footer>
        <a className="brand footer-brand" href="#top">
          <span className="brand-mark" aria-hidden="true">
            W
          </span>
          <span>WykSofts Inc.</span>
        </a>
        <p>
          <a href="mailto:support@mynomp.com">support@mynomp.com</a>
          {" · "}
          <a href="tel:+254703285070">+254 703 285 070</a>
        </p>
        <p>Mirage Towers, Nairobi · © {new Date().getFullYear()} WykSofts Inc.</p>
      </footer>
    </main>
  );
}
