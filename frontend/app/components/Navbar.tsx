"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "../lib/i18n";
import { EditableText } from "./EditableText";

interface NavbarProps {
  isAuthenticated?: boolean;
  isEditing?: boolean;
  onEdit?: () => void;
  onLogout?: () => void;
  portfolioName?: string;
  onPortfolioNameChange?: (value: string) => void;
  showFullNav?: boolean;
}

export function Navbar({
  isAuthenticated = false,
  isEditing = false,
  onEdit,
  onLogout,
  portfolioName = "Your Name",
  onPortfolioNameChange,
  showFullNav = true,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();

  return (
    <>
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          borderBottom: "1px solid var(--border)",
          background: "rgba(10, 15, 30, 0.9)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "1rem 1.5rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            {/* Logo */}
            <a
              href="/"
              style={{
                fontSize: "clamp(1.25rem, 3vw, 2rem)",
                fontWeight: "700",
                margin: 0,
                color: "var(--foreground)",
                textDecoration: "none",
                minWidth: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {onPortfolioNameChange && isEditing ? (
                <EditableText
                  value={portfolioName}
                  onChange={onPortfolioNameChange}
                  isEditing={true}
                />
              ) : (
                portfolioName
              )}
            </a>

            {/* Desktop Navigation */}
            {showFullNav && (
              <div
                style={{
                  display: "none",
                }}
                className="navbar-desktop"
              >
                <div
                  style={{
                    display: "flex",
                    gap: "1.5rem",
                    alignItems: "center",
                  }}
                >
                  <a
                    href="/"
                    style={{
                      color: "var(--muted)",
                      transition: "color 0.2s",
                      textDecoration: "none",
                      whiteSpace: "nowrap",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.color = "var(--primary)")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.color = "var(--muted)")
                    }
                  >
                    {t("navigation.about")}
                  </a>
                  <a
                    href="/contact"
                    style={{
                      color: "var(--muted)",
                      transition: "color 0.2s",
                      textDecoration: "none",
                      whiteSpace: "nowrap",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.color = "var(--primary)")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.color = "var(--muted)")
                    }
                  >
                    {t("navigation.contact")}
                  </a>
                  <a
                    href="/feedback"
                    style={{
                      color: "var(--muted)",
                      transition: "color 0.2s",
                      textDecoration: "none",
                      whiteSpace: "nowrap",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.color = "var(--primary)")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.color = "var(--muted)")
                    }
                  >
                    {t("navigation.feedback")}
                  </a>
                  {isAuthenticated && (
                    <a
                      href="/feedback/admin"
                      style={{
                        color: "var(--muted)",
                        transition: "color 0.2s",
                        textDecoration: "none",
                        whiteSpace: "nowrap",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.color = "var(--primary)")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.color = "var(--muted)")
                      }
                    >
                      {t("navigation.admin")}
                    </a>
                  )}
                  {!isEditing && (
                    <>
                      {isAuthenticated ? (
                        <>
                          <button
                            onClick={onEdit}
                            className="btn btn-primary"
                            style={{
                              padding: "0.75rem 1.5rem",
                              background: "var(--primary)",
                              color: "white",
                              borderRadius: "var(--radius-lg)",
                              border: "none",
                              cursor: "pointer",
                              fontWeight: "600",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {t("common.edit")}
                          </button>
                          <button
                            onClick={onLogout}
                            style={{
                              padding: "0.75rem 1.5rem",
                              background: "var(--muted)",
                              color: "white",
                              borderRadius: "var(--radius-lg)",
                              border: "none",
                              cursor: "pointer",
                              fontWeight: "600",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {t("common.logout")}
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => router.push("/login")}
                          className="btn btn-primary"
                          style={{
                            padding: "0.75rem 1.5rem",
                            background: "var(--primary)",
                            color: "white",
                            borderRadius: "var(--radius-lg)",
                            border: "none",
                            cursor: "pointer",
                            fontWeight: "600",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {t("common.login")}
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Language Selector & Mobile Menu Button */}
            {showFullNav && (
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  alignItems: "center",
                  marginLeft: "auto",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "0.25rem",
                    alignItems: "center",
                  }}
                >
                  <button
                    onClick={() => setLanguage("en")}
                    style={{
                      padding: "0.4rem 0.6rem",
                      background:
                        language === "en" ? "var(--primary)" : "var(--border)",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: "0.75rem",
                    }}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => setLanguage("fr")}
                    style={{
                      padding: "0.4rem 0.6rem",
                      background:
                        language === "fr" ? "var(--primary)" : "var(--border)",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: "0.75rem",
                    }}
                  >
                    FR
                  </button>
                </div>

                {/* Hamburger Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  style={{
                    display: "none",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--foreground)",
                    fontSize: "1.5rem",
                  }}
                  className="mobile-menu-btn"
                  aria-label="Toggle menu"
                >
                  {mobileMenuOpen ? "✕" : "☰"}
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {showFullNav && mobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            top: "73px",
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(8px)",
            zIndex: 40,
            display: "flex",
            flexDirection: "column",
            padding: "1.5rem",
            gap: "1rem",
            overflow: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <a
              href="/"
              style={{
                color: "var(--foreground)",
                transition: "color 0.2s",
                textDecoration: "none",
                fontSize: "1.125rem",
                fontWeight: "500",
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("navigation.about")}
            </a>
            <a
              href="/contact"
              style={{
                color: "var(--foreground)",
                transition: "color 0.2s",
                textDecoration: "none",
                fontSize: "1.125rem",
                fontWeight: "500",
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("navigation.contact")}
            </a>
            <a
              href="/feedback"
              style={{
                color: "var(--foreground)",
                transition: "color 0.2s",
                textDecoration: "none",
                fontSize: "1.125rem",
                fontWeight: "500",
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("navigation.feedback")}
            </a>
            {isAuthenticated && (
              <a
                href="/feedback/admin"
                style={{
                  color: "var(--foreground)",
                  transition: "color 0.2s",
                  textDecoration: "none",
                  fontSize: "1.125rem",
                  fontWeight: "500",
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("navigation.admin")}
              </a>
            )}

            <div
              style={{
                borderTop: "1px solid var(--border)",
                paddingTop: "1rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              {!isEditing && (
                <>
                  {isAuthenticated ? (
                    <>
                      <button
                        onClick={() => {
                          onEdit?.();
                          setMobileMenuOpen(false);
                        }}
                        style={{
                          padding: "0.75rem 1.5rem",
                          background: "var(--primary)",
                          color: "white",
                          borderRadius: "var(--radius-lg)",
                          border: "none",
                          cursor: "pointer",
                          fontWeight: "600",
                          width: "100%",
                          textAlign: "center",
                        }}
                      >
                        {t("common.edit")}
                      </button>
                      <button
                        onClick={() => {
                          onLogout?.();
                          setMobileMenuOpen(false);
                        }}
                        style={{
                          padding: "0.75rem 1.5rem",
                          background: "var(--muted)",
                          color: "white",
                          borderRadius: "var(--radius-lg)",
                          border: "none",
                          cursor: "pointer",
                          fontWeight: "600",
                          width: "100%",
                          textAlign: "center",
                        }}
                      >
                        {t("common.logout")}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        router.push("/login");
                        setMobileMenuOpen(false);
                      }}
                      style={{
                        padding: "0.75rem 1.5rem",
                        background: "var(--primary)",
                        color: "white",
                        borderRadius: "var(--radius-lg)",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: "600",
                        width: "100%",
                        textAlign: "center",
                      }}
                    >
                      {t("common.login")}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add media query styles */}
      <style>{`
        @media (min-width: 769px) {
          .navbar-desktop {
            display: flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
        }

        @media (max-width: 768px) {
          .navbar-desktop {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
        }
      `}</style>
    </>
  );
}
