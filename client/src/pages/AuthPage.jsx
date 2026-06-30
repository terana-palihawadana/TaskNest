import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import TaskNestLogo from '../components/TaskNestLogo';
import './AuthPage.css';

function AuthPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, register, isAuthenticated } = useAuth();

    const isRegister = location.pathname === '/register';
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
    });

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            if (isRegister) {
                await register({
                    name: form.name,
                    email: form.email,
                    password: form.password,
                });
            } else {
                await login({
                    email: form.email,
                    password: form.password,
                });
            }
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="auth-page">
            <section className="auth-brand">
                <div className="auth-brand-content">
                    <div className="auth-brand-logo">
                        <TaskNestLogo size={48} />
                    </div>
                    <h1>TaskNest</h1>
                    <p className="auth-brand-text">
                        Reclaim your focus. Organize your day in a space designed for
                        intentional productivity and calm execution.
                    </p>
                    <div className="auth-brand-feature">
                        <span className="auth-check-icon" aria-hidden="true">
                            ✓
                        </span>
                        <span>Streamlined workflow for deep work</span>
                    </div>
                </div>
            </section>

            <section className="auth-panel">
                <div className="auth-card">
                    <div className="auth-tabs">
                        <Link
                            to="/login"
                            className={`auth-tab ${!isRegister ? 'auth-tab-active' : ''}`}
                        >
                            Sign In
                        </Link>
                        <Link
                            to="/register"
                            className={`auth-tab ${isRegister ? 'auth-tab-active' : ''}`}
                        >
                            Create Account
                        </Link>
                    </div>

                    <p className="auth-subtitle">
                        Enter your credentials to access your personal workspace.
                    </p>

                    {error && <div className="auth-error">{error}</div>}

                    <form className="auth-form" onSubmit={handleSubmit}>
                        {isRegister && (
                            <div className="auth-field">
                                <label htmlFor="name">Full Name</label>
                                <div className="auth-input-wrap">
                                    <span className="auth-input-icon" aria-hidden="true">
                                        <UserIcon />
                                    </span>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="John Doe"
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <div className="auth-field">
                            <label htmlFor="email">Email{isRegister ? ' Address' : ''}</label>
                            <div className="auth-input-wrap">
                                <span className="auth-input-icon" aria-hidden="true">
                                    <MailIcon />
                                </span>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="your@email.com"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="auth-field">
                            <label htmlFor="password">
                                {isRegister ? 'Create Password' : 'Password'}
                            </label>
                            <div className="auth-input-wrap">
                                <span className="auth-input-icon" aria-hidden="true">
                                    <LockIcon />
                                </span>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={handleChange}
                                    minLength={6}
                                    required
                                />
                                <button
                                    type="button"
                                    className="auth-password-toggle"
                                    onClick={() => setShowPassword((show) => !show)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    <EyeIcon />
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="auth-submit" disabled={submitting}>
                            {isRegister
                                ? 'Create TaskNest Account →'
                                : 'Continue to TaskNest →'}
                        </button>
                    </form>
                </div>

                <p className="auth-legal">
                    By continuing, you agree to TaskNest&apos;s{' '}
                    <span>Terms of Service</span> and <span>Privacy Policy</span>.
                </p>
            </section>
        </div>
    );
}

function UserIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
            <path
                d="M5 20c1.5-3.5 12.5-3.5 14 0"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
            />
        </svg>
    );
}

function MailIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
            <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
    );
}

function LockIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
            <path
                d="M8 11V8a4 4 0 118 0v3"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
            />
        </svg>
    );
}

function EyeIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
                d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"
                stroke="currentColor"
                strokeWidth="1.8"
            />
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
        </svg>
    );
}

export default AuthPage;
