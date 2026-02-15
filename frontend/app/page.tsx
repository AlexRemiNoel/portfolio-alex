"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { EditableText } from "@/app/components/EditableText";
import { EditableTextarea } from "@/app/components/EditableTextarea";
import { checkAuth, logout, getPortfolio, updatePortfolio } from "@/lib/api";

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [portfolioData, setPortfolioData] = useState<any>(null);
  const [editData, setEditData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status
  useEffect(() => {
    const verifyAuth = async () => {
      const authenticated = await checkAuth();
      setIsAuthenticated(authenticated);
    };
    verifyAuth();
  }, []);

  // Load portfolio data
  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        const response = await getPortfolio();
        setPortfolioData(response.data);
        setEditData(response.data);
      } catch (error) {
        console.error("Failed to load portfolio:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadPortfolio();
  }, []);

  if (isLoading || !portfolioData) {
    return (
      <div className="min-h-screen bg-white dark:bg-blue-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  const { name, hero, about, skills, projects, contact, footer } = portfolioData;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updatePortfolio(editData);
      setPortfolioData(editData);
      setIsEditing(false);
      alert("Portfolio saved successfully!");
    } catch (error) {
      alert("Failed to save portfolio. Please ensure you're logged in.");
      console.error("Save error:", error);
    }
    setIsSaving(false);
  };

  const handleCancel = () => {
    setEditData(portfolioData);
    setIsEditing(false);
  };

  const handleEdit = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    setEditData(portfolioData);
    setIsEditing(true);
  };

  const handleLogout = async () => {
    await logout();
    setIsAuthenticated(false);
    setIsEditing(false);
    router.push("/login");
  };

  const updateData = (path: string[], value: string) => {
    const newData = { ...editData };
    let current: any = newData;
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
    setEditData(newData);
  };

  // Add new skill category
  const addSkillCategory = () => {
    setEditData((prevData: any) => ({
      ...prevData,
      skills: {
        ...prevData.skills,
        categories: [
          ...prevData.skills.categories,
          { name: "New Category", items: "Skill 1, Skill 2, Skill 3" }
        ]
      }
    }));
  };

  // Remove skill category
  const removeSkillCategory = (index: number) => {
    setEditData((prevData: any) => ({
      ...prevData,
      skills: {
        ...prevData.skills,
        categories: prevData.skills.categories.filter((_: any, i: number) => i !== index)
      }
    }));
  };

  // Add new project
  const addProject = () => {
    setEditData((prevData: any) => ({
      ...prevData,
      projects: {
        ...prevData.projects,
        items: [
          ...prevData.projects.items,
          {
            name: "New Project",
            description: "Project description goes here...",
            projectUrl: "#",
            githubUrl: "#"
          }
        ]
      }
    }));
  };

  // Remove project
  const removeProject = (index: number) => {
    setEditData((prevData: any) => ({
      ...prevData,
      projects: {
        ...prevData.projects,
        items: prevData.projects.items.filter((_: any, i: number) => i !== index)
      }
    }));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-blue-950">

  {/* Unified Navbar */}
<header className="sticky top-0 z-50 bg-white/80 dark:bg-blue-950/80 backdrop-blur border-b border-zinc-200 dark:border-blue-800">
  <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
    {/* Left: Name + Auth Status */}
    <div className="flex items-center gap-4">
      <h1 className="text-2xl font-bold text-black dark:text-white">
        <EditableText
          key="name"
          value={isEditing ? editData.name : name}
          onChange={(value: string) => updateData(["name"], value)}
          isEditing={isEditing}
        />
      </h1>

      {isAuthenticated && (
        <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full"></span>
          Authenticated
        </span>
      )}
    </div>

    {/* Right: Actions */}
    <div className="flex gap-3">
      {isEditing ? (
        <>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            {isAuthenticated ? "Edit" : "Login"}
          </button>
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700"
            >
              Logout
            </button>
          )}
        </>
      )}
    </div>
  </div>
