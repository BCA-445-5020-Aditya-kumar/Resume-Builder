import { Link } from 'react-router-dom';

const AuthShell = ({
  eyebrow,
  title,
  subtitle,
  alternateLabel,
  alternateLink,
  alternateText,
  children,
}) => {
  return (
    <main className="auth-page">
      <section className="auth-hero">
        <div className="auth-hero__content">
          <span className="auth-eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{subtitle}</p>
          <div className="auth-hero__panel">
            <span className="auth-hero__stat">Fast setup</span>
            <span className="auth-hero__stat">Secure access</span>
            <span className="auth-hero__stat">Resume-ready</span>
          </div>
        </div>
      </section>

      <section className="auth-card-wrapper">
        <div className="auth-card">
          {children}
          <p className="auth-switch">
            {alternateText} <Link to={alternateLink}>{alternateLabel}</Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default AuthShell;
