"use client";
import React, { useState } from 'react';
import { EditableText } from './components/EditableText';
import { EditableTextarea } from './components/EditableTextarea';
// Assuming these are your custom components based on previous steps
// import { EditableText, EditableTextarea } from './components/Editable';

export default function PortfolioPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isAuthenticated] = useState(true); // Placeholder for your auth logic

  // Sample State Structure
  const [data, setData] = useState({
    name: "Your Name",
    hero: {
      headline: "Building Digital Excellence",
      subheadline: "A senior developer specializing in high-performance web applications and elegant user interfaces."
    },
    about: {
      content: "I'm a developer with a passion for clean code and centered layouts. I believe that whitespace is just as important as the code itself."
    },
    skills: {
      categories: [
        { name: "Frontend", items: "React, Next.js, Tailwind CSS" },
        { name: "Backend", items: "Node.js, PostgreSQL, Python" }
      ]
    },
    projects: [
      { title: "Project Alpha", description: "A high-end dashboard built with precision." }
    ]
  });

  const [editData, setEditData] = useState(data);

  // --- Logic Helpers ---
  const handleSave = () => {
    setData(editData);
    setIsEditing(false);
  };

  const addSkillCategory = () => {
    setEditData({
      ...editData,
      skills: {
        categories: [...editData.skills.categories, { name: "New Category", items: "Skill 1, Skill 2" }]
      }
    });
  };

  const removeSkillCategory = (index: number) => {
    const filtered = editData.skills.categories.filter((_, i) => i !== index);
    setEditData({ ...editData, skills: { categories: filtered } });
  };

  const addProject = () => {
    setEditData({
      ...editData,
      projects: [...editData.projects, { title: "New Project", description: "Description goes here" }]
    });
  };

  const removeProject = (index: number) => {
    const filtered = editData.projects.filter((_, i) => i !== index);
    setEditData({ ...editData, projects: filtered });
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* 1. STICKY NAVBAR */}
      <nav className="nav-blur">
        <div className="w-full max-w-5xl px-6 h-20 flex items-center justify-between">
          <div className="text-xl font-bold tracking-tighter">
            {data.name}
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
              <a href="#about" className="hover:text-white transition">About</a>
              <a href="#skills" className="hover:text-white transition">Skills</a>
              <a href="#projects" className="hover:text-white transition">Work</a>
            </div>
            
            <div className="flex gap-3">
              {isEditing ? (
                <>
                  <button onClick={handleSave} className="btn-main !py-2 !px-5 !text-sm !bg-blue-600 !text-white shadow-lg shadow-blue-500/20">Save Changes</button>
                  <button onClick={() => setIsEditing(false)} className="text-sm font-bold text-slate-400 px-2">Cancel</button>
                </>
              ) : (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="btn-main !py-2 !px-5 !text-sm border border-slate-700 !bg-transparent !text-white hover:!bg-slate-800"
                >
                  Edit Portfolio
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* 2. MAIN CONTENT AREA */}
      <main className="content-wrapper py-20 space-y-32">
        
        {/* HERO SECTION */}
        <section className="flex flex-col items-center py-12">
          <div className="hero-title">
            <EditableText
              value={isEditing ? editData.hero.headline : data.hero.headline}
              onChange={(v: string) => setEditData({...editData, hero: {...editData.hero, headline: v}})}
              isEditing={isEditing}
            />
          </div>
          <div className="text-xl text-slate-400 max-w-2xl leading-relaxed">
            <EditableTextarea
              value={isEditing ? editData.hero.subheadline : data.hero.subheadline}
              onChange={(v: string) => setEditData({...editData, hero: {...editData.hero, subheadline: v}})}
              isEditing={isEditing}
            />
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section id="about" className="portfolio-card">
          <span className="text-blue-500 font-black tracking-[0.3em] uppercase text-xs mb-8">Background</span>
          <div className="text-xl text-slate-300 leading-relaxed max-w-2xl">
            <EditableTextarea
              value={isEditing ? editData.about.content : data.about.content}
              onChange={(v: string) => setEditData({...editData, about: {content: v}})}
              isEditing={isEditing}
              rows={4}
            />
          </div>
        </section>

        {/* SKILLS SECTION */}
        <section id="skills" className="portfolio-card relative">
          <span className="text-emerald-500 font-black tracking-[0.3em] uppercase text-xs mb-10">Expertise</span>
          
          {isEditing && (
            <button onClick={addSkillCategory} className="absolute top-10 right-10 text-emerald-500 text-xs font-bold hover:underline">
              + Add Category
            </button>
          )}

          <div className="grid md:grid-cols-2 gap-16 w-full max-w-3xl">
            {(isEditing ? editData.skills.categories : data.skills.categories).map((cat, i) => (
              <div key={i} className="flex flex-col items-center group relative">
                {isEditing && (
                  <button onClick={() => removeSkillCategory(i)} className="absolute -right-4 -top-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                )}
                <h4 className="font-bold text-lg mb-3">
                  <EditableText 
                    value={cat.name} 
                    isEditing={isEditing} 
                    onChange={(v: string) => {
                      const newCats = [...editData.skills.categories];
                      newCats[i].name = v;
                      setEditData({...editData, skills: {categories: newCats}});
                    }}
                  />
                </h4>
                <div className="text-slate-500 text-center italic">
                  <EditableText 
                    value={cat.items} 
                    isEditing={isEditing} 
                    onChange={(v: string) => {
                      const newCats = [...editData.skills.categories];
                      newCats[i].items = v;
                      setEditData({...editData, skills: {categories: newCats}});
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section id="projects" className="w-full flex flex-col items-center gap-12">
          <div className="flex items-baseline gap-4">
             <h3 className="text-4xl font-extrabold tracking-tight">Recent Work</h3>
             {isEditing && (
               <button onClick={addProject} className="text-blue-500 text-xs font-bold hover:underline">+ Add Project</button>
             )}
          </div>

          <div className="grid gap-10 w-full">
            {(isEditing ? editData.projects : data.projects).map((project, i) => (
              <div key={i} className="portfolio-card group relative">
                {isEditing && (
                  <button onClick={() => removeProject(i)} className="absolute top-10 right-10 text-red-500 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">Remove</button>
                )}
                <div className="max-w-xl">
                  <h4 className="text-2xl font-bold mb-4">
                    <EditableText 
                      value={project.title} 
                      isEditing={isEditing} 
                      onChange={(v: string) => {
                        const newProjs = [...editData.projects];
                        newProjs[i].title = v;
                        setEditData({...editData, projects: newProjs});
                      }}
                    />
                  </h4>
                  <p className="text-slate-400 mb-6">
                    <EditableTextarea 
                      value={project.description} 
                      isEditing={isEditing} 
                      onChange={(v: string) => {
                        const newProjs = [...editData.projects];
                        newProjs[i].description = v;
                        setEditData({...editData, projects: newProjs});
                      }}
                    />
                  </p>
                  <div className="flex justify-center gap-8 text-sm font-bold text-blue-500">
                    <button className="hover:text-blue-400 transition">View Case Study</button>
                    <button className="hover:text-blue-400 transition">GitHub</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      <footer className="w-full py-20 border-t border-white/5 mt-20 text-center text-slate-600 text-sm">
        <p>© {new Date().getFullYear()} {data.name}. All Rights Reserved.</p>
      </footer>
    </div>
  );
}