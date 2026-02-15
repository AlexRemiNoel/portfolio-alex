"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import style from "styled-jsx/style";
import { EditableText } from "./components/EditableText";
import { EditableTextarea } from "./components/EditableTextarea";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://portfolio-alex-2h4y.onrender.com';

export default function Home() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [portfolioData, setPortfolioData] = useState({
    name: "Your Name",
    hero: {
      headline: "Welcome to My Portfolio",
      subheadline: "I'm a developer creating amazing digital experiences.",
    },
    about: {
      title: "About Me",
      content: "Tell your story here...",
    },
    skills: {
      title: "Skills",
      categories: [
        { name: "Frontend", items: "React, Next.js, TypeScript" },
        { name: "Backend", items: "Python, FastAPI, PostgreSQL" },
      ],
    },
    projects: {
      title: "Projects",
      items: [
        {
          name: "Sample Project",
          description: "A sample project description",
          projectUrl: "#",
          githubUrl: "#",
        },
      ],
    },
    contact: {
      title: "Contact",
      message: "Let's get in touch!",
      email: "your@email.com",
      links: [
        { name: "Email", url: "mailto:your@email.com" },
        { name: "GitHub", url: "https://github.com/yourusername" },
      ],
    },
    footer: {
      year: "2024",
      name: "Your Name",
    },
  });

  const [editData, setEditData] = useState(portfolioData);

  useEffect(() => {
    checkAuth();
    loadPortfolio();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setIsAuthenticated(false);
      setIsLoading(false);
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
        setIsAuthenticated(false);
        localStorage.removeItem("access_token");
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPortfolio = async () => {
    try {
      const response = await fetch(`${API_URL}/portfolio`);
      if (response.ok) {
        const data = await response.json();
        setPortfolioData(data.data);
        setEditData(data.data);
      }
    } catch (err) {
      console.error("Failed to load portfolio:", err);
    }
  };

  const handleEdit = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    setIsEditing(true);
    setEditData(JSON.parse(JSON.stringify(portfolioData)));
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData(JSON.parse(JSON.stringify(portfolioData)));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`${API_URL}/portfolio`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data: editData }),
      });

      if (response.ok) {
        setPortfolioData(editData);
        setIsEditing(false);
      } else {
        alert("Failed to save changes");
      }
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout failed:", err);
    }
    localStorage.removeItem("access_token");
    setIsAuthenticated(false);
    setIsEditing(false);
  };

  const updateData = (path: string[], value: any) => {
    setEditData((prevData: any) => {
      const newData = JSON.parse(JSON.stringify(prevData));
      let current = newData;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return newData;
    });
  };

  const addSkillCategory = () => {
    setEditData((prevData: any) => ({
      ...prevData,
      skills: {
        ...prevData.skills,
        categories: [
          ...prevData.skills.categories,
          { name: "New Category", items: "Skill 1, Skill 2" },
        ],
      },
    }));
  };

  const removeSkillCategory = (index: number) => {
    setEditData((prevData: any) => ({
      ...prevData,
      skills: {
        ...prevData.skills,
        categories: prevData.skills.categories.filter(
          (_: any, i: number) => i !== index
        ),
      },
    }));
  };

  const addProject = () => {
    setEditData((prevData: any) => ({
      ...prevData,
      projects: {
        ...prevData.projects,
        items: [
          ...prevData.projects.items,
          {
            name: "New Project",
            description: "Project description",
            projectUrl: "#",
            githubUrl: "#",
          },
        ],
      },
    }));
  };

  const removeProject = (index: number) => {
    setEditData((prevData: any) => ({
      ...prevData,
      projects: {
        ...prevData.projects,
        items: prevData.projects.items.filter(
          (_: any, i: number) => i !== index
        ),
      },
    }));
  };

  const addContactLink = () => {
    setEditData((prevData: any) => ({
      ...prevData,
      contact: {
        ...prevData.contact,
        links: [...prevData.contact.links, { name: "New Link", url: "#" }],
      },
    }));
  };

  const removeContactLink = (index: number) => {
    setEditData((prevData: any) => ({
      ...prevData,
      contact: {
        ...prevData.contact,
        links: prevData.contact.links.filter(
          (_: any, i: number) => i !== index
        ),
      },
    }));
  };

  const data = isEditing ? editData : portfolioData;
  const { hero, about, skills, projects, contact, footer } = data;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--background)' }}>
        <div className="animate-pulse" style={{ color: 'var(--foreground)' }}>Loading...</div>
      </div>
    );
  }

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
              <EditableText
                value={isEditing ? editData.name : portfolioData.name}
                onChange={(value: string) => updateData(["name"], value)}
                isEditing={isEditing}
              />
            </h1>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <a href="#about" style={{ color: 'var(--muted)', transition: 'color 0.2s' }}
                 onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary)'}
                 onMouseOut={(e) => e.currentTarget.style.color = 'var(--muted)'}>
                About
              </a>
              <a href="#skills" style={{ color: 'var(--muted)', transition: 'color 0.2s' }}
                 onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary)'}
                 onMouseOut={(e) => e.currentTarget.style.color = 'var(--muted)'}>
                Skills
              </a>
              <a href="#projects" style={{ color: 'var(--muted)', transition: 'color 0.2s' }}
                 onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary)'}
                 onMouseOut={(e) => e.currentTarget.style.color = 'var(--muted)'}>
                Projects
              </a>
              <a href="/contact" style={{ color: 'var(--muted)', transition: 'color 0.2s' }}
                 onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary)'}
                 onMouseOut={(e) => e.currentTarget.style.color = 'var(--muted)'}>
                Contact
              </a>
              <a href="/feedback" style={{ color: 'var(--muted)', transition: 'color 0.2s' }}
                 onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary)'}
                 onMouseOut={(e) => e.currentTarget.style.color = 'var(--muted)'}>
                Feedback
              </a>
              {isAuthenticated && (
                <a href="/feedback/admin" style={{ color: 'var(--muted)', transition: 'color 0.2s' }}
                   onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary)'}
                   onMouseOut={(e) => e.currentTarget.style.color = 'var(--muted)'}>
                  Admin
                </a>
              )}
              {!isEditing && (
                <>
                  {isAuthenticated ? (
                    <>
                      <button onClick={handleEdit} className="btn btn-primary">
                        Edit
                      </button>
                      <button onClick={handleLogout} style={{
                        padding: '0.75rem 1.5rem',
                        background: 'var(--muted)',
                        color: 'white',
                        borderRadius: 'var(--radius-lg)',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: '600',
                      }}>
                        Logout
                      </button>
                    </>
                  ) : (
                    <button onClick={() => router.push("/login")} className="btn btn-primary">
                      Login
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Edit Mode Banner */}
      {isEditing && (
        <div style={{
          position: 'sticky',
          top: '73px',
          zIndex: 40,
          background: 'var(--warning)',
          borderBottom: '1px solid rgba(0,0,0,0.1)',
          padding: '0.75rem 1.5rem',
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <p style={{ fontWeight: '600', margin: 0 }}>
              Editing Mode - Click on any text to edit
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={handleCancel} style={{
                padding: '0.5rem 1rem',
                background: '#6b7280',
                color: 'white',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '600',
              }}>
                Cancel
              </button>
              <button onClick={handleSave} disabled={isSaving} className="btn" style={{
                padding: '0.5rem 1rem',
                background: 'var(--success)',
                color: 'white',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '600',
                opacity: isSaving ? 0.5 : 1,
              }}>
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        {/* Hero Section */}
        <section style={{ textAlign: 'center', padding: '6rem 0', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)', fontWeight: '700', marginBottom: '1.5rem', lineHeight: '1.1' }}>
            <EditableText
              value={hero.headline}
              onChange={(value: string) =>
                updateData(["hero", "headline"], value)
              }
              isEditing={isEditing}
            />
          </h2>
          <p style={{ fontSize: 'clamp(1.125rem, 2vw, 1.5rem)', color: 'var(--muted)', maxWidth: '700px', margin: '0 auto' }}>
            <EditableText
              value={hero.subheadline}
              onChange={(value: string) =>
                updateData(["hero", "subheadline"], value)
              }
              isEditing={isEditing}
            />
          </p>
        </section>

        {/* About Section */}
        <section id="about" className="card" style={{ marginBottom: '4rem' }}>
          <h3 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '700', marginBottom: '1.5rem' }}>
            <EditableText
              value={about.title}
              onChange={(value: string) => updateData(["about", "title"], value)}
              isEditing={isEditing}
            />
          </h3>
          <p style={{ fontSize: '1.125rem', lineHeight: '1.8', color: 'var(--muted)' }}>
            <EditableTextarea
              value={about.content}
              onChange={(value: string) =>
                updateData(["about", "content"], value)
              }
              rows={6}
              isEditing={isEditing}
            />
          </p>
        </section>

        {/* Skills Section */}
        <section id="skills" className="card" style={{ marginBottom: '4rem' }}>
          <h3 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '700', marginBottom: '1.5rem' }}>
            <EditableText
              value={skills.title}
              onChange={(value: string) =>
                updateData(["skills", "title"], value)
              }
              isEditing={isEditing}
            />
          </h3>
          <div className="grid-2">
            {skills.categories.map((category: any, index: number) => (
              <div key={index} className="card" style={{ position: 'relative' }}>
                {isEditing && (
                  <button
                    onClick={() => removeSkillCategory(index)}
                    style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      background: 'var(--error)',
                      color: 'white',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: '700',
                      fontSize: '16px',
                    }}
                  >
                    ×
                  </button>
                )}
                <h4 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
                  <EditableText
                    value={
                      isEditing
                        ? editData.skills.categories[index].name
                        : category.name
                    }
                    onChange={(value: string) => {
                      setEditData((prevData: any) => {
                        const newData = { ...prevData };
                        newData.skills.categories[index].name = value;
                        return newData;
                      });
                    }}
                    isEditing={isEditing}
                  />
                </h4>
                <p style={{ color: 'var(--muted)', lineHeight: '1.6' }}>
                  <EditableTextarea
                    value={
                      isEditing
                        ? editData.skills.categories[index].items
                        : category.items
                    }
                    onChange={(value: string) => {
                      setEditData((prevData: any) => {
                        const newData = { ...prevData };
                        newData.skills.categories[index].items = value;
                        return newData;
                      });
                    }}
                    rows={2}
                    isEditing={isEditing}
                  />
                </p>
              </div>
            ))}
          </div>
          {isEditing && (
            <button
              onClick={addSkillCategory}
              style={{
                marginTop: '1.5rem',
                padding: '0.75rem 1.5rem',
                background: 'var(--success)',
                color: 'white',
                borderRadius: 'var(--radius-lg)',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              + Add Skill Category
            </button>
          )}
        </section>

        {/* Projects Section */}
        <section id="projects" className="card" style={{ marginBottom: '4rem' }}>
          <h3 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '700', marginBottom: '1.5rem' }}>
            <EditableText
              value={projects.title}
              onChange={(value: string) =>
                updateData(["projects", "title"], value)
              }
              isEditing={isEditing}
            />
          </h3>
          <div className="grid-2">
            {projects.items.map((project: any, index: number) => (
              <div key={index} className="card" style={{ position: 'relative' }}>
                {isEditing && (
                  <button
                    onClick={() => removeProject(index)}
                    style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      background: 'var(--error)',
                      color: 'white',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: '700',
                      fontSize: '16px',
                      zIndex: 10,
                    }}
                  >
                    ×
                  </button>
                )}
                <h4 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
                  <EditableText
                    value={
                      isEditing
                        ? editData.projects.items[index].name
                        : project.name
                    }
                    onChange={(value: string) => {
                      setEditData((prevData: any) => {
                        const newData = { ...prevData };
                        newData.projects.items[index].name = value;
                        return newData;
                      });
                    }}
                    isEditing={isEditing}
                  />
                </h4>
                <p style={{ color: 'var(--muted)', marginBottom: '1rem', lineHeight: '1.6' }}>
                  <EditableTextarea
                    value={
                      isEditing
                        ? editData.projects.items[index].description
                        : project.description
                    }
                    onChange={(value: string) => {
                      setEditData((prevData: any) => {
                        const newData = { ...prevData };
                        newData.projects.items[index].description = value;
                        return newData;
                      });
                    }}
                    rows={3}
                    isEditing={isEditing}
                  />
                </p>
                {isEditing ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <input
                      type="text"
                      placeholder="Project URL"
                      value={editData.projects.items[index].projectUrl}
                      onChange={(e) => {
                        setEditData((prevData: any) => {
                          const newData = { ...prevData };
                          newData.projects.items[index].projectUrl =
                            e.target.value;
                          return newData;
                        });
                      }}
                    />
                    <input
                      type="text"
                      placeholder="GitHub URL"
                      value={editData.projects.items[index].githubUrl}
                      onChange={(e) => {
                        setEditData((prevData: any) => {
                          const newData = { ...prevData };
                          newData.projects.items[index].githubUrl =
                            e.target.value;
                          return newData;
                        });
                      }}
                    />
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem' }}>
                    <a
                      href={project.projectUrl}
                      style={{ color: 'var(--primary)' }}
                    >
                      View Project →
                    </a>
                    <a
                      href={project.githubUrl}
                      style={{ color: 'var(--primary)' }}
                    >
                      GitHub →
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
          {isEditing && (
            <button
              onClick={addProject}
              style={{
                marginTop: '1.5rem',
                padding: '0.75rem 1.5rem',
                background: 'var(--success)',
                color: 'white',
                borderRadius: 'var(--radius-lg)',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              + Add Project
            </button>
          )}
        </section>

        {/* Contact Section */}
        <section
          id="contact"
          style={{
            padding: '3rem',
            borderTop: '1px solid var(--border)',
            textAlign: 'center',
            background: 'var(--card)',
            borderRadius: 'var(--radius-xl)',
            marginTop: '4rem',
          }}
        >
          <h3 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '700', marginBottom: '1.5rem' }}>
            <EditableText
              value={contact.title}
              onChange={(value: string) =>
                updateData(["contact", "title"], value)
              }
              isEditing={isEditing}
            />
          </h3>
          <p style={{ fontSize: '1.125rem', color: 'var(--muted)', marginBottom: '2rem' }}>
            <EditableTextarea
              value={contact.message}
              onChange={(value: string) =>
                updateData(["contact", "message"], value)
              }
              rows={2}
              isEditing={isEditing}
            />
          </p>

          {/* Contact Email (Editable) */}
          {isEditing && (
            <div style={{ maxWidth: '500px', margin: '0 auto 2rem' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                Contact Email:
              </label>
              <input
                type="email"
                value={editData.contact.email}
                onChange={(e) => updateData(["contact", "email"], e.target.value)}
              />
            </div>
          )}

          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
            {contact.links.map((link: any, index: number) => (
              <div key={index} style={{ position: 'relative' }}>
                {isEditing && (
                  <button
                    onClick={() => removeContactLink(index)}
                    style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      background: 'var(--error)',
                      color: 'white',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: '700',
                      fontSize: '14px',
                      zIndex: 10,
                    }}
                  >
                    ×
                  </button>
                )}
                {isEditing ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0.75rem', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                    <input
                      type="text"
                      placeholder="Name (e.g., Email)"
                      value={editData.contact.links[index].name}
                      onChange={(e) => {
                        setEditData((prevData: any) => {
                          const newData = { ...prevData };
                          newData.contact.links[index].name = e.target.value;
                          return newData;
                        });
                      }}
                      style={{ fontSize: '0.9rem' }}
                    />
                    <input
                      type="text"
                      placeholder="URL"
                      value={editData.contact.links[index].url}
                      onChange={(e) => {
                        setEditData((prevData: any) => {
                          const newData = { ...prevData };
                          newData.contact.links[index].url = e.target.value;
                          return newData;
                        });
                      }}
                      style={{ fontSize: '0.9rem' }}
                    />
                  </div>
                ) : (
                  <a
                    href={link.url}
                    style={{ color: 'var(--primary)', fontWeight: '500' }}
                  >
                    {link.name}
                  </a>
                )}
              </div>
            ))}
          </div>
          
          {isEditing && (
            <button
              onClick={addContactLink}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'var(--success)',
                color: 'white',
                borderRadius: 'var(--radius-lg)',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '600',
                marginBottom: '2rem',
              }}
            >
              + Add Contact Link
            </button>
          )}

          {/* Contact Form Button */}
          {!isEditing && (
            <div style={{ marginTop: '2rem' }}>
              <a
                href="/contact"
                className="btn btn-primary"
                style={{ display: 'inline-block', textDecoration: 'none' }}
              >
                Send Me a Message
              </a>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '2rem 1.5rem',
        textAlign: 'center',
        color: 'var(--muted)',
        fontSize: '0.9rem',
      }}>
        <p style={{ margin: 0 }}>
          © {footer.year}{" "}
          <EditableText
            value={footer.name}
            onChange={(value: string) => updateData(["footer", "name"], value)}
            isEditing={isEditing}
          />
          . All rights reserved.
        </p>
      </footer>
    </div>
  );
}