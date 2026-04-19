import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import AuthShell from './AuthShell';

const SignIn = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [status, setStatus] = useState({ error: '', info: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (status.error || status.info) {
      setStatus({ error: '', info: '' });
    }

    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ error: '', info: '' });

    try {
      const res = await api.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('authUser', JSON.stringify(res.data.user));
      navigate('/resume');
    } catch (err) {
      setStatus({
        error: err.response?.data?.error || 'Unable to sign you in.',
        info: '',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Pick up where your last resume left off."
      subtitle="Sign in to continue editing, refining, and exporting your next application-ready draft."
      alternateText="Need an account?"
      alternateLabel="Sign up"
      alternateLink="/signup"
    >
      <div className="auth-card__header">
        <h2>Sign in</h2>
        <p>Enter your credentials to access the resume builder.</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <label className="auth-field">
          <span>Email</span>
          <input
            name="email"
            placeholder="name@example.com"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>

        <label className="auth-field">
          <span>Password</span>
          <input
            name="password"
            placeholder="Enter your password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>

        {status.error ? <p className="auth-message auth-message--error">{status.error}</p> : null}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </AuthShell>
  );
};

export default SignIn;
