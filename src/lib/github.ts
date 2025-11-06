/**
 * GitHub Content Utilities
 *
 * Functions to fetch and parse content from user's GitHub workspace repos
 * Used by dashboard pages to display content stored in Git
 *
 * Content Structure:
 * - content/projects/[slug]/
 * - content/subprojects/[slug]/
 * - content/updates/[slug]/
 * - content/docs/[slug]/
 */

import matter from 'gray-matter';
import { Octokit } from 'octokit';

/**
 * Types for parsed content
 */
export interface ProjectContent {
  slug: string;
  title: string;
  visibility: 'public' | 'gated' | 'private';
  gated: boolean;
  safetyCode?: string;
  category: string;
  tags: string[];
  description: string;
  body: string;
  status: 'draft' | 'active' | 'archived';
  startDate?: string;
  lastUpdated: string;
}

export interface SubProjectContent {
  slug: string;
  title: string;
  projectSlug: string;
  gated: boolean;
  description: string;
  body: string;
  startDate?: string;
  lastUpdated: string;
}

export interface UpdateContent {
  slug: string;
  title: string;
  projectSlug?: string;
  subProjectSlug?: string;
  date: string;
  type: 'experiment' | 'observation' | 'milestone' | 'note';
  tags: string[];
  content: string;
}

export interface DocContent {
  slug: string;
  title: string;
  category: 'protocol' | 'methods' | 'literature' | 'guide' | 'reference' | 'other';
  visibility: 'public' | 'gated' | 'private';
  gated: boolean;
  safetyCode?: string;
  projectSlug?: string;
  description: string;
  videoUrl?: string;
  body: string;
  tags: string[];
  author?: string;
  publishDate: string;
  lastUpdated: string;
}

/**
 * Create Octokit client with authentication
 */
function createOctokit(token: string): Octokit {
  return new Octokit({ auth: token });
}

/**
 * Fetch file content from GitHub
 */
async function fetchFileContent(
  octokit: Octokit,
  owner: string,
  repo: string,
  path: string,
  branch: string = 'main'
): Promise<string | null> {
  try {
    const response = await octokit.rest.repos.getContent({
      owner,
      repo,
      path,
      ref: branch,
    });

    // GitHub API returns base64-encoded content
    if ('content' in response.data && typeof response.data.content === 'string') {
      return Buffer.from(response.data.content, 'base64').toString('utf-8');
    }

    return null;
  } catch (error) {
    if (error instanceof Error && 'status' in error && error.status === 404) {
      return null; // File not found
    }
    console.error(`[GitHub] Error fetching file ${path}:`, error);
    throw error;
  }
}

/**
 * Fetch and parse a project from GitHub
 */
export async function fetchProjectFromGit(
  token: string,
  owner: string,
  repo: string,
  slug: string,
  branch: string = 'main'
): Promise<ProjectContent | null> {
  const octokit = createOctokit(token);
  const filePath = `content/projects/${slug}/index.md`;

  const content = await fetchFileContent(octokit, owner, repo, filePath, branch);
  if (!content) return null;

  const { data, content: body } = matter(content);

  return {
    slug,
    title: data.title || slug,
    visibility: data.visibility || 'public',
    gated: data.gated || false,
    safetyCode: data.safetyCode,
    category: data.category || 'other',
    tags: data.tags || [],
    description: data.description || '',
    body,
    status: data.status || 'active',
    startDate: data.startDate,
    lastUpdated: data.lastUpdated || new Date().toISOString(),
  };
}

/**
 * Fetch and parse a sub-project from GitHub
 */
export async function fetchSubProjectFromGit(
  token: string,
  owner: string,
  repo: string,
  slug: string,
  branch: string = 'main'
): Promise<SubProjectContent | null> {
  const octokit = createOctokit(token);
  const filePath = `content/subprojects/${slug}/index.md`;

  const content = await fetchFileContent(octokit, owner, repo, filePath, branch);
  if (!content) return null;

  const { data, content: body } = matter(content);

  return {
    slug,
    title: data.title || slug,
    projectSlug: data.projectSlug || '',
    gated: data.gated || false,
    description: data.description || '',
    body,
    startDate: data.startDate,
    lastUpdated: data.lastUpdated || new Date().toISOString(),
  };
}

/**
 * Fetch and parse an update from GitHub
 */
