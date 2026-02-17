"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../lib/i18n";

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

export default function AdminFeedbackPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [allFeedback, setAllFeedback] = useState<Feedback[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("pending");

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadFeedback();
    }
  }, [isAuthenticated, filter]);

  const checkAuth = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        router.push("/login");
      }
    } catch (err) {
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  };

  const loadFeedback = async () => {
    const token = localStorage.getItem("access_token");
    const endpoint = filter === "pending" 
      ? `${API_URL}/feedback/pending`
      : filter === "approved"
      ? `${API_URL}/feedback/approved`
      : `${API_URL}/feedback/all`;

    try {
      const response = await fetch(endpoint, {
        headers: filter !== "approved" ? {
          Authorization: `Bearer ${token}`,
        } : {},
      });

      if (response.ok) {
        const data = await response.json();
        setAllFeedback(data);
      }
    } catch (err) {
      console.error("Failed to load feedback:", err);
    }
  };

  const handleApprove = async (id: number, approve: boolean) => {
    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch(`${API_URL}/feedback/${id}/approve`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ approve }),
      });

      if (response.ok) {
        loadFeedback();
      }
    } catch (err) {
      console.error("Failed to approve feedback:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t('admin.deleteConfirm'))) {
      return;
    }

    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch(`${API_URL}/feedback/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        loadFeedback();
      }
    } catch (err) {
      console.error("Failed to delete feedback:", err);
    }
  };

  const StarRating = ({ rating }: { rating?: number }) => {
    if (!rating) return null;
    return (
      <div style={{ display: 'flex', gap: '0.25rem' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            style={{
              fontSize: '1.25rem',
              color: star <= rating ? '#fbbf24' : 'var(--muted)',
            }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'var(--background)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div className="animate-pulse" style={{ color: 'var(--foreground)' }}>
          {t('common.loading')}
        </div>
      </div>
    );
  }

  const pendingCount = allFeedback.filter(f => !f.is_approved).length;
  const approvedCount = allFeedback.filter(f => f.is_approved).length;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)', color: 'var(--foreground)' }}>
      {/* Navigation */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        borderBottom: '1px solid var(--border)',
        background: 'rgba(10, 15, 30, 0.9)',
        backdropFilter: 'blur(12px)',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem 1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: '700', margin: 0 }}>
              {t('admin.title')}
            </h1>
            <a
              href="/"
              style={{ color: 'var(--primary)', fontSize: '0.95rem', fontWeight: '500', textDecoration: 'none' }}
            >
              {t('common.back')}
            </a>
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        {/* Filter Tabs */}
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          marginBottom: '2rem', 
          borderBottom: '2px solid var(--border)',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setFilter("pending")}
            style={{
              padding: '0.75rem 1rem',
              fontWeight: '600',
              fontSize: '0.95rem',
              background: 'none',
              border: 'none',
              borderBottom: filter === "pending" ? '3px solid var(--primary)' : '3px solid transparent',
              color: filter === "pending" ? 'var(--primary)' : 'var(--muted)',
              cursor: 'pointer',
              transition: 'var(--transition-fast)',
              marginBottom: '-2px',
            }}
            onMouseEnter={(e) => {
              if (filter !== "pending") e.currentTarget.style.color = 'var(--foreground)';
            }}
            onMouseLeave={(e) => {
              if (filter !== "pending") e.currentTarget.style.color = 'var(--muted)';
            }}
          >
            {t('admin.pending')} ({pendingCount})
          </button>
          <button
            onClick={() => setFilter("approved")}
            style={{
              padding: '0.75rem 1rem',
              fontWeight: '600',
              fontSize: '0.95rem',
              background: 'none',
              border: 'none',
              borderBottom: filter === "approved" ? '3px solid var(--primary)' : '3px solid transparent',
              color: filter === "approved" ? 'var(--primary)' : 'var(--muted)',
              cursor: 'pointer',
              transition: 'var(--transition-fast)',
              marginBottom: '-2px',
            }}
            onMouseEnter={(e) => {
              if (filter !== "approved") e.currentTarget.style.color = 'var(--foreground)';
            }}
            onMouseLeave={(e) => {
              if (filter !== "approved") e.currentTarget.style.color = 'var(--muted)';
            }}
          >
            {t('admin.approved')} ({approvedCount})
          </button>
          <button
            onClick={() => setFilter("all")}
            style={{
              padding: '0.75rem 1rem',
              fontWeight: '600',
              fontSize: '0.95rem',
              background: 'none',
              border: 'none',
              borderBottom: filter === "all" ? '3px solid var(--primary)' : '3px solid transparent',
              color: filter === "all" ? 'var(--primary)' : 'var(--muted)',
              cursor: 'pointer',
              transition: 'var(--transition-fast)',
              marginBottom: '-2px',
            }}
            onMouseEnter={(e) => {
              if (filter !== "all") e.currentTarget.style.color = 'var(--foreground)';
            }}
            onMouseLeave={(e) => {
              if (filter !== "all") e.currentTarget.style.color = 'var(--muted)';
            }}
          >
            {t('admin.all')} ({allFeedback.length})
          </button>
        </div>

        {/* Feedback List */}
        {allFeedback.length === 0 ? (
          <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--muted)', fontSize: '1.1rem', margin: 0 }}>
              {t('admin.noFeedback')}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {allFeedback.map((feedback) => (
              <div
                key={feedback.id}
                className="card"
                style={{
                  padding: '1.5rem',
                  border: `2px solid ${feedback.is_approved ? 'var(--success)' : 'var(--warning)'}`,
                  background: feedback.is_approved 
                    ? 'rgba(16, 185, 129, 0.05)' 
                    : 'rgba(251, 191, 36, 0.05)',
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start', 
                  marginBottom: '1rem',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                      {feedback.name}
                    </h3>
                    {feedback.email && (
                      <p style={{ fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '0.25rem' }}>
                        {feedback.email}
                      </p>
                    )}
                    <p style={{ fontSize: '0.875rem', color: 'var(--muted)', margin: 0 }}>
                      {new Date(feedback.created_at).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <StarRating rating={feedback.rating} />
                </div>

                <p style={{ color: 'var(--foreground)', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                  {feedback.message}
                </p>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {!feedback.is_approved ? (
                    <button
                      onClick={() => handleApprove(feedback.id, true)}
                      className="btn"
                      style={{
                        padding: '0.625rem 1.25rem',
                        background: 'var(--success)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        transition: 'var(--transition-base)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {t('admin.approve')}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleApprove(feedback.id, false)}
                      className="btn"
                      style={{
                        padding: '0.625rem 1.25rem',
                        background: 'var(--warning)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        transition: 'var(--transition-base)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {t('admin.unapprove')}
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(feedback.id)}
                    className="btn"
                    style={{
                      padding: '0.625rem 1.25rem',
                      background: 'var(--error)',
                      color: 'white',
                      border: 'none',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      transition: 'var(--transition-base)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {t('admin.delete')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '2rem 1.5rem',
        textAlign: 'center',
        color: 'var(--muted)',
        fontSize: '0.9rem',
        marginTop: '5rem',
      }}>
        <p style={{ margin: 0 }}>
          <a href="/" style={{ color: 'var(--primary)', textDecoration: 'none' }}>{t('common.back')}</a>
          {' • '}
          <a href="/feedback" style={{ color: 'var(--primary)', textDecoration: 'none' }}>{t('admin.publicFeedback')}</a>
        </p>
      </footer>
    </div>
  );
}