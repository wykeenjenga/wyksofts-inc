import type { Metadata } from "next";
import Image from "next/image";
import { MarketingPage } from "../components/MarketingPage";
import { projects } from "../data/site";

export const metadata: Metadata = { title: "Client Work | WykSofts Inc.", description: "Selected mobile and web products delivered by WykSofts Inc." };

export default function ClientsPage() {
  return (
    <MarketingPage eyebrow="Selected clients" title="Products made for people to use, trust, and return to." intro="A selection of mobile and web experiences shaped around customer needs, brand goals, and reliable everyday use.">
      <section className="clients section"><div className="project-grid">{projects.map((project) => <article className="project-card" key={project.name}><div className="project-meta"><span>{project.number}</span><span>{project.type}</span></div><div className={`project-visual project-visual-${project.number}`}><Image src={project.image} alt={project.imageAlt} width={project.imageWidth} height={project.imageHeight} unoptimized /></div><div className="project-body"><h3>{project.name}</h3><p>{project.summary}</p><dl><div><dt>Challenge</dt><dd>{project.challenge}</dd></div><div><dt>Delivered</dt><dd>{project.delivered}</dd></div></dl><div className="project-capabilities">{project.capabilities.map((capability) => <span key={capability}>{capability}</span>)}</div><a className="project-link" href={project.href} target="_blank" rel="noreferrer">View live product <b aria-hidden="true">↗</b></a></div></article>)}</div></section>
    </MarketingPage>
  );
}
