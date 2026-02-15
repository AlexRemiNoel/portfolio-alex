"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import router from "next/router";
import { EditableText } from "./components/EditableText";
import { EditableTextarea } from "./components/EditableTextarea";

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
      const response = await fetch("http://localhost:8000/auth/me", {
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
      const response = await fetch("http://localhost:8000/portfolio");
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
      const response = await fetch("http://localhost:8000/portfolio", {
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
      await fetch("http://localhost:8000/auth/logout", {
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
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-blue-950">
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-blue-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-zinc-200 dark:border-blue-800 bg-white/80 dark:bg-blue-950/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-black dark:text-white">
            <EditableText
              value={isEditing ? editData.name : portfolioData.name}
              onChange={(value: string) => updateData(["name"], value)}
              isEditing={isEditing}
            />
          </h1>
          <div className="flex gap-4 items-center">
            <a
              href="#about"
              className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
            >
              About
            </a>
            <a
              href="#skills"
              className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
            >
              Skills
            </a>
            <a
              href="#projects"
              className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
            >
              Projects
            </a>
            <a
              href="#contact"
              className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
            >
              Contact
            </a>
            <a
              href="/feedback"
              className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
            >
              Feedback
            </a>
            {isAuthenticated && (
              <>
                <a
                  href="/feedback/admin"
                  className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                >
                  Admin
                </a>
              </>
            )}
            {!isEditing && (
              <>
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={handleEdit}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => router.push("/login")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                  >
                    Login
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Edit Mode Banner */}
      {isEditing && (
        <div className="sticky top-[73px] z-40 bg-yellow-100 dark:bg-yellow-900/50 border-b border-yellow-300 dark:border-yellow-700 px-6 py-3">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <p className="text-yellow-900 dark:text-yellow-200 font-medium">
              ✏️ Editing Mode - Click on any text to edit
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-6 py-20">
        {/* Hero Section */}
        <section className="text-center mb-32">
          <h2 className="text-5xl md:text-7xl font-bold text-black dark:text-white mb-6">
            <EditableText
              value={hero.headline}
              onChange={(value: string) =>
                updateData(["hero", "headline"], value)
              }
              isEditing={isEditing}
            />
          </h2>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
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
        <section
          id="about"
          className="mb-32 dark:bg-blue-900/50 dark:rounded-lg dark:p-8"
        >
          <h3 className="text-3xl font-bold text-black dark:text-white mb-6">
            <EditableText
              value={about.title}
              onChange={(value: string) => updateData(["about", "title"], value)}
              isEditing={isEditing}
            />
          </h3>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
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
        <section
          id="skills"
          className="mb-32 dark:bg-blue-900/50 dark:rounded-lg dark:p-8"
        >
          <h3 className="text-3xl font-bold text-black dark:text-white mb-6">
            <EditableText
              value={skills.title}
              onChange={(value: string) =>
                updateData(["skills", "title"], value)
              }
              isEditing={isEditing}
            />
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            {skills.categories.map((category: any, index: number) => (
              <div
                key={index}
                className="p-6 border border-zinc-200 dark:border-blue-700 rounded-lg relative"
              >
                {isEditing && (
                  <button
                    onClick={() => removeSkillCategory(index)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold hover:bg-red-700"
                  >
                    ×
                  </button>
                )}
                <h4 className="font-semibold text-xl text-black dark:text-white mb-3">
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
                <p className="text-zinc-600 dark:text-zinc-400">
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
              className="mt-6 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
            >
              + Add Skill Category
            </button>
          )}
        </section>

        {/* Projects Section */}
        <section
          id="projects"
          className="mb-32 dark:bg-blue-900/50 dark:rounded-lg dark:p-8"
        >
          <h3 className="text-3xl font-bold text-black dark:text-white mb-6">
            <EditableText
              value={projects.title}
              onChange={(value: string) =>
                updateData(["projects", "title"], value)
              }
              isEditing={isEditing}
            />
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            {projects.items.map((project: any, index: number) => (
              <div
                key={index}
                className="p-6 border border-zinc-200 dark:border-blue-700 rounded-lg relative"
              >
                {isEditing && (
                  <button
                    onClick={() => removeProject(index)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold hover:bg-red-700 z-10"
                  >
                    ×
                  </button>
                )}
                <h4 className="font-semibold text-xl text-black dark:text-white mb-3">
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
                <p className="text-zinc-600 dark:text-zinc-400 mb-4">
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
                  <div className="space-y-2">
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
                      className="w-full px-3 py-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded text-sm"
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
                      className="w-full px-3 py-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded text-sm"
                    />
                  </div>
                ) : (
                  <div className="flex gap-4 text-sm">
                    <a
                      href={project.projectUrl}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      View Project →
                    </a>
                    <a
                      href={project.githubUrl}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
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
              className="mt-6 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
            >
              + Add Project
            </button>
          )}
        </section>

        {/* Contact Section */}
        <section
          id="contact"
          className="py-20 border-t border-zinc-200 dark:border-blue-800 text-center dark:bg-blue-900/50 dark:rounded-lg dark:p-8 dark:mt-8"
        >
          <h3 className="text-3xl font-bold text-black dark:text-white mb-6">
            <EditableText
              value={contact.title}
              onChange={(value: string) =>
                updateData(["contact", "title"], value)
              }
              isEditing={isEditing}
            />
          </h3>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
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
            <div className="mb-6 max-w-md mx-auto">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contact Email:
              </label>
              <input
                type="email"
                value={editData.contact.email}
                onChange={(e) => updateData(["contact", "email"], e.target.value)}
                className="w-full px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-lg"
              />
            </div>
          )}

          <div className="flex gap-6 justify-center text-sm font-medium flex-wrap mb-8">
            {contact.links.map((link: any, index: number) => (
              <div key={index} className="relative">
                {isEditing && (
                  <button
                    onClick={() => removeContactLink(index)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold hover:bg-red-700 z-10"
                  >
                    ×
                  </button>
                )}
                {isEditing ? (
                  <div className="space-y-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-lg">
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
                      className="w-full px-3 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm"
                    />
                    <input
                      type="text"
                      placeholder="URL (e.g., mailto:you@email.com)"
                      value={editData.contact.links[index].url}
                      onChange={(e) => {
                        setEditData((prevData: any) => {
                          const newData = { ...prevData };
                          newData.contact.links[index].url = e.target.value;
                          return newData;
                        });
                      }}
                      className="w-full px-3 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm"
                    />
                  </div>
                ) : (
                  <a
                    href={link.url}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
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
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
            >
              + Add Contact Link
            </button>
          )}

          {/* Contact Form Button */}
          {!isEditing && (
            <div className="mt-8">
              <a
                href="/contact"
                className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
              >
                Send Me a Message
              </a>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-blue-800 py-8 text-center text-sm text-zinc-600 dark:text-zinc-400">
        <p>
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