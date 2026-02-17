"use client";

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
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();

  return (
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
            flexWrap: "nowrap",
            gap: "1rem",
            overflow: "hidden",
          }}
        >
          <a
            href="/"
            style={{
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              fontWeight: "700",
              margin: 0,
              color: "var(--foreground)",
              textDecoration: "none",
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

          {showFullNav && (
            <div
              style={{
                display: "flex",
                gap: "1.5rem",
                alignItems: "center",
                flexWrap: "nowrap",
                overflow: "auto",
                justifyContent: "center",
                marginLeft: "auto",
              }}
            >
              <a
                href="#about"
                style={{
                  color: "var(--muted)",
                  transition: "color 0.2s",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
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
                  flexShrink: 0,
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
                  flexShrink: 0,
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
                    flexShrink: 0,
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
                          flexShrink: 0,
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
                          flexShrink: 0,
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
                        flexShrink: 0,
                      }}
                    >
                      {t("common.login")}
                    </button>
                  )}
                </>
              )}
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  alignItems: "center",
                  borderLeft: "1px solid var(--border)",
                  paddingLeft: "1rem",
                  flexShrink: 0,
                }}
              >
                <button
                  onClick={() => setLanguage("en")}
                  style={{
                    padding: "0.5rem 0.75rem",
                    background:
                      language === "en"
                        ? "var(--primary)"
                        : "var(--border)",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "0.85rem",
                  }}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage("fr")}
                  style={{
                    padding: "0.5rem 0.75rem",
                    background:
                      language === "fr"
                        ? "var(--primary)"
                        : "var(--border)",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "0.85rem",
                  }}
                >
                  FR
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
