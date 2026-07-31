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
  {
    phrase: "move businesses",
    label: "Grow",
    detail: "Digital foundations designed to unlock the next stage of growth.",
  },
  {
    phrase: "delight customers",
    label: "Delight",
    detail: "Fast, thoughtful experiences people enjoy coming back to.",
  },
  {
    phrase: "simplify work",
    label: "Simplify",
    detail: "Purpose-built tools that make complex operations feel effortless.",
  },
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
    hero.style.setProperty("--shift-x", `${((x / bounds.width) - 0.5) * 8}px`);
    hero.style.setProperty("--shift-y", `${((y / bounds.height) - 0.5) * 8}px`);
  }

  function resetHeroPointer() {
    const hero = heroRef.current;
    if (!hero) return;

    hero.style.setProperty("--tilt-x", "0deg");
    hero.style.setProperty("--tilt-y", "0deg");
    hero.style.setProperty("--shift-x", "0px");
    hero.style.setProperty("--shift-y", "0px");
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
          <a href="#about">About</a>
          <a href="#careers">Careers</a>
          <a href="#policies">Policies</a>
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
              aria-label={`Change outcome. Currently: ${heroOutcomes[outcomeIndex].phrase}`}
            >
              <em key={heroOutcomes[outcomeIndex].phrase} aria-live="polite">
                {heroOutcomes[outcomeIndex].phrase}
              </em>
            </button>{" "}
            forward.
          </h1>
          <div className="outcome-explorer">
            <div className="outcome-tabs" role="group" aria-label="Choose an outcome">
              {heroOutcomes.map((outcome, index) => (
                <button
                  className={index === outcomeIndex ? "active" : ""}
                  type="button"
                  key={outcome.phrase}
                  onClick={() => setOutcomeIndex(index)}
                  aria-pressed={index === outcomeIndex}
                >
                  <span>0{index + 1}</span>
                  {outcome.label}
                </button>
              ))}
            </div>
            <p key={heroOutcomes[outcomeIndex].detail} aria-live="polite">
              {heroOutcomes[outcomeIndex].detail}
            </p>
          </div>
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
          <div className="hero-actions hero-actions-interactive">
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
            <div className="company-facts" aria-label="Company information">
              <div>
                <span>Based in</span>
                <strong>Mirage Towers, Nairobi</strong>
              </div>
              <div>
                <span>Working model</span>
                <strong>Local insight, global delivery</strong>
              </div>
              <div>
                <span>Core disciplines</span>
                <strong>Strategy, design & engineering</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="careers section" id="careers">
        <div className="careers-copy">
          <p className="section-kicker light">Careers at WykSofts</p>
          <h2>Do work you&apos;re proud to put your name on.</h2>
          <p>
            We are building a thoughtful, dependable team around product
            strategy, design, software engineering, quality assurance, and
            project delivery. We value curiosity, ownership, clear
            communication, and respect for the people using what we build.
          </p>
        </div>
        <aside className="careers-panel">
          <div className="careers-status">
            <span className="pulse" />
            Open to exceptional people
          </div>
          <h3>Don&apos;t see a listed role?</h3>
          <p>
            Send a short introduction, your area of expertise, and links to
            work you are proud of. We review open applications as suitable
            opportunities arise.
          </p>
          <div className="career-tags" aria-label="Areas of interest">
            <span>Engineering</span>
            <span>Product design</span>
            <span>Quality assurance</span>
            <span>Project delivery</span>
          </div>
          <a
            className="button careers-button"
            href="mailto:support@mynomp.com?subject=Careers%20at%20WykSofts&body=Name%3A%0AArea%20of%20expertise%3A%0APortfolio%20or%20profile%20link%3A%0AShort%20introduction%3A"
          >
            Introduce yourself
            <span aria-hidden="true">↗</span>
          </a>
          <small>
            General applications are not a promise of immediate employment.
          </small>
        </aside>
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

      <section className="policies section" id="policies">
        <div className="policies-intro">
          <p className="section-kicker">Working together</p>
          <h2>Clear expectations make better projects.</h2>
          <p>
            These summaries explain our usual way of working. Every engagement
            is governed by the quotation, statement of work, or agreement
            accepted by both parties; that signed document takes priority if
            anything differs.
          </p>
          <span className="policy-date">Last updated 31 July 2026</span>
        </div>

        <div className="policy-list">
          <details open>
            <summary>
              <span>01</span>
              Terms of engagement
              <b aria-hidden="true">+</b>
            </summary>
            <div>
              <p>
                Work begins after scope, deliverables, responsibilities,
                timeline, and payment milestones are agreed. Requests outside
                that scope are estimated and approved before they are added.
              </p>
              <p>
                Unless an agreement says otherwise, ownership of custom work
                transfers after full payment. Third-party software, fonts,
                services, and open-source components remain subject to their
                own licences.
              </p>
            </div>
          </details>

          <details>
            <summary>
              <span>02</span>
              Project cancellation
              <b aria-hidden="true">+</b>
            </summary>
            <div>
              <p>
                Either party may request cancellation in writing. The final
                account will cover work completed, approved milestones, and
                non-recoverable third-party costs committed for the project.
              </p>
              <p>
                Paid-for work and available project materials are handed over
                in a reasonable format. Any unused balance or outstanding
                amount is handled according to the accepted quotation or
                agreement.
              </p>
            </div>
          </details>

          <details>
            <summary>
              <span>03</span>
              Privacy & data
              <b aria-hidden="true">+</b>
            </summary>
            <div>
              <p>
                We use information you send us to respond to enquiries,
                prepare quotations, deliver agreed work, and manage legitimate
                business records. We aim to collect only what is necessary and
                do not sell personal information.
              </p>
              <p>
                This website currently has no onsite contact form or advertising
                trackers. Email and telephone communications are also handled by
                the providers you choose to use. Privacy questions can be sent
                to support@mynomp.com.
              </p>
              <a
                href="https://new.kenyalaw.org/akn/ke/act/2019/24/eng@2022-12-31"
                target="_blank"
                rel="noreferrer"
              >
                Kenya Data Protection Act ↗
              </a>
            </div>
          </details>

          <details>
            <summary>
              <span>04</span>
              Support & warranties
              <b aria-hidden="true">+</b>
            </summary>
            <div>
              <p>
                Testing, launch support, defect correction periods, maintenance,
                and service levels are defined per project. Ongoing support is
                available through a separate maintenance plan or agreed support
                arrangement.
              </p>
              <p>
                We cannot guarantee uninterrupted operation of services
                controlled by third parties, but we communicate issues clearly
                and help identify practical next steps.
              </p>
            </div>
          </details>
        </div>
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

      <footer className="site-footer">
        <div className="footer-overview">
          <a className="brand footer-brand" href="#top">
            <span className="brand-mark" aria-hidden="true">
              W
            </span>
            <span>WykSofts Inc.</span>
          </a>
          <p>
            Digital products built with clear thinking, careful design, and
            dependable engineering.
          </p>
        </div>
        <div className="footer-column">
          <h3>Company</h3>
          <a href="#about">About</a>
          <a href="#clients">Clients</a>
          <a href="#careers">Careers</a>
        </div>
        <div className="footer-column">
          <h3>Work with us</h3>
          <a href="#services">Services</a>
          <a href="#pricing">Pricing</a>
          <a href="#contact">Contact</a>
        </div>
        <div className="footer-column">
          <h3>Policies</h3>
          <a href="#policies">Terms</a>
          <a href="#policies">Cancellation</a>
          <a href="#policies">Privacy</a>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} WykSofts Inc. All rights reserved.</p>
          <p>Mirage Towers, Nairobi</p>
          <p>
            <a href="mailto:support@mynomp.com">support@mynomp.com</a>
            {" · "}
            <a href="tel:+254703285070">+254 703 285 070</a>
          </p>
        </div>
      </footer>
    </main>
  );
}
