"use client";

import {
  useRef,
  useState,
  type FormEvent,
  type PointerEvent,
} from "react";

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
    image: "./projects/mynomp-mark.svg",
    imageAlt: "Mynomp Spark product mark",
    challenge: "Turn focused work into a repeatable, social habit.",
    delivered: "Product experience, accountability flows, and a responsive web platform.",
    capabilities: ["Product design", "Web platform", "Focus experience"],
  },
  {
    number: "02",
    name: "City BBQ App",
    type: "iOS & iPadOS app",
    summary:
      "A customer-focused mobile experience designed around convenient ordering and brand engagement.",
    href: "https://apps.apple.com/us/app/city-barbeque/id979145837",
    image: "./projects/city-barbeque.jpg",
    imageAlt: "City Barbeque rewards and mobile ordering app interface",
    challenge: "Make ordering, rewards, and repeat purchases feel effortless.",
    delivered: "An iOS and iPadOS ordering experience with loyalty at its core.",
    capabilities: ["iOS", "iPadOS", "Ordering", "Rewards"],
  },
  {
    number: "03",
    name: "SlimChickens App",
    type: "iOS app",
    summary:
      "A polished restaurant app experience that brings menu discovery and customer interaction together.",
    href: "https://apps.apple.com/us/app/slim-chickens/id1244055810",
    image: "./projects/slim-chickens.jpg",
    imageAlt: "Slim Chickens application icon",
    challenge: "Bring ordering, favourites, offers, and rewards into one experience.",
    delivered: "A customer-facing iOS application designed for speed and repeat use.",
    capabilities: ["iOS", "Mobile ordering", "Offers", "Loyalty"],
  },
];

