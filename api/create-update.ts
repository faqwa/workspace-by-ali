import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Octokit } from '@octokit/rest';
import { v4 as uuidv4 } from 'uuid';

/**
 * POST /api/createUpdate
 * Body:
 * {
 *   "title": "string",
 *   "category": "string",
 *   "summary": "string",
 *   "tags": ["string"],
 *   "content": "markdown string"
 * }
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { title, category, summary, tags = [], content = '' } = req.body || {};

    if (!title || !category || !summary) {
      return res.status(400).json({ error: 'Missing required fields: title, category, summary' });
    }

    const owner = process.env.GITHUB_USERNAME!;
    const repo = process.env.GITHUB_REPO!;
    const token = process.env.GITHUB_PAT!;
    const octokit = new Octokit({ auth: token });

    // Generate slug + path
    const date = new Date();
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const id = uuidv4();

    const path = `src/content/updates/${category}/${yyyy}-${mm}-${dd}-${slug}.md`;

    const frontmatter = [
      `id: ${id}`,
      `title: "${title.replace(/"/g, '\\"')}"`,
      `slug: ${slug}`,
      `category: ${category}`,
      `tags: [${tags.map((t: string) => `"${t}"`).join(', ')}]`,
      `status: draft`,
      `safety_level: open`,
      `author: ${owner}`,
      `created_at: ${date.toISOString()}`,
      `updated_at: ${date.toISOString()}`,
      `summary: "${summary.replace(/"/g, '\\"')}"`,
      `media: []`,
      `visibility: public`,
      `repo_target: personal`,
      `verification:\n  verified: false`,
    ].join('\n');

    const markdown = `---\n${frontmatter}\n---\n\n${content}\n`;

    // Encode file content
    const contentEncoded = Buffer.from(markdown, 'utf8').toString('base64');

    // Commit file to GitHub
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message: `Add update: ${title}`,
      content: contentEncoded,
      committer: { name: owner, email: `${owner}@users.noreply.github.com` },
      author: { name: owner, email: `${owner}@users.noreply.github.com` },
    });

    return res.status(200).json({
      success: true,
      message: `Update created successfully: ${path}`,
      slug,
    });
  } catch (error: any) {
    console.error('Error creating update:', error.message);
    return res.status(500).json({ error: 'Failed to create update', details: error.message });
  }
}
