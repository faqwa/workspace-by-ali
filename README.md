# Workspace by Ali

A collaborative workspace platform for managing projects, streams, and creative work. Built with Astro 5, Supabase, and modern web technologies.

## Features

- **Secure Authentication**: Email/password and OAuth support with Supabase
- **Project Management**: Create, organize, and track creative projects
- **Stream-based Workflows**: Organize work into streams with submission tracking
- **Dashboard Analytics**: Visualize project activity and metrics (coming soon)
- **Responsive Design**: Mobile-first UI built with Tailwind CSS

## Tech Stack

- **Framework**: [Astro 5](https://astro.build) - Fast, modern web framework
- **Authentication**: [Supabase Auth](https://supabase.com/auth) - Secure user management
- **Database**: [Supabase](https://supabase.com) - PostgreSQL with real-time capabilities
- **UI Components**: [Tremor](https://tremor.so) - Dashboard and data visualization
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

Edit `.env` and add your Supabase credentials:
- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

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
| `npm run preview` | Preview production build locally |
| `npm run astro check` | Run TypeScript type checking |

## Project Structure

```text
/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   ├── layouts/         # Page layouts
│   ├── lib/            # Utilities and helpers
│   ├── middleware/     # Server middleware
│   ├── pages/          # Route pages
│   │   ├── api/        # API endpoints
│   │   └── ...         # Page routes
│   └── env.d.ts        # TypeScript declarations
├── docs/               # Documentation
└── astro.config.mjs    # Astro configuration
```

## Roadmap

- [x] Phase 1: Authentication & Core Infrastructure
- [ ] Phase 2: Project & Stream Management
- [ ] Phase 3: Data Visualization & Analytics
- [ ] Phase 4: Collaboration Features
- [ ] Phase 5: Advanced Features (AI integration, templates)

See [SESSION_HANDOFF.md](SESSION_HANDOFF.md) for detailed development progress.

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
