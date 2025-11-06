interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon && (
        <div className="text-base-content/30 mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-base-content mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-base-content/60 max-w-md mb-6">{description}</p>
      )}
      {action && (
        action.href ? (
          <a href={action.href} className="btn bg-[#22c55e] hover:bg-[#16a34a] text-white border-0">
            {action.label}
          </a>
        ) : (
          <button onClick={action.onClick} className="btn bg-[#22c55e] hover:bg-[#16a34a] text-white border-0">
            {action.label}
          </button>
        )
      )}
    </div>
  );
}
