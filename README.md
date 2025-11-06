# Workspace by Ali

A collaborative workspace platform for managing projects, updates, and creative work. Built with Astro 5, Supabase, Keystatic CMS, and modern web technologies.

## Features

- **Secure Authentication**: Email/password and GitHub OAuth with Supabase
- **Project Management**: Create, organize, and track creative projects with GitHub integration
- **Content Management**: Keystatic CMS for managing updates and content
- **GitHub Integration**: Connect repositories and sync project activities
- **Updates System**: Share project updates and progress with the community
- **Responsive Design**: Mobile-first UI built with Tailwind CSS and DaisyUI

## Tech Stack

- **Framework**: [Astro 5](https://astro.build) - Fast, modern web framework
- **Authentication**: [Supabase Auth](https://supabase.com/auth) - Secure user management with OAuth
- **Database**: [Supabase](https://supabase.com) - PostgreSQL with real-time capabilities
- **CMS**: [Keystatic](https://keystatic.com) - Git-based content management
- **GitHub API**: [Octokit](https://github.com/octokit/octokit.js) - GitHub integration and repository management
- **UI Components**: [Tremor](https://tremor.so) & [DaisyUI](https://daisyui.com) - Dashboard and UI components
- **Styling**: [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- **Deployment**: [Vercel](https://vercel.com) - Serverless deployment

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- Supabase account and project

### Installation

1. Clone the repository:
```sh
git clone https://github.com/yourusername/workspace-by-ali.git
cd workspace-by-ali
```

2. Install dependencies:
```sh
npm install
```

3. Set up environment variables:
```sh
cp .env.example .env
```

Edit `.env` and add your credentials:
- `PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `GITHUB_CLIENT_ID` - GitHub OAuth app client ID
- `GITHUB_CLIENT_SECRET` - GitHub OAuth app secret
- `ENCRYPTION_SECRET` - Secret key for token encryption

4. Run the development server:
```sh
npm run dev
```

Visit `http://localhost:4321` to see the app.

## Commands

| Command | Action |
| :-- | :-- |
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server at `localhost:4321` |
| `npm run build` | Build production site to `./dist/` |
| `npm run build:check` | Type check and build for production |
| `npm run preview` | Preview production build locally |
| `npm run format` | Format code with Prettier |
| `npm run session` | Run session updater script |

## Project Structure

```text
/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── layouts/     # Layout components
│   │   └── ui/          # UI components
│   ├── lib/            # Utilities and helpers
│   ├── middleware.ts   # Server middleware
│   ├── pages/          # Route pages
│   │   ├── api/        # API endpoints
│   │   │   ├── auth/   # Authentication endpoints
│   │   │   ├── projects/  # Project management
│   │   │   ├── repo/   # GitHub repository integration
│   │   │   └── updates/   # Updates management
│   │   └── ...         # Page routes
│   └── env.d.ts        # TypeScript declarations
├── content/            # Keystatic content
├── docs/               # Documentation
├── scripts/            # Build and utility scripts
├── keystatic.config.ts # Keystatic CMS configuration
└── astro.config.mjs    # Astro configuration
```

## Roadmap

- [x] Phase 1: Authentication & Core Infrastructure
- [x] GitHub OAuth Integration
- [x] Keystatic CMS Integration
- [ ] Phase 2: Project & Update Management
- [ ] Phase 3: Data Visualization & Analytics
- [ ] Phase 4: Collaboration Features
- [ ] Phase 5: Advanced Features (AI integration, templates)

See `/docs` directory for detailed development documentation and session handoffs.

## Acknowledgements

This project was inspired by and incorporates patterns from the following open-source repositories:

### UI & Dashboard Components
- **[astro-dashboard](https://github.com/alexwhitmore/astro-dashboard)** by [@alexwhitmore](https://github.com/alexwhitmore)
  - Dashboard layout patterns and structure
  - Tremor integration examples
  - Responsive design patterns

### Documentation & Components
- **[astro-mintlify](https://github.com/alexwhitmore/astro-mintlify)** by [@alexwhitmore](https://github.com/alexwhitmore)
  - RadixUI component patterns
  - Documentation structure inspiration

### Reference Projects
- **[astro-supabase](https://github.com/kevinzunigacuellar/astro-supabase)** by [@kevinzunigacuellar](https://github.com/kevinzunigacuellar)
  - Astro + Supabase integration reference

- **[seeds](https://github.com/recruitseeds/seeds)** by [@recruitseeds](https://github.com/recruitseeds)
  - Modern monorepo patterns
  - shadcn-ui component inspiration

Special thanks to these developers for sharing their work with the open-source community!

## License

MIT

## Contact

Created by Ali - [xbyali.page](https://xbyali.page)
