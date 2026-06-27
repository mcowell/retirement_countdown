import { useAuth } from "./useAuth";

interface NavProps {
  current: "main" | "admin";
}

const ADMIN_EMAIL = "mcowell@gmail.com";

export default function Nav({ current }: NavProps) {
  const { session, signInWithGoogle, signOut } = useAuth();
  const isAdmin = session?.user?.email === ADMIN_EMAIL;

  const mainClass = current === "main" ? "site-nav__link is-active" : "site-nav__link";
  const adminClass = current === "admin" ? "site-nav__link is-active" : "site-nav__link";

  return (
    <nav className="site-nav">
      <span className="site-nav__brand">Retirement</span>
      <div className="site-nav__links">
        <a href="/" className={mainClass}>Main</a>
        {isAdmin && <a href="/admin" className={adminClass}>Admin</a>}
        {session ? (
          <button className="site-nav__link site-nav__button" onClick={signOut}>
            Sign out
          </button>
        ) : (
          <button className="site-nav__link site-nav__button" onClick={signInWithGoogle}>
            Sign in
          </button>
        )}
      </div>
    </nav>
  );
}