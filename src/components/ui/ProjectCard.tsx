import { formatDistanceToNow } from 'date-fns';

interface Project {
  id: string;
  name: string;
  description?: string;
  category?: string;
  visibility: 'public' | 'private';
  created_at: string;
}

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const truncateDescription = (text: string | undefined, maxLength: number = 120) => {
    if (!text) return 'No description';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const getCategoryColor = (category: string | undefined) => {
    if (!category) return 'bg-base-200 text-base-content';

    const colors: Record<string, string> = {
      'research': 'bg-personal-primary/10 text-personal-primary border border-personal-primary/20',
      'development': 'bg-commons-primary/10 text-commons-primary border border-commons-primary/20',
      'design': 'bg-purple-500/10 text-purple-600 border border-purple-500/20',
      'documentation': 'bg-blue-500/10 text-blue-600 border border-blue-500/20',
      'experiment': 'bg-amber-500/10 text-amber-600 border border-amber-500/20',
      'other': 'bg-base-200 text-base-content',
    };

    return colors[category.toLowerCase()] || 'bg-base-200 text-base-content';
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Unknown date';
    }
  };

  return (
    <a href={`/projects/${project.id}`} className="project-card">
      {/* Header */}
      <div className="card-header">
        <div className="card-title-area">
          <h3 className="project-title">
            {project.name}
            {project.visibility === 'private' && (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="lock-icon">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            )}
          </h3>
        </div>
        <div className="card-actions">
          <button className="action-btn" onClick={(e) => { e.preventDefault(); /* Add menu logic */ }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="project-description">
        {truncateDescription(project.description)}
      </p>

      {/* Category Tag */}
      {project.category && (
        <span className="project-tag">
          {project.category}
        </span>
      )}

      {/* Footer */}
      <div className="project-meta">
        <div className="meta-item">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {formatDate(project.created_at)}
        </div>
        <div className="meta-item">
          {project.visibility === 'public' ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
              Public
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              Private
            </>
          )}
        </div>
      </div>
    </a>
  );
}
