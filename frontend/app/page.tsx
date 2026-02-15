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

  useEffect(() => {
    const verifyAuth = async () => {
      const authenticated = await checkAuth();
      setIsAuthenticated(authenticated);
    };
    verifyAuth();
  }, []);

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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
    } catch (error) {
      alert("Save failed. Session may have expired.");
    } finally {
      setIsSaving(false);
    }
  };

  const updateData = (path: string[], value: string) => {
    setEditData((prev: any) => {
      const newData = JSON.parse(JSON.stringify(prev));
      let current = newData;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return newData;
    });
  };

  // --- Dynamic Item Handlers ---
  const addProject = () => {
    const newItems = [...editData.projects.items, { name: "New Project", description: "Desc", projectUrl: "#", githubUrl: "#" }];
    setEditData({ ...editData, projects: { ...editData.projects, items: newItems } });
  };

  const addSkill = () => {
    const newCats = [...editData.skills.categories, { name: "New Category", items: "Skill 1, Skill 2" }];
    setEditData({ ...editData, skills: { ...editData.skills, categories: newCats } });
  };

  return (
    <div className="min-h-screen bg-background transition-smooth text-foreground">
      {/* Edit Mode Indicator */}
      {isEditing && (
        <div className="bg-primary text-white text-center py-1 text-xs font-bold sticky top-0 z-[60] animate-pulse">
          EDIT MODE ACTIVE
        </div>
      )}

      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur border-b border-border transition-smooth">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">
            <EditableText
              value={isEditing ? editData.name : name}
              onChange={(v: string) => updateData(["name"], v)}
              isEditing={isEditing}
            />
          </h1>

          <div className="flex items-center gap-4">
            {isEditing ? (
              <div className="flex gap-2">
                <button onClick={handleSave} className="hero-button bg-primary text-white text-sm px-4 py-2">
                  {isSaving ? "Saving..." : "Save"}
                </button>
                <button onClick={() => setIsEditing(false)} className="hero-button bg-red-600 text-white text-sm px-4 py-2">
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => isAuthenticated ? setIsEditing(true) : router.push("/login")} className="hero-button border border-primary text-primary text-sm px-4 py-2">
                  {isAuthenticated ? "Edit Profile" : "Login"}
                </button>
                {isAuthenticated && (
                  <button onClick={async () => { await logout(); window.location.reload(); }} className="text-zinc-500 hover:text-red-500 text-sm font-medium">
                    Logout
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-20">
        {/* Hero */}
        <section className="text-center py-16 fade-in-up">
          <h2 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            <EditableText
              value={isEditing ? editData.hero.headline : hero.headline}
              onChange={(v: string) => updateData(["hero", "headline"], v)}
              isEditing={isEditing}
            />
          </h2>
          <div className="text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto mb-10">
            <EditableTextarea
              value={isEditing ? editData.hero.subheadline : hero.subheadline}
              onChange={(v: string) => updateData(["hero", "subheadline"], v)}
              isEditing={isEditing}
            />
          </div>
          <div className="flex gap-4 justify-center">
            <a href="#projects" className="hero-button bg-primary text-white px-8 py-3">View Portfolio</a>
            <a href="#contact" className="hero-button border border-border text-foreground px-8 py-3">Contact Me</a>
          </div>
        </section>

        {/* About Card */}
        <section id="about" className="card fade-in-up">
          <h3 className="text-2xl font-bold mb-6 text-primary">About Me</h3>
          <div className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-300">
            <EditableTextarea
              value={isEditing ? editData.about.content : about.content}
              onChange={(v: string) => updateData(["about", "content"], v)}
              isEditing={isEditing}
              rows={5}
            />
          </div>
        </section>

        {/* Skills Card */}
        <section id="skills" className="card fade-in-up">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold text-primary">Technical Skills</h3>
            {isEditing && (
              <button onClick={addSkill} className="text-xs bg-green-600 text-white px-3 py-1 rounded-full">+ Add Category</button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {(isEditing ? editData.skills.categories : skills.categories).map((cat: any, i: number) => (
              <div key={i} className="group relative">
                {isEditing && (
                  <button onClick={() => {
                    const filtered = editData.skills.categories.filter((_: any, idx: number) => idx !== i);
                    setEditData({ ...editData, skills: { ...editData.skills, categories: filtered } });
                  }} className="absolute -left-6 top-1 text-red-500 opacity-0 group-hover:opacity-100">×</button>
                )}
                <h4 className="font-bold mb-2">
                  <EditableText
                    value={cat.name}
                    onChange={(v: any) => {
                      const updated = [...editData.skills.categories];
                      updated[i].name = v;
                      setEditData({ ...editData, skills: { ...editData.skills, categories: updated } });
                    }}
                    isEditing={isEditing}
                  />
                </h4>
                <div className="text-zinc-500 text-sm italic">
                  <EditableTextarea
                    value={cat.items}
                    onChange={(v: any) => {
                      const updated = [...editData.skills.categories];
                      updated[i].items = v;
                      setEditData({ ...editData, skills: { ...editData.skills, categories: updated } });
                    }}
                    isEditing={isEditing}
                    rows={2}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Projects Card */}
        <section id="projects" className="card fade-in-up">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold text-primary">Featured Projects</h3>
            {isEditing && (
              <button onClick={addProject} className="text-xs bg-green-600 text-white px-3 py-1 rounded-full">+ Add Project</button>
            )}
          </div>
          <div className="space-y-12">
            {(isEditing ? editData.projects.items : projects.items).map((project: any, i: number) => (
              <div key={i} className="border-l-4 border-primary/20 pl-6 group relative">
                {isEditing && (
                  <button onClick={() => {
                    const filtered = editData.projects.items.filter((_: any, idx: number) => idx !== i);
                    setEditData({ ...editData, projects: { ...editData.projects, items: filtered } });
                  }} className="absolute -left-10 top-0 text-red-500 text-xl opacity-0 group-hover:opacity-100">×</button>
                )}
                <h4 className="text-xl font-bold mb-3">
                  <EditableText
                    value={project.name}
                    onChange={(v: any) => {
                      const updated = [...editData.projects.items];
                      updated[i].name = v;
                      setEditData({ ...editData, projects: { ...editData.projects, items: updated } });
                    }}
                    isEditing={isEditing}
                  />
                </h4>
                <div className="text-zinc-500 dark:text-zinc-400 mb-4">
                  <EditableTextarea
                    value={project.description}
                    onChange={(v: any) => {
                      const updated = [...editData.projects.items];
                      updated[i].description = v;
                      setEditData({ ...editData, projects: { ...editData.projects, items: updated } });
                    }}
                    isEditing={isEditing}
                  />
                </div>
                {isEditing && (
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <input className="text-xs p-1 bg-muted border border-border rounded" value={project.projectUrl} onChange={(e) => {
                      const updated = [...editData.projects.items];
                      updated[i].projectUrl = e.target.value;
                      setEditData({ ...editData, projects: { ...editData.projects, items: updated } });
                    }} placeholder="Demo Link" />
                    <input className="text-xs p-1 bg-muted border border-border rounded" value={project.githubUrl} onChange={(e) => {
                      const updated = [...editData.projects.items];
                      updated[i].githubUrl = e.target.value;
                      setEditData({ ...editData, projects: { ...editData.projects, items: updated } });
                    }} placeholder="GitHub Link" />
                  </div>
                )}
                <div className="flex gap-4 text-sm font-bold text-primary">
                  <a href={project.projectUrl} className="hover:underline">Live Demo</a>
                  <a href={project.githubUrl} className="hover:underline">GitHub</a>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="py-10 text-center border-t border-border opacity-50 text-xs">
        <p>© {footer.year} {footer.name}. Powered by Next.js</p>
      </footer>
    </div>
  );
}