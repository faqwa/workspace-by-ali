import { useState, useEffect } from 'react';

interface Project {
  id: string;
  name: string;
  category?: string;
}

interface ProjectSwitcherProps {
  projects: Project[];
}

export default function ProjectSwitcher({ projects }: ProjectSwitcherProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Load selected project from localStorage on mount
  useEffect(() => {
    const storedProjectId = localStorage.getItem('currentProjectId');
    if (storedProjectId && projects.some(p => p.id === storedProjectId)) {
      setSelectedProjectId(storedProjectId);
    } else if (projects.length > 0) {
      // Auto-select first project if none selected
      setSelectedProjectId(projects[0].id);
      localStorage.setItem('currentProjectId', projects[0].id);
    }
  }, [projects]);

  // Handle project selection
  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    localStorage.setItem('currentProjectId', projectId);
    setIsOpen(false);

    // Dispatch custom event so other components can react to project change
    window.dispatchEvent(new CustomEvent('projectChanged', { detail: { projectId } }));
  };

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  if (projects.length === 0) {
    return (
      <div class="px-4 py-3 border-b border-base-300">
        <a href="/projects/new" class="btn btn-sm bg-[#22c55e] hover:bg-[#16a34a] text-white border-0 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Create Project
        </a>
      </div>
    );
  }

  return (
    <div className="px-4 py-3 border-b border-base-300">
      <div className="text-xs font-semibold text-base-content/60 mb-2 uppercase tracking-wider">
        Current Project
      </div>

      <div className="dropdown dropdown-bottom w-full">
        <div
          tabIndex={0}
          role="button"
          className="btn btn-ghost btn-sm w-full justify-between normal-case font-normal h-auto py-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedProject ? (
            <div className="flex-1 text-left truncate">
              <div className="font-medium text-sm truncate">{selectedProject.name}</div>
              {selectedProject.category && (
                <div className="text-xs text-base-content/50 truncate">{selectedProject.category}</div>
              )}
            </div>
          ) : (
            <div className="flex-1 text-left text-base-content/50">
              Select a project
            </div>
          )}

          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>

        {isOpen && (
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-full mt-1 max-h-64 overflow-y-auto"
          >
            {projects.map((project) => (
              <li key={project.id}>
                <button
                  onClick={() => handleSelectProject(project.id)}
                  className={`w-full text-left ${selectedProjectId === project.id ? 'active' : ''}`}
                >
                  <div className="flex-1">
                    <div className="font-medium text-sm truncate">{project.name}</div>
                    {project.category && (
                      <div className="text-xs text-base-content/50 truncate">{project.category}</div>
                    )}
                  </div>
                  {selectedProjectId === project.id && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-4 h-4 text-primary"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                </button>
              </li>
            ))}

            <div className="divider my-1"></div>

            <li>
              <a href="/projects" className="text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
                View All Projects
              </a>
            </li>

            <li>
              <a href="/projects/new" className="text-success">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                New Project
              </a>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}
