import { formatDistanceToNow } from 'date-fns';

interface Activity {
  id: string;
  title: string;
  description?: string;
  timestamp: Date;
  type?: 'project' | 'update' | 'subproject' | 'submission';
  icon?: React.ReactNode;
}

interface ActivityLogProps {
  activities: Activity[];
  limit?: number;
  showViewAll?: boolean;
}

export default function ActivityLog({ activities, limit = 5, showViewAll = true }: ActivityLogProps) {
  const displayedActivities = limit ? activities.slice(0, limit) : activities;

  const formatTimestamp = (timestamp: Date) => {
    try {
      // Check if timestamp is valid
      if (!timestamp || !(timestamp instanceof Date) || isNaN(timestamp.getTime())) {
        return 'Recently';
      }
      return formatDistanceToNow(timestamp, { addSuffix: true });
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return 'Recently';
    }
  };

  const getDefaultIcon = (type?: string) => {
    switch (type) {
      case 'project':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6z" />
          </svg>
        );
      case 'update':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
          </svg>
        );
      case 'subproject':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  if (displayedActivities.length === 0) {
    return (
      <div className="text-center py-8 text-base-content/60">
        <p>No recent activity</p>
      </div>
    );
  }

  return (
    <div>
      <ul className="timeline timeline-vertical">
        {displayedActivities.map((activity, index) => (
          <li key={activity.id}>
            {index !== 0 && <hr />}
            <div className="timeline-start timeline-box">
              <div className="flex items-start gap-3">
                <div className="text-primary mt-1">
                  {activity.icon || getDefaultIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{activity.title}</h4>
                  {activity.description && (
                    <p className="text-sm text-base-content/60 mt-1">{activity.description}</p>
                  )}
                  <p className="text-xs text-base-content/50 mt-2">
                    {formatTimestamp(activity.timestamp)}
                  </p>
                </div>
              </div>
            </div>
            <div className="timeline-middle">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-primary">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="timeline-end"></div>
            {index !== displayedActivities.length - 1 && <hr />}
          </li>
        ))}
      </ul>

      {showViewAll && activities.length > limit && (
        <div className="text-center mt-4">
          <a href="/updates" className="btn btn-ghost btn-sm">
            View all updates →
          </a>
        </div>
      )}
    </div>
  );
}
