/**
 * Automated Session Handoff Updater
 *
 * This script helps automatically generate session handoff documents by:
 * - Analyzing git commits since last session
 * - Checking file changes
 * - Listing new API endpoints
 * - Tracking TODO completion
 * - Generating formatted markdown
 *
 * Usage:
 *   npx tsx scripts/session-updater.ts
 *   npx tsx scripts/session-updater.ts --date 2025-11-04
 */

import { execSync } from 'child_process';
import { readdirSync, statSync, readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

interface SessionData {
  date: string;
  filesChanged: string[];
  filesCreated: string[];
  filesDeleted: string[];
  apiEndpoints: string[];
  components: string[];
  pages: string[];
  linesAdded: number;
  linesDeleted: number;
  commits: Array<{ hash: string; message: string; author: string }>;
}

class SessionUpdater {
  private rootDir: string;
  private date: string;

  constructor(date?: string) {
    this.rootDir = process.cwd();
    this.date = date || new Date().toISOString().split('T')[0];
  }

  /**
   * Get git commits since last session handoff
   */
  private getRecentCommits(): SessionData['commits'] {
    try {
      const lastHandoff = this.findLastHandoff();
      const since = lastHandoff ? `--since="${lastHandoff}"` : '--since="24 hours ago"';

      const commits = execSync(
        `git log ${since} --pretty=format:"%H|%s|%an"`,
        { encoding: 'utf-8' }
      );

      return commits.split('\n').filter(Boolean).map(line => {
        const [hash, message, author] = line.split('|');
        return { hash, message, author };
      });
    } catch (error) {
      console.warn('Could not fetch git commits:', error);
      return [];
    }
  }

  /**
   * Get file changes from git
   */
  private getFileChanges(): Pick<SessionData, 'filesChanged' | 'filesCreated' | 'filesDeleted' | 'linesAdded' | 'linesDeleted'> {
    try {
      const lastHandoff = this.findLastHandoff();
      const since = lastHandoff ? `--since="${lastHandoff}"` : '--since="24 hours ago"';

      // Get changed files
      const diffStat = execSync(
        `git log ${since} --numstat --pretty=format:""`,
        { encoding: 'utf-8' }
      );

      const filesChanged = new Set<string>();
      const filesCreated = new Set<string>();
      const filesDeleted = new Set<string>();
      let linesAdded = 0;
      let linesDeleted = 0;

      diffStat.split('\n').filter(Boolean).forEach(line => {
        const [added, deleted, file] = line.split('\t');
        if (!file) return;

        linesAdded += parseInt(added) || 0;
        linesDeleted += parseInt(deleted) || 0;

        if (added === '0' && deleted !== '0') {
          filesDeleted.add(file);
        } else if (added !== '0' && deleted === '0') {
          filesCreated.add(file);
        } else {
          filesChanged.add(file);
        }
      });

      return {
        filesChanged: Array.from(filesChanged),
        filesCreated: Array.from(filesCreated),
        filesDeleted: Array.from(filesDeleted),
        linesAdded,
        linesDeleted,
      };
    } catch (error) {
      console.warn('Could not fetch file changes:', error);
      return { filesChanged: [], filesCreated: [], filesDeleted: [], linesAdded: 0, linesDeleted: 0 };
    }
  }

  /**
   * Find all API endpoints in src/pages/api
   */
  private findApiEndpoints(): string[] {
    const apiDir = join(this.rootDir, 'src', 'pages', 'api');
    if (!existsSync(apiDir)) return [];

    const endpoints: string[] = [];

    const scanDir = (dir: string, prefix = '') => {
      const items = readdirSync(dir);

      for (const item of items) {
        const fullPath = join(dir, item);
        const stat = statSync(fullPath);

        if (stat.isDirectory()) {
          scanDir(fullPath, `${prefix}/${item}`);
        } else if (item.endsWith('.ts') || item.endsWith('.js')) {
          const content = readFileSync(fullPath, 'utf-8');
          const methods: string[] = [];

          if (content.includes('export const GET')) methods.push('GET');
          if (content.includes('export const POST')) methods.push('POST');
          if (content.includes('export const PUT')) methods.push('PUT');
          if (content.includes('export const PATCH')) methods.push('PATCH');
          if (content.includes('export const DELETE')) methods.push('DELETE');

          const route = `${prefix}/${item.replace(/\.(ts|js)$/, '')}`.replace('/index', '');
          methods.forEach(method => {
            endpoints.push(`${method} /api${route}`);
          });
        }
      }
    };

    scanDir(apiDir);
    return endpoints.sort();
  }

  /**
   * Find all React components
   */
  private findComponents(): string[] {
    const componentsDir = join(this.rootDir, 'src', 'components');
    if (!existsSync(componentsDir)) return [];

    const components: string[] = [];

    const scanDir = (dir: string) => {
      const items = readdirSync(dir);

      for (const item of items) {
        const fullPath = join(dir, item);
        const stat = statSync(fullPath);

        if (stat.isDirectory()) {
          scanDir(fullPath);
        } else if (item.endsWith('.tsx') || item.endsWith('.jsx')) {
          components.push(fullPath.replace(this.rootDir, '').replace(/\\/g, '/'));
        }
      }
    };

    scanDir(componentsDir);
    return components.sort();
  }

  /**
   * Find all Astro pages
   */
  private findPages(): string[] {
    const pagesDir = join(this.rootDir, 'src', 'pages');
    if (!existsSync(pagesDir)) return [];

    const pages: string[] = [];

    const scanDir = (dir: string) => {
      const items = readdirSync(dir);

      for (const item of items) {
        const fullPath = join(dir, item);
        const stat = statSync(fullPath);

        if (stat.isDirectory() && item !== 'api') {
          scanDir(fullPath);
        } else if (item.endsWith('.astro')) {
          pages.push(fullPath.replace(this.rootDir, '').replace(/\\/g, '/'));
        }
      }
    };

    scanDir(pagesDir);
    return pages.sort();
  }

  /**
   * Find last session handoff date
   */
  private findLastHandoff(): string | null {
    const docsDir = join(this.rootDir, 'docs');
    if (!existsSync(docsDir)) return null;

    const handoffs = readdirSync(docsDir)
      .filter(file => file.startsWith('SESSION_HANDOFF_') && file.endsWith('.md'))
      .map(file => {
        const match = file.match(/SESSION_HANDOFF_(.+)\.md/);
        return match ? match[1] : null;
      })
      .filter(Boolean)
      .sort()
      .reverse();

    return handoffs[0] || null;
  }

  /**
   * Generate session data
   */
  public generateSessionData(): SessionData {
    console.log('🔍 Analyzing session changes...');

    const commits = this.getRecentCommits();
    const fileChanges = this.getFileChanges();
    const apiEndpoints = this.findApiEndpoints();
    const components = this.findComponents();
    const pages = this.findPages();

    return {
      date: this.date,
      commits,
      apiEndpoints,
      components,
      pages,
      ...fileChanges,
    };
  }

  /**
   * Generate markdown content
   */
  public generateMarkdown(data: SessionData): string {
    const md: string[] = [];

    md.push(`# Session Handoff - ${data.date}`);
    md.push('');
    md.push('**Status:** 🔄 Auto-generated session summary');
    md.push(`**Generated:** ${new Date().toISOString()}`);
    md.push('');
    md.push('---');
    md.push('');

    // Summary
    md.push('## 📊 Session Summary');
    md.push('');
    md.push(`- **Files Changed:** ${data.filesChanged.length}`);
    md.push(`- **Files Created:** ${data.filesCreated.length}`);
    md.push(`- **Files Deleted:** ${data.filesDeleted.length}`);
    md.push(`- **Lines Added:** ${data.linesAdded}`);
    md.push(`- **Lines Deleted:** ${data.linesDeleted}`);
    md.push(`- **Commits:** ${data.commits.length}`);
    md.push('');

    // Commits
    if (data.commits.length > 0) {
      md.push('## 📝 Git Commits');
      md.push('');
      data.commits.forEach(commit => {
        md.push(`- \`${commit.hash.substring(0, 7)}\` ${commit.message} (${commit.author})`);
      });
      md.push('');
    }

    // Files Created
    if (data.filesCreated.length > 0) {
      md.push('## ✨ Files Created');
      md.push('');
      data.filesCreated.forEach(file => {
        md.push(`- \`${file}\``);
      });
      md.push('');
    }

    // Files Modified
    if (data.filesChanged.length > 0) {
      md.push('## 📝 Files Modified');
      md.push('');
      data.filesChanged.slice(0, 20).forEach(file => {
        md.push(`- \`${file}\``);
      });
      if (data.filesChanged.length > 20) {
        md.push(`- ...and ${data.filesChanged.length - 20} more`);
      }
      md.push('');
    }

    // API Endpoints
    md.push('## 🔌 API Endpoints');
    md.push('');
    if (data.apiEndpoints.length > 0) {
      data.apiEndpoints.forEach(endpoint => {
        md.push(`- \`${endpoint}\``);
      });
    } else {
      md.push('No API endpoints found.');
    }
    md.push('');

    // Components
    md.push('## 🧩 React Components');
    md.push('');
    if (data.components.length > 0) {
      data.components.forEach(component => {
        md.push(`- \`${component}\``);
      });
    } else {
      md.push('No React components found.');
    }
    md.push('');

    // Pages
    md.push('## 📄 Astro Pages');
    md.push('');
    if (data.pages.length > 0) {
      data.pages.forEach(page => {
        md.push(`- \`${page}\``);
      });
    } else {
      md.push('No Astro pages found.');
    }
    md.push('');

    md.push('---');
    md.push('');
    md.push('**Note:** This is an auto-generated summary. Please add manual notes about:');
    md.push('- What was accomplished');
    md.push('- Known issues or blockers');
    md.push('- Next steps');
    md.push('- Important decisions made');
    md.push('');

    return md.join('\n');
  }

  /**
   * Run the updater
   */
  public async run() {
    console.log('🚀 Starting Session Updater...');
    console.log(`📅 Date: ${this.date}`);
    console.log('');

    const data = this.generateSessionData();
    const markdown = this.generateMarkdown(data);

    const outputPath = join(this.rootDir, 'docs', `SESSION_HANDOFF_${this.date}_AUTO.md`);
    writeFileSync(outputPath, markdown, 'utf-8');

    console.log('');
    console.log('✅ Session handoff generated!');
    console.log(`📝 Output: ${outputPath}`);
    console.log('');
    console.log('📊 Statistics:');
    console.log(`   - Files Changed: ${data.filesChanged.length}`);
    console.log(`   - Files Created: ${data.filesCreated.length}`);
    console.log(`   - API Endpoints: ${data.apiEndpoints.length}`);
    console.log(`   - Components: ${data.components.length}`);
    console.log(`   - Pages: ${data.pages.length}`);
    console.log('');
    console.log('💡 Next steps:');
    console.log('   1. Review the auto-generated file');
    console.log('   2. Add manual notes about accomplishments');
    console.log('   3. Document any issues or decisions');
    console.log('   4. Update with next session priorities');
    console.log('');
  }
}

// CLI execution
const args = process.argv.slice(2);
const dateArg = args.find(arg => arg.startsWith('--date='));
const date = dateArg ? dateArg.split('=')[1] : undefined;

const updater = new SessionUpdater(date);
updater.run().catch(console.error);
