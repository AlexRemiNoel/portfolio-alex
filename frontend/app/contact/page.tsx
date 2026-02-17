"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "../lib/i18n";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://portfolio-alex-2h4y.onrender.com';

export default function ContactPage() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState("");
  const [portfolioEmail, setPortfolioEmail] = useState("");

  useEffect(() => {
    loadPortfolio();
  }, [language]);

  const loadPortfolio = async () => {
    try {
      const response = await fetch(`${API_URL}/portfolio?language=${language}`);
      if (response.ok) {
        const data = await response.json();
        setPortfolioEmail(data.data.contact.email || "");
      }
    } catch (err) {
      console.error("Failed to load portfolio email:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSubmitSuccess(false);

    try {
      const response = await fetch(`${API_URL}/contact/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
        }),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
        setTimeout(() => {
          router.push("/");
        }, 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.detail || t('contact.failedToSend'));
      }
    } catch (err) {
      setError(t('login.serverError'));
      console.error("Submit error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)', color: 'var(--foreground)' }}>
      {/* Navigation */}
      <Navbar
        isAuthenticated={false}
        isEditing={false}
        portfolioName={t('contact.title')}
        showFullNav={true}
      />

      <main style={{ maxWidth: '700px', margin: '0 auto', padding: 'clamp(1.5rem, 5vw, 3rem) 1.5rem' }}>
        {submitSuccess ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', animation: 'fadeIn 0.6s ease-out' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '80px',
              height: '80px',
              background: 'var(--success)',
              borderRadius: '50%',
              marginBottom: '2rem',
              boxShadow: 'var(--shadow-lg)',
              animation: 'scaleIn 0.5s ease-out'
            }}>
              <svg
                style={{ width: '40px', height: '40px', color: 'white' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: '700', marginBottom: '1rem' }}>
              {t('contact.success')}
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '1.125rem', marginBottom: '2rem' }}>
              {t('contact.successMessage')}
            </p>
            <a
              href="/"
              className="btn"
              style={{
                display: 'inline-block',
                padding: '0.875rem 2rem',
                background: 'var(--primary)',
                color: 'white',
                borderRadius: 'var(--radius-lg)',
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'var(--transition-base)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--primary-hover)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--primary)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {t('common.back')}
            </a>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '3rem', animation: 'fadeIn 0.6s ease-out' }}>
              <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: '700', marginBottom: '1rem' }}>
                {t('contact.pageTitle')}
              </h2>
              <p style={{ color: 'var(--muted)', fontSize: '1.125rem', lineHeight: '1.7' }}>
                {t('contact.description')}
              </p>
            </div>

            {portfolioEmail && (
              <div style={{
                marginBottom: '2rem',
                padding: '1rem',
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid var(--primary)',
                borderRadius: 'var(--radius-md)',
                animation: 'slideInFromLeft 0.4s ease-out'
              }}>
                <p style={{ fontSize: '0.9rem', margin: 0 }}>
                  {t('contact.sentTo')}{' '}
                  <span style={{ fontWeight: '600', color: 'var(--primary)' }}>
                    {portfolioEmail}
                  </span>
                </p>
              </div>
            )}

            {error && (
              <div style={{
                marginBottom: '2rem',
                padding: '1rem',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid var(--error)',
                borderRadius: 'var(--radius-md)',
                animation: 'slideInFromLeft 0.3s ease-out'
              }}>
                <p style={{ color: 'var(--error)', fontWeight: '500', margin: 0 }}>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="card" style={{ padding: 'clamp(1.5rem, 4vw, 2rem)' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem'
                }}>
                  {t('contact.name')}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  maxLength={100}
                  placeholder={t('contact.namePlaceholder')}
                  disabled={isSubmitting}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem'
                }}>
                  {t('contact.email')}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder={t('contact.emailPlaceholder')}
                  disabled={isSubmitting}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem'
                }}>
                  {t('contact.subject')}
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  maxLength={200}
                  placeholder={t('contact.subjectPlaceholder')}
                  disabled={isSubmitting}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem'
                }}>
                  {t('contact.message')}
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  maxLength={2000}
                  rows={8}
                  placeholder={t('contact.messagePlaceholder')}
                  disabled={isSubmitting}
                />
                <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '0.5rem', marginBottom: 0 }}>
                  {message.length}{t('contact.charactersOf')}
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn"
                style={{
                  width: '100%',
                  padding: 'clamp(0.75rem, 2vw, 1rem)',
                  background: isSubmitting ? 'var(--muted)' : 'var(--primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius-lg)',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                  opacity: isSubmitting ? 0.6 : 1,
                }}
              >
                {isSubmitting ? (
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
                    {t('common.sending')}
                  </span>
                ) : (
                  t('contact.sendButton')
                )}
              </button>
            </form>
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        year="2026"
        name="Portfolio"
        isEditing={false}
      />
    </div>
  );
}