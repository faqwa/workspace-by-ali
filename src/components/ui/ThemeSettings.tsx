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
        <label className="form-label">
          Color Theme
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Light Theme Card */}
          <div
            onClick={() => handleThemeChange('workspace-light')}
            className={`cursor-pointer border-2 rounded-lg p-4 transition-all hover:shadow-md ${
              theme === 'workspace-light'
                ? 'border-primary bg-primary/5 dark:bg-primary/10'
                : 'border-gray-200 dark:border-gray-700 hover:border-primary/30'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <input
                type="radio"
                name="theme"
                className="w-4 h-4 border-gray-300 text-primary focus:ring-2 focus:ring-primary/20"
                checked={theme === 'workspace-light'}
                onChange={() => handleThemeChange('workspace-light')}
              />
              <div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">Light</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Clean and bright</div>
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
                ? 'border-primary bg-primary/5 dark:bg-primary/10'
                : 'border-gray-200 dark:border-gray-700 hover:border-primary/30'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <input
                type="radio"
                name="theme"
                className="w-4 h-4 border-gray-300 text-primary focus:ring-2 focus:ring-primary/20"
                checked={theme === 'workspace-dark'}
                onChange={() => handleThemeChange('workspace-dark')}
              />
              <div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">Dark</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Easy on the eyes</div>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="w-full h-8 bg-[#0a0a0a] border border-gray-700 rounded"></div>
              <div className="w-full h-8 bg-[#0f0f0f] border border-gray-700 rounded"></div>
              <div className="w-full h-8 bg-[#131313] border border-gray-700 rounded"></div>
            </div>
          </div>
        </div>
        <div className="form-hint mt-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Your theme preference is saved automatically</span>
        </div>
      </div>

      {/* Quick Theme Info */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="shrink-0 w-5 h-5 text-blue-600 dark:text-blue-400"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <span className="text-sm text-blue-800 dark:text-blue-200">
          Theme changes apply instantly and are saved to your browser
        </span>
      </div>
    </div>
  );
}