</header>

      <main className="max-w-4xl mx-auto px-6 py-20">
        {/* Hero Section */}
        <section className="py-20 text-center dark:bg-blue-900/50 dark:rounded-lg dark:p-8">
          <h2 className="text-5xl md:text-6xl font-bold text-black dark:text-white mb-6">
            {isEditing ? (
              <input
                key="hero-headline"
                type="text"
                value={editData.hero.headline}
                onChange={(e) => updateData(["hero", "headline"], e.target.value)}
                className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 px-3 py-2 rounded w-full text-5xl md:text-6xl font-bold"
              />
            ) : (
              hero.headline
            )}
          </h2>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-8 max-w-2xl mx-auto">
            <EditableTextarea
              key="hero-subheadline"
              value={isEditing ? editData.hero.subheadline : hero.subheadline}
              onChange={(value: string) => updateData(["hero", "subheadline"], value)}
              rows={4}
              isEditing={isEditing}
            />
          </p>
          <div className="flex gap-4 justify-center">
            <a href="#projects" className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:opacity-90 transition">
              View My Work
            </a>
            <a href="#contact" className="px-8 py-3 border border-black dark:border-white text-black dark:text-white rounded-lg font-medium hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition">
              Get In Touch
            </a>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 border-t border-zinc-200 dark:border-blue-800 dark:bg-blue-900/50 dark:rounded-lg dark:p-8 dark:mt-8">
          <h3 className="text-3xl font-bold text-black dark:text-white mb-6">
            {about.title}
          </h3>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
            <EditableTextarea
              key="about-content"
              value={isEditing ? editData.about.content : about.content}
              onChange={(value: string) => updateData(["about", "content"], value)}
              rows={6}
              isEditing={isEditing}
            />
          </p>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-20 border-t border-zinc-200 dark:border-blue-800 dark:bg-blue-900/50 dark:rounded-lg dark:p-8 dark:mt-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-3xl font-bold text-black dark:text-white">
              {skills.title}
            </h3>
            {isEditing && (
              <button
                onClick={addSkillCategory}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
              >
                + Add Category
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {(isEditing ? editData.skills.categories : skills.categories).map((category: any, index: number) => (
              <div key={index} className="relative">
                {isEditing && (
                  <button
                    onClick={() => removeSkillCategory(index)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold hover:bg-red-700"
                  >
                    ×
                  </button>
                )}
                <h4 className="font-semibold text-black dark:text-white mb-3">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.skills.categories[index].name}
                      onChange={(e) => {
                        setEditData((prevData: any) => {
                          const newData = { ...prevData };
                          newData.skills.categories[index].name = e.target.value;
                          return newData;
                        });
                      }}
                      className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 px-2 py-1 rounded w-full"
                    />
                  ) : (
                    category.name
                  )}
                </h4>
                <p className="text-zinc-600 dark:text-zinc-400">
                  <EditableText
                    key={`skill-${index}`}
                    value={category.items}
                    onChange={(value: string) => {
                      setEditData((prevData: any) => {
                        const newData = { ...prevData };
                        newData.skills.categories[index].items = value;
                        return newData;
                      });
                    }}
                    isEditing={isEditing}
                  />
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-20 border-t border-zinc-200 dark:border-blue-800 dark:bg-blue-900/50 dark:rounded-lg dark:p-8 dark:mt-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-3xl font-bold text-black dark:text-white">
              {projects.title}
            </h3>
            {isEditing && (
              <button
                onClick={addProject}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
              >
                + Add Project
              </button>
            )}
          </div>
          <div className="space-y-6">
            {(isEditing ? editData.projects.items : projects.items).map((project: any, index: number) => (
              <div
                key={index}
                className="relative p-6 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-zinc-400 dark:hover:border-zinc-600 transition"
              >
                {isEditing && (
                  <button
                    onClick={() => removeProject(index)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold hover:bg-red-700"
                  >
                    ×
                  </button>
                )}
                <h4 className="text-xl font-semibold text-black dark:text-white mb-2">
                  <EditableText
                    key={`project-name-${index}`}
                    value={project.name}
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
                    key={`project-desc-${index}`}
                    value={project.description}
                    onChange={(value: string) => {
                      setEditData((prevData: any) => {
                        const newData = { ...prevData };
                        newData.projects.items[index].description = value;
                        return newData;
                      });
                    }}
                    rows={4}
                    isEditing={isEditing}
                  />
                </p>
                {isEditing && (
                  <div className="mb-4 space-y-2">
                    <div>
                      <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Project URL:</label>
                      <input
                        type="text"
                        value={editData.projects.items[index].projectUrl}
                        onChange={(e) => {
                          setEditData((prevData: any) => {
                            const newData = { ...prevData };
                            newData.projects.items[index].projectUrl = e.target.value;
                            return newData;
                          });
                        }}
                        className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 px-2 py-1 rounded w-full text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">GitHub URL:</label>
                      <input
                        type="text"
                        value={editData.projects.items[index].githubUrl}
                        onChange={(e) => {
                          setEditData((prevData: any) => {
                            const newData = { ...prevData };
                            newData.projects.items[index].githubUrl = e.target.value;
                            return newData;
                          });
                        }}
                        className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 px-2 py-1 rounded w-full text-sm"
                      />
                    </div>
                  </div>
                )}
                <div className="flex gap-4">
                  <a href={project.projectUrl} className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">
                    View Project
                  </a>
                  <a href={project.githubUrl} className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">
                    GitHub
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

         {/* Contact Section */}
        <section
          id="contact"
          className="py-20 border-t border-zinc-200 dark:border-blue-800 text-center dark:bg-blue-900/50 dark:rounded-lg dark:p-8 dark:mt-8"
        >
          <h3 className="text-3xl font-bold text-black dark:text-white mb-6">
            {contact.title}
          </h3>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
            <EditableTextarea
              key="contact-message"
              value={isEditing ? editData.contact.message : contact.message}
              onChange={(value: string) => updateData(["contact", "message"], value)}
              rows={4}
              isEditing={isEditing}
            />
          </p>
          
          {/* Editable Email */}
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
          
          <div className="flex gap-6 justify-center text-sm font-medium flex-wrap">
            {contact.links.map((link: any, index: number) => (
              <div key={index} className="relative">
                {isEditing && (
                  <button
                    onClick={() => {
                      setEditData((prevData: any) => ({
                        ...prevData,
                        contact: {
                          ...prevData.contact,
                          links: prevData.contact.links.filter((_: any, i: number) => i !== index)
                        }
                      }));
                    }}
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
              onClick={() => {
                setEditData((prevData: any) => ({
                  ...prevData,
                  contact: {
                    ...prevData.contact,
                    links: [...prevData.contact.links, { name: "New Link", url: "#" }]
                  }
                }));
              }}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
            >
              + Add Contact Link
            </button>
          )}
          </section>
        </main>
      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-8 text-center text-zinc-600 dark:text-zinc-400 text-sm">
        <p>© {footer.year} {footer.name}. All rights reserved.</p>
      </footer>
    </div>
  );
}