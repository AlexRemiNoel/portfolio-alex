"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "../lib/i18n";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://portfolio-alex-2h4y.onrender.com';

interface Feedback {
  id: number;
  name: string;
  email?: string;
  message: string;
  rating?: number;
  is_approved: boolean;
  created_at: string;
}

export default function FeedbackPage() {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [approvedFeedback, setApprovedFeedback] = useState<Feedback[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadApprovedFeedback();
  }, []);

  const loadApprovedFeedback = async () => {
    try {
      const response = await fetch(`${API_URL}/feedback/approved`);
      if (response.ok) {
        const data = await response.json();
        setApprovedFeedback(data);
      }
    } catch (err) {
      console.error("Failed to load feedback:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSubmitSuccess(false);

    try {
      const response = await fetch(`${API_URL}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email: email || null,
          message,
          rating,
        }),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setName("");
        setEmail("");
        setMessage("");
        setRating(5);
        setTimeout(() => setSubmitSuccess(false), 5000);
        loadApprovedFeedback();
      } else {
        setError(t('feedback.failedToSend'));
      }
    } catch (err) {
      setError(t('login.serverError'));
      console.error("Submit error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = ({ rating: currentRating, onRate }: { rating: number; onRate?: (rating: number) => void }) => {
    return (
      <div style={{ display: 'flex', gap: '0.25rem' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRate && onRate(star)}
            disabled={!onRate}
            style={{
              fontSize: '1.5rem',
              background: 'none',
              border: 'none',
              cursor: onRate ? 'pointer' : 'default',
              color: star <= currentRating ? '#fbbf24' : 'var(--muted)',
              transition: 'var(--transition-fast)',
              padding: '0.25rem',
            }}
            onMouseEnter={(e) => onRate && (e.currentTarget.style.color = '#fcd34d')}
            onMouseLeave={(e) => onRate && (e.currentTarget.style.color = star <= currentRating ? '#fbbf24' : 'var(--muted)')}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, var(--background) 0%, rgba(0,0,0,0.03) 100%)', color: 'var(--foreground)' }}>
      {/* Navigation */}
      <Navbar
        isAuthenticated={false}
        isEditing={false}
        portfolioName={t('feedback.title')}
        showFullNav={true}
      />

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: 'clamp(1.5rem, 5vw, 3rem) 1.5rem' }}>
        {/* Submit Feedback Form */}
        <section style={{ marginBottom: '5rem' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: '700', marginBottom: '1.5rem' }}>
            {t('feedback.leaveTitle')}
          </h2>
          
          {submitSuccess && (
            <div style={{
              marginBottom: '1.5rem',
              padding: '1rem',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid var(--success)',
              borderRadius: 'var(--radius-md)',
              animation: 'slideInFromLeft 0.3s ease-out'
            }}>
              <p style={{ color: 'var(--success)', fontWeight: '500', margin: 0 }}>
                {t('feedback.success')}
              </p>
            </div>
          )}

          {error && (
            <div style={{
              marginBottom: '1.5rem',
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
                {t('feedback.name')}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={100}
                placeholder={t('feedback.namePlaceholder')}
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
                {t('feedback.email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={100}
                placeholder={t('feedback.emailPlaceholder')}
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
                {t('feedback.rating')}
              </label>
              <StarRating rating={rating} onRate={setRating} />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: '600',
                marginBottom: '0.5rem'
              }}>
                {t('feedback.message')}
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                maxLength={1000}
                rows={6}
                placeholder={t('feedback.messagePlaceholder')}
                disabled={isSubmitting}
              />
              <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '0.5rem', marginBottom: 0 }}>
                {message.length}{t('feedback.charactersOf')}
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
              {isSubmitting ? t('common.submitting') : t('feedback.submitButton')}
            </button>
          </form>
        </section>

        {/* Approved Feedback */}
        <section>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: '700', marginBottom: '1.5rem' }}>
            {t('feedback.whatOthersSay')}
          </h2>

          {approvedFeedback.length === 0 ? (
            <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--muted)', fontSize: '1.1rem', margin: 0 }}>
                {t('feedback.noFeedback')}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {approvedFeedback.map((feedback) => (
                <div key={feedback.id} className="card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: 'clamp(0.5rem, 2vw, 1rem)' }}>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                        {feedback.name}
                      </h3>
                      <p style={{ fontSize: '0.875rem', color: 'var(--muted)', margin: 0 }}>
                        {new Date(feedback.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    {feedback.rating && <StarRating rating={feedback.rating} />}
                  </div>
                  <p style={{ color: 'var(--foreground)', lineHeight: '1.7', margin: 0 }}>
                    {feedback.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
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