export function PortalHeader({ label }: { label: string }) {
  return (
    <header className="portal-header">
      <a className="brand" href="/" aria-label="WykSofts Inc. home">
        <span className="brand-mark" aria-hidden="true">W</span>
        <span>WykSofts Inc.</span>
      </a>
      <span className="portal-header-label">{label}</span>
      <a className="portal-home-link" href="/">
        Back to website <span aria-hidden="true">↗</span>
      </a>
    </header>
  );
}
