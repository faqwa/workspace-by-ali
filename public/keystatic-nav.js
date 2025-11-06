// Inject navigation bar for Keystatic editor
(function() {
  // Only run on /keystatic pages
  if (!window.location.pathname.startsWith('/keystatic')) return;

  // Wait for page to be ready
  function injectNavBar() {
    // Check if nav bar already exists
    if (document.querySelector('.workspace-nav-bar')) return;

    // Create navigation bar
    const navBar = document.createElement('div');
    navBar.className = 'workspace-nav-bar';
    navBar.innerHTML = `
      <div class="workspace-nav-left">
        <h1 class="workspace-nav-title">Content Editor</h1>
        <span class="workspace-nav-badge">Keystatic</span>
      </div>
      <div>
        <a href="/" class="workspace-nav-button">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="workspace-nav-icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Dashboard
        </a>
      </div>
    `;

    // Create and inject styles
    const style = document.createElement('style');
    style.textContent = `
      body {
        padding-top: 60px !important;
      }
      .workspace-nav-bar {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 60px;
        background: #1f2937;
        color: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 1.5rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        z-index: 99999;
      }
      .workspace-nav-left {
        display: flex;
        align-items: center;
        gap: 1rem;
      }
      .workspace-nav-title {
        font-size: 1rem;
        font-weight: 600;
        margin: 0;
      }
      .workspace-nav-badge {
        background: #22c55e;
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        font-size: 0.75rem;
        font-weight: 600;
      }
      .workspace-nav-button {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: rgba(255, 255, 255, 0.1);
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 0.375rem;
        cursor: pointer;
        font-size: 0.875rem;
        text-decoration: none;
        transition: background 0.2s;
        font-family: system-ui, -apple-system, sans-serif;
      }
      .workspace-nav-button:hover {
        background: rgba(255, 255, 255, 0.2);
      }
      .workspace-nav-icon {
        width: 1rem;
        height: 1rem;
      }
    `;

    // Inject into page
    document.head.appendChild(style);
    document.body.insertBefore(navBar, document.body.firstChild);
  }

  // Try to inject immediately
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectNavBar);
  } else {
    injectNavBar();
  }

  // Also try after a short delay (in case content loads dynamically)
  setTimeout(injectNavBar, 100);
  setTimeout(injectNavBar, 500);
})();
