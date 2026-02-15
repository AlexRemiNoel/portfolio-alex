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
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">Loading portfolio...</p>
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
      alert("Failed to save portfolio.");
    }
    setIsSaving(false);
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

  return (
    <div className="min-h-screen bg-background transition-smooth">
      {/* Controls Bar */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur border-b border-border py-3 px-6 shadow-md">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            {isAuthenticated && (
              <span className="text-sm text-accent flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
                Authenticated
              </span>
            )}
          </div>
          <div className="flex gap-3">
            {isEditing ? (
              <>
                <button onClick={handleSave} className="px-4 py-2 bg-accent text-white rounded-lg font-medium hover:opacity-90">
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
                <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium">
                  Cancel
                </button>
              </>
            ) : (
              <button onClick={() => isAuthenticated ? setIsEditing(true) : router.push("/login")} className="px-4 py-2 bg-primary text-white rounded-lg font-medium">
                {isAuthenticated ? "Edit Portfolio" : "Login to Edit"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-16 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            <EditableText
              value={isEditing ? editData.name : name}
              onChange={(v) => updateData(["name"], v)}
              isEditing={isEditing}
            />
          </h1>
          <div className="flex gap-6 text-sm font-medium">
            {["about", "skills", "projects", "contact"].map((item) => (
              <a key={item} href={`#${item}`} className="hover:text-primary transition-smooth capitalize">
                {portfolioData[item].title}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        {/* Hero Section */}
        <section className="fade-in-up py-20 text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <EditableText
              value={isEditing ? editData.hero.headline : hero.headline}
              onChange={(v) => updateData(["hero", "headline"], v)}
              isEditing={isEditing}
            />
          </h2>
          <div className="text-xl text-zinc-600 dark:text-zinc-400 mb-8 max-w-2xl mx-auto">
            <EditableTextarea
              value={isEditing ? editData.hero.subheadline : hero.subheadline}
              onChange={(v) => updateData(["hero", "subheadline"], v)}
              isEditing={isEditing}
            />
          </div>
          <div className="flex gap-4 justify-center">
            <a href="#projects" className="hero-button bg-primary text-white">View My Work</a>
            <a href="/contact" className="hero-button border border-primary text-primary">Get In Touch</a>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="card fade-in-up">
          <h3 className="text-3xl font-bold mb-6">{about.title}</h3>
          <div className="text-lg leading-relaxed">
            <EditableTextarea
              value={isEditing ? editData.about.content : about.content}
              onChange={(v) => updateData(["about", "content"], v)}
              isEditing={isEditing}
            />
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="card fade-in-up">
          <h3 className="text-3xl font-bold mb-8">{skills.title}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {(isEditing ? editData.skills.categories : skills.categories).map((cat: any, i: number) => (
              <div key={i}>
                <h4 className="font-semibold text-primary mb-3">{cat.name}</h4>
                <p className="text-zinc-600 dark:text-zinc-400">{cat.items}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="card fade-in-up">
          <h3 className="text-3xl font-bold mb-8">{projects.title}</h3>
          <div className="grid gap-6">
            {(isEditing ? editData.projects.items : projects.items).map((project: any, i: number) => (
              <div key={i} className="p-6 border border-border rounded-lg hover:shadow-md transition-smooth">
                <h4 className="text-xl font-semibold mb-2">{project.name}</h4>
                <p className="text-zinc-600 dark:text-zinc-400 mb-4">{project.description}</p>
                <div className="flex gap-4 text-sm font-medium">
                  <a href={project.projectUrl} className="text-primary hover:underline">Live Demo</a>
                  <a href={project.githubUrl} className="text-primary hover:underline">GitHub</a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="card text-center fade-in-up">
          <h3 className="text-3xl font-bold mb-6">{contact.title}</h3>
          <p className="mb-8">{contact.message}</p>
          <div className="flex gap-6 justify-center mb-8">
            {contact.links.map((link: any, i: number) => (
              <a key={i} href={link.url} className="text-primary hover:underline font-medium">
                {link.name}
              </a>
            ))}
          </div>
          <a href="/contact" className="hero-button bg-primary text-white">Send Me a Message</a>
        </section>
      </main>

      <footer className="py-12 text-center text-sm border-t border-border">
        <p>© {footer.year} {footer.name}. Built with FastAPI & Next.js</p>
      </footer>
    </div>
  );
}