#!/usr/bin/env node
import fs from "fs";
import path from "path";
import readline from "readline";

const CATEGORIES = ["plasma-hardware", "saltwater-dynamics", "reactive-species"];

function prompt(q) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(q, (ans) => { rl.close(); resolve(ans.trim()); }));
}

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

(async () => {
  try {
    const title = await prompt("Title: ");
    if (!title) throw new Error("Title is required.");

    console.log(`\nCategories:\n${CATEGORIES.map((c) => ` - ${c}`).join("\n")}`);
    const categoryInput = await prompt("Category (exact slug): ");
    const category = CATEGORIES.includes(categoryInput) ? categoryInput : null;
    if (!category) throw new Error("Invalid category.");

    const summary = await prompt("One-line summary: ");
    const status = await prompt("Status (in-progress | completed | blocked | paused) [optional]: ");
    const tags = await prompt("Tags (comma-separated) [optional]: ");

    const date = new Date();
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");

    const fileSlug = `${yyyy}-${mm}-${dd}-${slugify(title)}`;
    const dir = path.join(process.cwd(), "src", "content", "updates", category);
    const file = path.join(dir, `${fileSlug}.md`);

    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const frontmatter = [
      `title: "${title.replace(/"/g, '\\"')}"`,
      `date: ${yyyy}-${mm}-${dd}`,
      `category: ${category}`,
      `summary: "${summary.replace(/"/g, '\\"')}"`,
      tags ? `tags: [${tags.split(",").map((t) => `"${t.trim()}"`).join(", ")}]` : "tags: []",
      status ? `status: ${status}` : "# status: in-progress",
    ].join("\n");

    const body = `---\n${frontmatter}\n---\n\n## Notes\n\n- Start writing here.\n`;

    fs.writeFileSync(file, body, "utf8");
    console.log(`\n✅ Created: ${path.relative(process.cwd(), file)}`);
    console.log("Run your dev server to preview: npm run dev");
  } catch (err) {
    console.error("❌", err.message);
    process.exit(1);
  }
})();
