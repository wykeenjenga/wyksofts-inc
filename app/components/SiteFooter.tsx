import Link from "next/link";
import { BrandMark } from "./BrandMark";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-overview">
        <Link className="brand footer-brand" href="/">
          <BrandMark />
          <span>WykSofts Inc.</span>
        </Link>
        <p>Digital products built with clear thinking, careful design, and dependable engineering.</p>
      </div>
      <div className="footer-column">
        <h3>Explore</h3>
        <Link href="/services/">Services</Link>
        <Link href="/clients/">Clients</Link>
        <Link href="/pricing/">Pricing</Link>
        <Link href="/about/">About</Link>
      </div>
      <div className="footer-column">
        <h3>Company</h3>
        <Link href="/careers/">Careers</Link>
        <Link href="/faq/">FAQ</Link>
        <Link href="/policies/">Policies</Link>
        <Link href="/book/">Discovery call</Link>
      </div>
      <div className="footer-column">
        <h3>Contact</h3>
        <a href="mailto:hello@wyksoftsinc.com">hello@wyksoftsinc.com</a>
        <a href="tel:+254703285070">+254 703 285 070</a>
        <a href="https://wa.me/254703285070" target="_blank" rel="noreferrer">WhatsApp ↗</a>
        <a href="https://www.google.com/maps/search/?api=1&query=Mirage+Towers+Nairobi" target="_blank" rel="noreferrer">Mirage Towers, Nairobi ↗</a>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} WykSofts Inc. All rights reserved.</p>
        <p>Strategy · Design · Engineering</p>
        <p><Link href="/policies/">Terms &amp; privacy</Link></p>
      </div>
    </footer>
  );
}
