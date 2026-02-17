"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "../lib/i18n";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://portfolio-alex-2h4y.onrender.com';

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);

      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("access_token", data.access_token);
        router.push("/");
      } else {
        const errorData = await response.json();
        setError(errorData.detail || t('login.loginFailed'));
      }
    } catch (err) {
      setError(t('login.serverError'));
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'var(--background)', 
      color: 'var(--foreground)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.05,
        backgroundImage: 'radial-gradient(circle at 20% 50%, var(--primary) 0%, transparent 50%), radial-gradient(circle at 80% 80%, var(--secondary) 0%, transparent 50%)',
        pointerEvents: 'none',
      }} />

      <div style={{ 
        maxWidth: '450px', 
        width: '100%',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Logo/Title */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <a href="/" style={{ 
            fontSize: '1.5rem', 
            fontWeight: '700',
            color: 'var(--foreground)',
            textDecoration: 'none',
            display: 'inline-block',
            marginBottom: '0.5rem'
          }}>
            ← Portfolio
          </a>
        </div>

        {/* Login Card */}
        <div className="card" style={{ 
          padding: '2.5rem',
          animation: 'fadeIn 0.6s ease-out'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '64px',
              height: '64px',
              background: 'var(--gradient-primary)',
              borderRadius: '50%',
              marginBottom: '1.5rem',
              boxShadow: 'var(--shadow-lg)',
            }}>
              <svg
                style={{ width: '32px', height: '32px', color: 'white' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h2 style={{ 
              fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', 
              fontWeight: '700',
              marginBottom: '0.5rem',
            }}>
              {t('login.title')}
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>
              {t('home.signInLabel')}
            </p>
          </div>

          {error && (
            <div style={{
              marginBottom: '1.5rem',
              padding: '1rem',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid var(--error)',
              borderRadius: 'var(--radius-md)',
              animation: 'slideInFromLeft 0.3s ease-out'
            }}>
              <p style={{
                color: 'var(--error)',
                fontSize: '0.9rem',
                fontWeight: '500',
                textAlign: 'center',
                margin: 0
              }}>
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: '600',
                marginBottom: '0.5rem',
                color: 'var(--foreground)'
              }}>
                {t('login.username')}
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
                placeholder={t('login.enterUsername')}
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  fontSize: '1rem',
                  background: 'var(--background)',
                  border: '2px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--foreground)',
                  transition: 'var(--transition-fast)',
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--primary)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: '600',
                marginBottom: '0.5rem',
                color: 'var(--foreground)'
              }}>
                {t('login.password')}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  fontSize: '1rem',
                  background: 'var(--background)',
                  border: '2px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--foreground)',
                  transition: 'var(--transition-fast)',
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--primary)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn"
              style={{
                width: '100%',
                padding: '1rem',
                fontSize: '1rem',
                fontWeight: '600',
                background: isLoading ? 'var(--muted)' : 'var(--primary)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-lg)',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.6 : 1,
                transition: 'var(--transition-base)',
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.background = 'var(--primary-hover)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.background = 'var(--primary)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              {isLoading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <svg
                    className="animate-spin"
                    style={{ width: '20px', height: '20px' }}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      style={{ opacity: 0.25 }}
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      style={{ opacity: 0.75 }}
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {t('login.authenticating')}
                </span>
              ) : (
                t('login.signIn')
              )}
            </button>
          </form>

          <div style={{
            marginTop: '2rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--border)',
            textAlign: 'center'
          }}>
          </div>
        </div>
      </div>
    </div>
  );
}
