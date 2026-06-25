interface NavProps {
  current: "main" | "admin";
}

export default function Nav({ current }: NavProps) {
  const mainClass = current === "main" ? "site-nav__link is-active" : "site-nav__link";
  const adminClass = current === "admin" ? "site-nav__link is-active" : "site-nav__link";

  return (
    <nav className="site-nav">
      <span className="site-nav__brand">Retirement</span>
      <div className="site-nav__links">
        <a href="/" className={mainClass}>Main</a>
        <a href="/admin" className={adminClass}>Admin</a>
      </div>
    </nav>
  );
}