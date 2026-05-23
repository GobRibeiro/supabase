"use client";

import { useState, useEffect } from "react";

function useTheme() {
  const [theme, setTheme] = useState("system");

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
    }
  }, []);

  function cycleTheme() {
    const next =
      theme === "system" ? "light" : theme === "light" ? "dark" : "system";
    setTheme(next);
    if (next === "system") {
      localStorage.removeItem("theme");
      document.documentElement.removeAttribute("data-theme");
    } else {
      localStorage.setItem("theme", next);
      document.documentElement.setAttribute("data-theme", next);
    }
  }

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  return { theme, isDark, cycleTheme };
}

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [checklists, setChecklists] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [checklistTitle, setChecklistTitle] = useState("");
  const { theme, isDark, cycleTheme } = useTheme();

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchChecklists(selectedProject.id);
    } else {
      setChecklists([]);
    }
  }, [selectedProject]);

  async function fetchProjects() {
    const res = await fetch(`/api/projects`);
    const data = await res.json();
    setProjects(data);
  }

  async function fetchChecklists(projectId) {
    const res = await fetch(`/api/projects/${projectId}/checklists`);
    const data = await res.json();
    setChecklists(data);
  }

  async function createProject(e) {
    e.preventDefault();
    if (!projectName.trim()) return;

    const res = await fetch(`/api/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: projectName.trim() }),
    });
    const newProject = await res.json();
    setProjects([newProject, ...projects]);
    setProjectName("");
    setSelectedProject(newProject);
  }

  async function createChecklist(e) {
    e.preventDefault();
    if (!checklistTitle.trim() || !selectedProject) return;

    const res = await fetch(
      `/api/projects/${selectedProject.id}/checklists`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: checklistTitle.trim() }),
      }
    );
    const newItem = await res.json();
    setChecklists([...checklists, newItem]);
    setChecklistTitle("");
  }

  async function toggleDone(checklistId) {
    const res = await fetch(`/api/checklists/${checklistId}`, {
      method: "PATCH",
    });
    const updated = await res.json();
    setChecklists(
      checklists.map((c) => (c.id === checklistId ? updated : c))
    );
  }

  async function deleteChecklist(checklistId) {
    await fetch(`/api/checklists/${checklistId}`, {
      method: "DELETE",
    });
    setChecklists(checklists.filter((c) => c.id !== checklistId));
  }

  const themeIcon = theme === "system" ? "\u{1F5A5}" : isDark ? "\u{1F319}" : "\u2600\uFE0F";
  const themeLabel =
    theme === "system" ? "Sistema" : theme === "light" ? "Claro" : "Escuro";

  return (
    <div className="app-layout">
      <header className="header">
        <h1>Supabase Tutorial</h1>
        <button
          className="theme-toggle"
          onClick={cycleTheme}
          title={`Tema: ${themeLabel}`}
          aria-label={`Alternar tema (atual: ${themeLabel})`}
        >
          {themeIcon}
        </button>
      </header>

      <aside className="sidebar">
        <h2>Projetos</h2>
        <form className="sidebar-form" onSubmit={createProject}>
          <input
            type="text"
            placeholder="Nome do projeto..."
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
          <button type="submit" className="btn">
            + Novo Projeto
          </button>
        </form>
        <nav className="project-list">
          {projects.map((p) => (
            <button
              key={p.id}
              className={`project-item ${selectedProject?.id === p.id ? "active" : ""}`}
              onClick={() => setSelectedProject(p)}
            >
              {p.name}
            </button>
          ))}
          {projects.length === 0 && (
            <p className="empty-msg">Nenhum projeto ainda.</p>
          )}
        </nav>
      </aside>

      <main className="main-content">
        {selectedProject ? (
          <>
            <h2>Checklist — {selectedProject.name}</h2>
            <form className="checklist-form" onSubmit={createChecklist}>
              <input
                type="text"
                placeholder="Nova tarefa..."
                value={checklistTitle}
                onChange={(e) => setChecklistTitle(e.target.value)}
              />
              <button type="submit" className="btn">
                Adicionar
              </button>
            </form>
            <div>
              {checklists.map((item) => (
                <div key={item.id} className="checklist-item">
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={() => toggleDone(item.id)}
                  />
                  <span className={item.done ? "done" : ""}>{item.title}</span>
                  <button
                    className="delete-btn"
                    onClick={() => deleteChecklist(item.id)}
                    title="Deletar"
                  >
                    x
                  </button>
                </div>
              ))}
              {checklists.length === 0 && (
                <p className="empty-msg">Nenhuma tarefa ainda.</p>
              )}
            </div>
          </>
        ) : (
          <div className="empty-state">
            <span>&#8592;</span>
            <p>Selecione um projeto na sidebar</p>
          </div>
        )}
      </main>
    </div>
  );
}
