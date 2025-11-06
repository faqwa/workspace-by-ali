import { useEffect, useState } from 'react';

export default function ThemeSettings() {
  const [theme, setTheme] = useState<'workspace-light' | 'workspace-dark'>('workspace-light');

  useEffect(() => {
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem('theme') as 'workspace-light' | 'workspace-dark' | null;

    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const defaultTheme = prefersDark ? 'workspace-dark' : 'workspace-light';
      setTheme(defaultTheme);
      document.documentElement.setAttribute('data-theme', defaultTheme);
    }
  }, []);

  const handleThemeChange = (newTheme: 'workspace-light' | 'workspace-dark') => {
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <div className="space-y-4">
      {/* Theme Selection */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Color Theme</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Light Theme Card */}
          <div
            onClick={() => handleThemeChange('workspace-light')}
            className={`cursor-pointer border-2 rounded-lg p-4 transition-all hover:shadow-md ${
              theme === 'workspace-light'
                ? 'border-primary bg-primary/5'
                : 'border-base-300 hover:border-primary/30'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <input
                type="radio"
                name="theme"
                className="radio radio-primary"
                checked={theme === 'workspace-light'}
                onChange={() => handleThemeChange('workspace-light')}
              />
              <div>
                <div className="font-semibold">Light</div>
                <div className="text-xs text-base-content/60">Clean and bright</div>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="w-full h-8 bg-white border border-gray-200 rounded"></div>
              <div className="w-full h-8 bg-gray-50 border border-gray-200 rounded"></div>
              <div className="w-full h-8 bg-gray-100 border border-gray-200 rounded"></div>
            </div>
          </div>

          {/* Dark Theme Card */}
          <div
            onClick={() => handleThemeChange('workspace-dark')}
            className={`cursor-pointer border-2 rounded-lg p-4 transition-all hover:shadow-md ${
              theme === 'workspace-dark'
                ? 'border-primary bg-primary/5'
                : 'border-base-300 hover:border-primary/30'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <input
                type="radio"
                name="theme"
                className="radio radio-primary"
                checked={theme === 'workspace-dark'}
                onChange={() => handleThemeChange('workspace-dark')}
              />
              <div>
                <div className="font-semibold">Dark</div>
                <div className="text-xs text-base-content/60">Easy on the eyes</div>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="w-full h-8 bg-[#0a0a0a] border border-gray-700 rounded"></div>
              <div className="w-full h-8 bg-[#0f0f0f] border border-gray-700 rounded"></div>
              <div className="w-full h-8 bg-[#131313] border border-gray-700 rounded"></div>
            </div>
          </div>
        </div>
        <label className="label">
          <span className="label-text-alt">
            Your theme preference is saved automatically
          </span>
        </label>
      </div>

      {/* Quick Theme Info */}
      <div className="alert alert-info">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="stroke-current shrink-0 w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <span className="text-sm">
          Theme changes apply instantly and are saved to your browser
        </span>
      </div>
    </div>
  );
}
