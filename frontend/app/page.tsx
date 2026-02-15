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
  <div className="w-full flex flex-col items-center">
    {/* Navbar - Centered Content */}
    <nav className="nav-blur">
      <div className="w-full max-w-5xl px-6 h-20 flex items-center justify-between">
        <div className="text-xl font-bold tracking-tighter">
          <EditableText
            value={isEditing ? editData.name : name}
            onChange={(v: string) => updateData(["name"], v)}
            isEditing={isEditing}
          />
        </div>

        <div className="flex items-center gap-4">
          {isEditing ? (
            <div className="flex gap-2">
              <button onClick={handleSave} className="btn-main !py-2 !px-5 !text-sm !bg-blue-600 !text-white">Save</button>
              <button onClick={() => setIsEditing(false)} className="text-sm font-bold text-slate-400 px-4">Cancel</button>
            </div>
          ) : (
            <button 
              onClick={() => isAuthenticated ? setIsEditing(true) : router.push("/login")}
              className="btn-main !py-2 !px-5 !text-sm"
            >
              {isAuthenticated ? "Edit Profile" : "Login"}
            </button>
          )}
        </div>
      </div>
    </nav>

    {/* Main Body - All Centered */}
    <main className="content-wrapper py-20 space-y-24">
      
      {/* Hero Section */}
      <section className="flex flex-col items-center py-10">
        <h2 className="hero-title">
          <EditableText
            value={isEditing ? editData.hero.headline : hero.headline}
            onChange={(v: string) => updateData(["hero", "headline"], v)}
            isEditing={isEditing}
          />
        </h2>
        <div className="text-xl text-slate-400 max-w-xl leading-relaxed">
          <EditableTextarea
            value={isEditing ? editData.hero.subheadline : hero.subheadline}
            onChange={(v: string) => updateData(["hero", "subheadline"], v)}
            isEditing={isEditing}
          />
        </div>
        <div className="flex gap-4 mt-10">
           <a href="#projects" className="btn-main">My Work</a>
           <a href="#contact" className="px-8 py-3 border border-slate-700 rounded-full font-bold hover:bg-slate-800 transition">Contact</a>
        </div>
      </section>

      {/* About Section - Card Pattern */}
      <section id="about" className="portfolio-card">
        <span className="text-blue-500 font-black tracking-[0.3em] uppercase text-xs mb-6">About</span>
        <div className="text-xl text-slate-300 leading-relaxed max-w-2xl">
          <EditableTextarea
            value={isEditing ? editData.about.content : about.content}
            onChange={(v: string) => updateData(["about", "content"], v)}
            isEditing={isEditing}
            rows={4}
          />
        </div>
      </section>

      {/* Skills Section - Centered Grid */}
      <section id="skills" className="portfolio-card">
        <span className="text-emerald-500 font-black tracking-[0.3em] uppercase text-xs mb-8">Expertise</span>
        <div className="grid md:grid-cols-2 gap-12 w-full max-w-3xl">
          {(isEditing ? editData.skills.categories : skills.categories).map((cat: any, i: number) => (
            <div key={i} className="flex flex-col items-center">
              <h4 className="font-bold text-lg mb-2">
                 <EditableText 
                    value={cat.name} 
                    isEditing={isEditing} 
                    onChange={(v: string) => {
                       const newCats = [...editData.skills.categories];
                       newCats[i].name = v;
                       setEditData({...editData, skills: {...editData.skills, categories: newCats}});
                    }}
                 />
              </h4>
              <div className="text-slate-500 italic">
                 <EditableText 
                    value={cat.items} 
                    isEditing={isEditing} 
                    onChange={(v: string) => {
                       const newCats = [...editData.skills.categories];
                       newCats[i].items = v;
                       setEditData({...editData, skills: {...editData.skills, categories: newCats}});
                    }}
                 />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  </div>
);
}