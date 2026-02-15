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
  <div className="min-h-screen pb-20">
    {/* Clean, Fixed Navbar */}
    <nav className="nav-blur">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="text-xl font-extrabold tracking-tighter hover:opacity-80 transition">
          <EditableText
            value={isEditing ? editData.name : name}
            onChange={(v) => updateData(["name"], v)}
            isEditing={isEditing}
          />
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-6 text-sm font-medium text-gray-400">
            <a href="#about" className="hover:text-white transition">About</a>
            <a href="#projects" className="hover:text-white transition">Work</a>
          </div>
          
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-bold transition">Save</button>
                <button onClick={() => setIsEditing(false)} className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-full text-sm font-bold transition">Cancel</button>
              </>
            ) : (
              <button 
                onClick={() => isAuthenticated ? setIsEditing(true) : router.push("/login")}
                className="bg-white text-black px-5 py-2 rounded-full text-sm font-bold hover:bg-gray-200 transition"
              >
                {isAuthenticated ? "Edit Profile" : "Login"}
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>

    {/* Centered Main Content */}
    <main className="main-container pt-20 space-y-24">
      
      {/* Hero Section - Centered with spacing */}
      <section className="text-center space-y-8 py-10">
        <h2 className="text-5xl md:text-7xl leading-tight">
          <EditableText
            value={isEditing ? editData.hero.headline : hero.headline}
            onChange={(v) => updateData(["hero", "headline"], v)}
            isEditing={isEditing}
          />
        </h2>
        <div className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          <EditableTextarea
            value={isEditing ? editData.hero.subheadline : hero.subheadline}
            onChange={(v) => updateData(["hero", "subheadline"], v)}
            isEditing={isEditing}
          />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="portfolio-card">
        <h3 className="text-blue-500 text-sm font-bold uppercase tracking-widest mb-6">Discovery</h3>
        <div className="text-lg text-gray-300 leading-relaxed">
          <EditableTextarea
            value={isEditing ? editData.about.content : about.content}
            onChange={(v) => updateData(["about", "content"], v)}
            isEditing={isEditing}
            rows={5}
          />
        </div>
      </section>

      {/* Skills & Projects would follow the same .portfolio-card pattern */}
      
    </main>

    <footer className="mt-32 text-center text-gray-600 text-sm">
       <p>© {new Date().getFullYear()} {name}. Built with Next.js</p>
    </footer>
  </div>
);
}