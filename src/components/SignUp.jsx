import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import AuthShell from './AuthShell';

const SignUp = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [status, setStatus] = useState({ error: '', success: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (status.error || status.success) {
      setStatus({ error: '', success: '' });
    }

    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ error: '', success: '' });

    try {
      const response = await api.post('/auth/register', form);
      setStatus({
        error: '',
        success: response.data.message || 'Account created successfully.',
      });
      setTimeout(() => navigate('/signin'), 800);
    } catch (err) {
      setStatus({
        error: err.response?.data?.error || 'Unable to create your account right now.',
        success: '',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Create your profile"
      title="Start building resumes that feel polished."
      subtitle="Create an account to save your progress and jump straight into the builder."
      alternateText="Already have an account?"
      alternateLabel="Sign in"
      alternateLink="/signin"
    >
      <div className="auth-card__header">
        <h2>Create account</h2>
        <p>Use your email and a secure password to get started.</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <label className="auth-field">
          <span>Username</span>
          <input
            name="username"
            placeholder="Enter your username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </label>

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
            placeholder="At least 6 characters"
            type="password"
            value={form.password}
            onChange={handleChange}
            minLength={6}
            required
          />
        </label>

        {status.error ? <p className="auth-message auth-message--error">{status.error}</p> : null}
        {status.success ? <p className="auth-message auth-message--success">{status.success}</p> : null}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account...' : 'Sign up'}
        </button>
      </form>
    </AuthShell>
  );
};

export default SignUp;
