import { useState, useEffect } from 'react';

interface PublishStatus {
  success: boolean;
  has_repo: boolean;
  forked?: boolean;
  has_unpublished_changes?: boolean;
  commits_ahead?: number;
  commits_behind?: number;
  compare_url?: string;
  repo_url?: string;
}

export default function PublishWidget() {
  const [status, setStatus] = useState<PublishStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch publish status
  const fetchStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/publish');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('Failed to fetch publish status:', error);
      setStatus(null);
    } finally {
      setLoading(false);
    }
  };

  // Load status on mount
  useEffect(() => {
    fetchStatus();
  }, []);

  // Handle publish
  const handlePublish = async () => {
    setPublishing(true);
    setMessage(null);

    try {
      const response = await fetch('/api/publish', { method: 'POST' });
      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          text: data.up_to_date ? 'Already up to date!' : 'Changes published successfully!',
        });
        // Refresh status after publish
        setTimeout(() => {
          fetchStatus();
          setMessage(null);
        }, 2000);
      } else {
        setMessage({
          type: 'error',
          text: data.error || 'Failed to publish changes',
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Network error - failed to publish',
      });
    } finally {
      setPublishing(false);
    }
  };

  // Don't show widget if no repo
  if (!loading && (!status?.has_repo || !status?.forked)) {
    return null;
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h3 className="card-title text-base">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          Publish Status
        </h3>

        {loading ? (
          <div className="flex items-center gap-2">
            <span className="loading loading-spinner loading-sm"></span>
            <span className="text-sm text-base-content/60">Checking status...</span>
          </div>
        ) : status?.has_unpublished_changes ? (
          <>
            <div className="alert alert-warning py-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span className="text-sm">
                <strong>{status.commits_ahead}</strong> unpublished change{status.commits_ahead !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <button
                onClick={handlePublish}
                disabled={publishing}
                className="btn btn-primary btn-sm"
              >
                {publishing ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    Publishing...
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                      />
                    </svg>
                    Publish to Main
                  </>
                )}
              </button>

              {status.compare_url && (
                <a
                  href={status.compare_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost btn-xs"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-3 h-3"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                    />
                  </svg>
                  View Changes
                </a>
              )}
            </div>
          </>
        ) : (
          <div className="alert alert-success py-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm">All changes published</span>
          </div>
        )}

        {message && (
          <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'} py-2 mt-2`}>
            <span className="text-sm">{message.text}</span>
          </div>
        )}
      </div>
    </div>
  );
}