export async function fetchUpdateFromGit(
  token: string,
  owner: string,
  repo: string,
  slug: string,
  branch: string = 'main'
): Promise<UpdateContent | null> {
  const octokit = createOctokit(token);
  const filePath = `content/updates/${slug}/index.md`;

  const content = await fetchFileContent(octokit, owner, repo, filePath, branch);
  if (!content) return null;

  const { data, content: body } = matter(content);

  return {
    slug,
    title: data.title || slug,
    projectSlug: data.projectSlug,
    subProjectSlug: data.subProjectSlug,
    date: data.date || new Date().toISOString(),
    type: data.type || 'note',
    tags: data.tags || [],
    content: body,
  };
}

/**
 * Fetch and parse a doc from GitHub
 */
export async function fetchDocFromGit(
  token: string,
  owner: string,
  repo: string,
  slug: string,
  branch: string = 'main'
): Promise<DocContent | null> {
  const octokit = createOctokit(token);
  const filePath = `content/docs/${slug}/index.md`;

  const content = await fetchFileContent(octokit, owner, repo, filePath, branch);
  if (!content) return null;

  const { data, content: body } = matter(content);

  return {
    slug,
    title: data.title || slug,
    category: data.category || 'other',
    visibility: data.visibility || 'public',
    gated: data.gated || false,
    safetyCode: data.safetyCode,
    projectSlug: data.projectSlug,
    description: data.description || '',
    videoUrl: data.videoUrl,
    body,
    tags: data.tags || [],
    author: data.author,
    publishDate: data.publishDate || new Date().toISOString(),
    lastUpdated: data.lastUpdated || new Date().toISOString(),
  };
}

/**
 * List all projects in a repo
 */
export async function listProjects(
  token: string,
  owner: string,
  repo: string,
  branch: string = 'main'
): Promise<string[]> {
  const octokit = createOctokit(token);

  try {
    const response = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: 'content/projects',
      ref: branch,
    });

    if (Array.isArray(response.data)) {
      return response.data
        .filter((item) => item.type === 'dir')
        .map((item) => item.name);
    }

    return [];
  } catch (error) {
    console.error('[GitHub] Error listing projects:', error);
    return [];
  }
}

/**
 * List all sub-projects in a repo
 */
export async function listSubProjects(
  token: string,
  owner: string,
  repo: string,
  branch: string = 'main'
): Promise<string[]> {
  const octokit = createOctokit(token);

  try {
    const response = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: 'content/subprojects',
      ref: branch,
    });

    if (Array.isArray(response.data)) {
      return response.data
        .filter((item) => item.type === 'dir')
        .map((item) => item.name);
    }

    return [];
  } catch (error) {
    console.error('[GitHub] Error listing sub-projects:', error);
    return [];
  }
}

/**
 * List all updates in a repo
 */
export async function listUpdates(
  token: string,
  owner: string,
  repo: string,
  branch: string = 'main'
): Promise<string[]> {
  const octokit = createOctokit(token);

  try {
    const response = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: 'content/updates',
      ref: branch,
    });

    if (Array.isArray(response.data)) {
      return response.data
        .filter((item) => item.type === 'dir')
        .map((item) => item.name);
    }

    return [];
  } catch (error) {
    console.error('[GitHub] Error listing updates:', error);
    return [];
  }
}

/**
 * List all docs in a repo
 */
export async function listDocs(
  token: string,
  owner: string,
  repo: string,
  branch: string = 'main'
): Promise<string[]> {
  const octokit = createOctokit(token);

  try {
    const response = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: 'content/docs',
      ref: branch,
    });

    if (Array.isArray(response.data)) {
      return response.data
        .filter((item) => item.type === 'dir')
        .map((item) => item.name);
    }

    return [];
  } catch (error) {
    console.error('[GitHub] Error listing docs:', error);
    return [];
  }
}

/**
 * Check if user has access to content based on visibility
 */
export function checkContentAccess(
  visibility: 'public' | 'gated' | 'private',
  isOwner: boolean,
  hasAcknowledgedSafety: boolean = false
): { allowed: boolean; reason?: string } {
  if (visibility === 'public') {
    return { allowed: true };
  }

  if (visibility === 'private') {
    if (!isOwner) {
      return { allowed: false, reason: 'This content is private' };
    }
    return { allowed: true };
  }

  if (visibility === 'gated') {
    if (isOwner) {
      return { allowed: true }; // Owner always has access
    }
    if (!hasAcknowledgedSafety) {
      return { allowed: false, reason: 'Safety acknowledgment required' };
    }
    return { allowed: true };
  }

  return { allowed: false, reason: 'Unknown visibility setting' };
}
