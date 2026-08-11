import { HomeHero } from "./components/HomeHero";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import { organizationSchema, projects, services } from "./data/site";

export default function Home() {
  return (
    <main>
      <SiteHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <HomeHero />
      <section className="home-services section">
        <div className="home-section-lead">
          <p className="section-kicker">What we build</p>
          <h2>Product thinking from idea to launch.</h2>
          <p>One focused team for strategy, design, engineering, launch, and the next stage of growth.</p>
          <a className="text-link" href="/services/">Explore all services <span aria-hidden="true">↗</span></a>
        </div>
        <div className="home-service-grid">
          {services.slice(0, 3).map((service) => <article key={service.number}><span>{service.number}</span><h3>{service.title}</h3><p>{service.description}</p></article>)}
        </div>
      </section>
      <section className="home-proof section">
        <div className="home-proof-copy">
          <p className="section-kicker light">Selected clients</p>
          <h2>Built for real customers and real operations.</h2>
          <p>Explore product work across focus technology, restaurant ordering, rewards, and mobile customer experiences.</p>
          <a className="button button-primary" href="/clients/">View client work <span aria-hidden="true">↗</span></a>
        </div>
        <div className="home-client-list">
          {projects.map((project) => <a href={project.href} target="_blank" rel="noreferrer" key={project.name}><span>{project.number}</span><strong>{project.name}</strong><small>{project.type}</small><b aria-hidden="true">↗</b></a>)}
        </div>
      </section>
      <section className="home-cta section">
        <p className="section-kicker">Have a project in mind?</p>
        <h2>Let&apos;s make the next move clear.</h2>
        <p>Tell us where you are today and what a great result would look like.</p>
        <div><a className="button button-primary" href="/inquiry/">Start a project <span>↗</span></a><a className="text-link" href="/book/">Book a discovery call <span>↗</span></a></div>
      </section>
      <SiteFooter />
    </main>
  );
}