const packages = [
  {
    name: "Launch",
    price: "From $100",
    type: "Landing page or focused website",
    description: "A focused digital launch for a clear offer, campaign, or early-stage business.",
    items: ["Responsive build", "Core SEO setup", "Contact conversion path"],
  },
  {
    name: "Grow",
    price: "Scoped quotation",
    type: "Business website or web application",
    description: "A stronger web presence or workflow designed around business growth.",
    items: ["Product strategy", "Custom interface", "Integrations & analytics"],
  },
  {
    name: "Product",
    price: "Scoped quotation",
    type: "Mobile app or custom software",
    description: "A complete product engagement for ambitious, operationally important ideas.",
    items: ["Discovery & UX", "Software engineering", "Launch & support plan"],
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

const faqs = [
  {
    question: "How much does a project cost?",
    answer:
      "Focused landing-page work starts from $100. Business websites, mobile apps, web platforms, and custom software are quoted after the scope, integrations, content, timeline, and support needs are understood.",
  },
  {
    question: "How long will my project take?",
    answer:
      "A focused landing page may take around one to three weeks when content and feedback are ready. Larger websites and software products are planned in milestones, with a realistic delivery schedule included in the quotation.",
  },
  {
    question: "Can you improve an existing website or app?",
    answer:
      "Yes. We can review an existing product, identify the highest-value improvements, modernize the interface, add features, improve performance, or help stabilize its technical foundation.",
  },
  {
    question: "Who owns the finished work?",
    answer:
      "Ownership is defined in the accepted agreement. Unless stated otherwise, ownership of custom deliverables transfers after full payment, while third-party and open-source components remain under their original licences.",
  },
  {
    question: "Do you provide maintenance and support?",
    answer:
      "Yes. Launch assistance, defect correction, ongoing maintenance, feature development, monitoring, and service levels can be included in the project or arranged as a separate support plan.",
  },
  {
    question: "How do payments work?",
    answer:
      "Payment structure depends on the project. Larger engagements are normally divided into agreed milestones, while smaller focused work may use a simpler payment schedule. The quotation confirms the exact arrangement before work begins.",
  },
  {
    question: "Will you keep my idea confidential?",
    answer:
      "We treat project information as confidential and can review a reasonable non-disclosure agreement before sensitive discovery. Access to project materials is limited to people involved in delivering the engagement.",
  },
  {
    question: "Can WykSofts work with teams outside Nairobi?",
    answer:
      "Yes. We are based at Mirage Towers in Nairobi and can collaborate remotely with clients and teams in other regions through scheduled calls, written updates, shared project tools, and milestone reviews.",
  },
];

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "WykSofts Inc.",
  url: "https://wykeenjenga.github.io/wyksofts-inc/",
  email: "support@mynomp.com",
  telephone: "+254703285070",
  priceRange: "From USD 100",
  description:
    "Software development company building mobile apps, websites, custom software, integrations, AI solutions, and cloud platforms.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Mirage Towers",
    addressLocality: "Nairobi",
    addressCountry: "KE",
  },
  areaServed: "Worldwide",
};

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const [outcomeIndex, setOutcomeIndex] = useState(0);
  const [quote, setQuote] = useState({
    projectType: packages[0].type,
    budget: "$100–$500",
    timeline: "Within 1 month",
    name: "",
    email: "",
    message: "",
  });

  const quoteMessage = [
    "Hello WykSofts, I would like a quotation.",
    "",
    `Name: ${quote.name || "Not provided"}`,
    `Email: ${quote.email || "Not provided"}`,
    `Project type: ${quote.projectType}`,
    `Budget: ${quote.budget}`,
    `Timeline: ${quote.timeline}`,
    `Project details: ${quote.message || "I would like to discuss the requirements."}`,
  ].join("\n");

  const whatsappQuoteHref = `https://wa.me/254703285070?text=${encodeURIComponent(quoteMessage)}`;

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

  function updateQuote(field: keyof typeof quote, value: string) {
    setQuote((current) => ({ ...current, [field]: value }));
  }

  function handleQuoteSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    window.location.href = `mailto:support@mynomp.com?subject=${encodeURIComponent(
      `WykSofts quotation — ${quote.projectType}`,
    )}&body=${encodeURIComponent(quoteMessage)}`;
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
          <a href="#faq">FAQ</a>
        </nav>

        <a className="nav-cta" href="#pricing">
          Get a quotation
          <span aria-hidden="true">↗</span>
        </a>
      </header>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

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
            <article className="project-card" key={project.name}>
              <div className="project-meta">
                <span>{project.number}</span>
                <span>{project.type}</span>
              </div>
              <div className={`project-visual project-visual-${project.number}`}>
                <img src={project.image} alt={project.imageAlt} />
              </div>
              <div className="project-body">
                <h3>{project.name}</h3>
                <p>{project.summary}</p>
                <dl>
                  <div>
                    <dt>Challenge</dt>
                    <dd>{project.challenge}</dd>
                  </div>
                  <div>
                    <dt>Delivered</dt>
                    <dd>{project.delivered}</dd>
                  </div>
                </dl>
                <div className="project-capabilities" aria-label={`${project.name} capabilities`}>
                  {project.capabilities.map((capability) => (
                    <span key={capability}>{capability}</span>
                  ))}
                </div>
                <a
                  className="project-link"
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`View ${project.name} live product`}
                >
                  View live product <b aria-hidden="true">↗</b>
                </a>
              </div>
            </article>
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
        <div className="pricing-heading">
          <p className="section-kicker">Simple starting point</p>
          <h2>Quality digital work, sized for where you are.</h2>
          <p>
            Choose the closest starting point, then tell us about your project.
            We&apos;ll respond with a clear scope, timeline, deliverables, and price.
          </p>
        </div>

        <div className="package-grid">
          {packages.map((item, index) => (
            <button
              className={quote.projectType === item.type ? "package-card active" : "package-card"}
              type="button"
              key={item.name}
              onClick={() => updateQuote("projectType", item.type)}
              aria-pressed={quote.projectType === item.type}
            >
              <span className="package-number">0{index + 1}</span>
              <h3>{item.name}</h3>
              <strong>{item.price}</strong>
              <p>{item.description}</p>
              <ul>
                {item.items.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <span className="package-select">
                {quote.projectType === item.type ? "Selected" : "Choose package"}
              </span>
            </button>
          ))}
        </div>

        <div className="quote-builder" id="quote-builder">
          <div className="quote-builder-intro">
            <p className="section-kicker light">Project planner</p>
            <h3>Build your quotation request.</h3>
            <p>
              This takes about two minutes. Your answers stay in your browser
              until you choose email or WhatsApp—nothing is stored on this site.
            </p>
            <div className="quote-contact-note">
              <span>Prefer to talk?</span>
              <a href="tel:+254703285070">+254 703 285 070</a>
            </div>
          </div>

          <form className="quote-form" onSubmit={handleQuoteSubmit}>
            <label>
              Project type
              <select
                value={quote.projectType}
                onChange={(event) => updateQuote("projectType", event.target.value)}
              >
                {packages.map((item) => (
                  <option key={item.type}>{item.type}</option>
                ))}
                <option>Maintenance or existing product improvements</option>
                <option>Not sure yet</option>
              </select>
            </label>

            <div className="quote-form-row">
              <label>
                Approximate budget
                <select
                  value={quote.budget}
                  onChange={(event) => updateQuote("budget", event.target.value)}
                >
                  <option>$100–$500</option>
                  <option>$500–$2,000</option>
                  <option>$2,000–$5,000</option>
                  <option>$5,000+</option>
                  <option>Help me estimate</option>
                </select>
              </label>
              <label>
                Preferred timeline
                <select
                  value={quote.timeline}
                  onChange={(event) => updateQuote("timeline", event.target.value)}
                >
                  <option>Within 1 month</option>
                  <option>1–3 months</option>
                  <option>3–6 months</option>
                  <option>Flexible</option>
                </select>
              </label>
            </div>

            <div className="quote-form-row">
              <label>
                Your name
                <input
                  type="text"
                  value={quote.name}
                  onChange={(event) => updateQuote("name", event.target.value)}
                  autoComplete="name"
                  required
                />
              </label>
              <label>
                Email address
                <input
                  type="email"
                  value={quote.email}
                  onChange={(event) => updateQuote("email", event.target.value)}
                  autoComplete="email"
                  required
                />
              </label>
            </div>

            <label>
              What would you like to build?
              <textarea
                value={quote.message}
                onChange={(event) => updateQuote("message", event.target.value)}
                placeholder="Share the idea, current problem, important features, and what success looks like."
                rows={5}
                required
              />
            </label>

            <div className="quote-actions">
              <button className="button quote-button" type="submit">
                Continue by email
                <span aria-hidden="true">↗</span>
              </button>
              <a
                className="button whatsapp-button"
                href={whatsappQuoteHref}
                target="_blank"
                rel="noreferrer"
              >
                Continue on WhatsApp
                <span aria-hidden="true">↗</span>
              </a>
            </div>
            <small>
              This creates an enquiry, not a binding order. Final pricing depends
              on scope and requirements.
            </small>
          </form>
        </div>
      </section>

      <section className="faq section" id="faq">
        <div className="faq-heading">
          <p className="section-kicker light">Frequently asked questions</p>
          <h2>Good questions deserve clear answers.</h2>
          <p>
            A quick guide to pricing, timelines, ownership, support, and how we
            work. If your question is more specific, book a short discovery call.
          </p>
        </div>
        <div className="faq-list">
          {faqs.map((item, index) => (
            <details key={item.question} open={index === 0}>
              <summary>
                <span>0{index + 1}</span>
                {item.question}
                <b aria-hidden="true">+</b>
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
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
          <span className="policy-date">Last updated 3 August 2026</span>
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
                The quotation builder works on your device and opens your chosen
                email or WhatsApp application; this website does not store the
                answers you type. Communications are then handled by the provider
                you choose to use. Privacy questions can be sent to
                support@mynomp.com.
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

          <details>
            <summary>
              <span>05</span>
              Confidentiality & security
              <b aria-hidden="true">+</b>
            </summary>
            <div>
              <p>
                Project access is limited to the people involved in delivering
                the engagement. Credentials and sensitive configuration should
                be shared through agreed secure channels and kept out of public
                source-code repositories.
              </p>
              <p>
                Environment separation, backups, access reviews, handover, and
                credential rotation are agreed according to the needs of each
                project. Reasonable non-disclosure agreements can be reviewed
                before sensitive discovery begins.
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
          <div className="contact-primary-actions">
            <a
              className="button contact-button"
              href="mailto:support@mynomp.com?subject=Let%27s%20build%20a%20project"
            >
              Email our team
              <span aria-hidden="true">↗</span>
            </a>
            <a
              className="button discovery-button"
              href="mailto:support@mynomp.com?subject=Book%20a%2030-minute%20WykSofts%20discovery%20call&body=Name%3A%0ACompany%3A%0ATime%20zone%3A%0APreferred%20dates%20and%20times%3A%0AWhat%20I%27d%20like%20to%20discuss%3A"
            >
              Book a discovery call
              <span aria-hidden="true">↗</span>
            </a>
          </div>
          <a className="contact-phone" href="tel:+254703285070">
            +254 703 285 070
          </a>
          <a
            className="contact-whatsapp"
            href="https://wa.me/254703285070?text=Hello%20WykSofts%2C%20I%20would%20like%20to%20discuss%20a%20project."
            target="_blank"
            rel="noreferrer"
          >
            Chat on WhatsApp ↗
          </a>
          <a
            className="office-location"
            href="https://www.google.com/maps/search/?api=1&query=Mirage+Towers+Nairobi"
            target="_blank"
            rel="noreferrer"
          >
            Mirage Towers, Nairobi · Get directions ↗
          </a>
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
          <a href="#faq">FAQ</a>
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
          <a href="#policies">Security</a>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} WykSofts Inc. All rights reserved.</p>
          <p>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Mirage+Towers+Nairobi"
              target="_blank"
              rel="noreferrer"
            >
              Mirage Towers, Nairobi ↗
            </a>
          </p>
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
