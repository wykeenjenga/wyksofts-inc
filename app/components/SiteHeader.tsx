import Link from "next/link";
import { BrandMark } from "./BrandMark";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="WykSofts Inc. home">
        <BrandMark />
        <span>WykSofts Inc.</span>
      </Link>
      <nav className="main-nav" aria-label="Primary navigation">
        <Link href="/services/">Services</Link>
        <Link href="/clients/">Clients</Link>
        <Link href="/pricing/">Pricing</Link>
        <Link href="/about/">About</Link>
      </nav>
      <Link className="nav-cta" href="/inquiry/">
        Start a project <span aria-hidden="true">↗</span>
      </Link>
    </header>
  );
}
