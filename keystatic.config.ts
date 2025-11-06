import { config, collection, fields } from '@keystatic/core';

/**
 * FIXED Keystatic Configuration
 *
 * Changes from original:
 * - Flat structure instead of nested glob patterns
 * - Relationship fields to link projects → sub-projects → updates
 * - This allows creation to work properly
 *
 * Structure:
 * - content/projects/[project-slug]/
 * - content/subprojects/[subproject-slug]/
 * - content/updates/[update-slug].md
 */

export default config({
  storage:
    import.meta.env.MODE === 'development'
      ? {
          // Local mode for development/testing
          kind: 'local' as const,
        }
      : {
          // GitHub mode for production
          kind: 'github' as const,
          repo: {
            // These will be set dynamically based on the logged-in user
            // The token API endpoint provides both token and repo info
            owner: import.meta.env.PUBLIC_GITHUB_REPO_OWNER || 'workspace-by-ali',
            name: import.meta.env.PUBLIC_GITHUB_REPO_NAME || 'workspace-template',
          },
        },

  collections: {
    // Projects Collection (Top Level)
    projects: collection({
      label: 'Projects',
      path: 'content/projects/*/',  // Flat: content/projects/my-project/
      slugField: 'title',

      schema: {
        title: fields.text({
          label: 'Project Title',
          validation: { isRequired: true },
        }),

        visibility: fields.select({
          label: 'Visibility',
          options: [
            { label: 'Public', value: 'public' },
            { label: 'Gated (Safety Required)', value: 'gated' },
            { label: 'Private', value: 'private' },
          ],
          defaultValue: 'public',
        }),

        gated: fields.checkbox({
          label: 'Requires Safety Acknowledgment',
          defaultValue: false,
        }),

        safetyCode: fields.text({
          label: 'Safety Code',
          description: 'e.g., plasma_safety_v1.3 (only if gated)',
        }),

        category: fields.select({
          label: 'Category',
          options: [
            { label: 'Hardware', value: 'hardware' },
            { label: 'Biology', value: 'biology' },
            { label: 'Plasma', value: 'plasma' },
            { label: 'Data Science', value: 'data-science' },
            { label: 'Other', value: 'other' },
          ],
          defaultValue: 'other',
        }),

        tags: fields.array(
          fields.text({ label: 'Tag' }),
          {
            label: 'Tags',
            itemLabel: (props) => props.value,
          }
        ),

        description: fields.text({
          label: 'Short Description',
          multiline: true,
        }),

        body: fields.document({
          label: 'Project Overview',
          formatting: {
            inlineMarks: {
              bold: true,
              italic: true,
              code: true,
              strikethrough: true,
            },
            listTypes: {
              ordered: true,
              unordered: true,
            },
            headingLevels: [2, 3, 4],
            blockTypes: {
              blockquote: true,
              code: true,
            },
          },
          links: true,
          images: {
            directory: 'public/images/projects',
            publicPath: '/images/projects/',
          },
        }),

        status: fields.select({
          label: 'Status',
          options: [
            { label: 'Draft', value: 'draft' },
            { label: 'Active', value: 'active' },
            { label: 'Archived', value: 'archived' },
          ],
          defaultValue: 'draft',
        }),

        startDate: fields.date({
          label: 'Start Date',
        }),

        lastUpdated: fields.date({
          label: 'Last Updated',
          defaultValue: { kind: 'today' },
        }),
      },
    }),

    // Sub-Projects Collection (Flat with Project Reference)
    subProjects: collection({
      label: 'Sub-Projects',
      path: 'content/subprojects/*/',  // Flat: content/subprojects/my-subproject/
      slugField: 'title',

      schema: {
        title: fields.text({
          label: 'Sub-Project Title',
          validation: { isRequired: true },
        }),

        // Relationship field to link to project
        projectSlug: fields.text({
          label: 'Parent Project Slug',
          description: 'The slug of the project this sub-project belongs to',
          validation: { isRequired: true },
        }),

        gated: fields.checkbox({
          label: 'Requires Safety Acknowledgment',
          defaultValue: false,
        }),

        description: fields.text({
          label: 'Description',
          multiline: true,
        }),

        body: fields.document({
          label: 'Sub-Project Overview',
          formatting: {
            inlineMarks: {
              bold: true,
              italic: true,
              code: true,
            },
            listTypes: {
              ordered: true,
              unordered: true,
            },
            headingLevels: [2, 3, 4],
          },
          links: true,
          images: {
            directory: 'public/images/subprojects',
            publicPath: '/images/subprojects/',
          },
        }),

        startDate: fields.date({ label: 'Start Date' }),

        lastUpdated: fields.date({
          label: 'Last Updated',
          defaultValue: { kind: 'today' },
        }),
      },
    }),

    // Updates Collection (Flat with Sub-Project Reference)
    updates: collection({
      label: 'Updates',
      path: 'content/updates/*/',  // Flat folders: content/updates/2025-11-06-update/
      slugField: 'title',

      schema: {
        title: fields.text({
          label: 'Update Title',
          validation: { isRequired: true },
        }),

        // Relationship fields
        projectSlug: fields.text({
          label: 'Project Slug',
          description: 'The project this update belongs to',
        }),

        subProjectSlug: fields.text({
          label: 'Sub-Project Slug',
          description: 'The sub-project this update belongs to',
        }),

        date: fields.date({
          label: 'Date',
          defaultValue: { kind: 'today' },
          validation: { isRequired: true },
        }),

        type: fields.select({
          label: 'Update Type',
          options: [
            { label: 'Experiment', value: 'experiment' },
            { label: 'Observation', value: 'observation' },
            { label: 'Milestone', value: 'milestone' },
            { label: 'Note', value: 'note' },
          ],
          defaultValue: 'note',
        }),

        tags: fields.array(
          fields.text({ label: 'Tag' }),
          { label: 'Tags', itemLabel: (props) => props.value }
        ),

        content: fields.document({
          label: 'Content',
          formatting: {
            inlineMarks: {
              bold: true,
              italic: true,
              code: true,
              strikethrough: true,
            },
            listTypes: {
              ordered: true,
              unordered: true,
            },
            headingLevels: [2, 3, 4],
            blockTypes: {
              blockquote: true,
              code: true,
            },
          },
          links: true,
          images: {
            directory: 'public/images/updates',
            publicPath: '/images/updates/',
          },
        }),
      },
    }),

    // Docs Collection (Standalone Documentation)
    docs: collection({
      label: 'Documentation',
      path: 'content/docs/*/',  // Flat: content/docs/protocol-guide/
      slugField: 'title',

      schema: {
        title: fields.text({
          label: 'Document Title',
          validation: { isRequired: true },
        }),

        category: fields.select({
          label: 'Category',
          options: [
            { label: 'Protocol', value: 'protocol' },
            { label: 'Methods', value: 'methods' },
            { label: 'Literature Review', value: 'literature' },
            { label: 'Guide', value: 'guide' },
            { label: 'Reference', value: 'reference' },
            { label: 'Other', value: 'other' },
          ],
          defaultValue: 'guide',
        }),

        visibility: fields.select({
          label: 'Visibility',
          options: [
            { label: 'Public', value: 'public' },
            { label: 'Gated (Safety Required)', value: 'gated' },
            { label: 'Private', value: 'private' },
          ],
          defaultValue: 'public',
        }),

        gated: fields.checkbox({
          label: 'Requires Safety Acknowledgment',
          defaultValue: false,
        }),

        safetyCode: fields.text({
          label: 'Safety Code',
          description: 'e.g., plasma_safety_v1.3 (only if gated)',
        }),

        // Optional: Link to parent project
        projectSlug: fields.text({
          label: 'Related Project (Optional)',
          description: 'Slug of the project this doc belongs to',
        }),

        description: fields.text({
          label: 'Short Description',
          multiline: true,
          validation: { isRequired: true },
        }),

        // YouTube video embed
        videoUrl: fields.text({
          label: 'YouTube Video URL (Optional)',
          description: 'Full YouTube URL (e.g., https://www.youtube.com/watch?v=...)',
        }),

        body: fields.document({
          label: 'Content',
          formatting: {
            inlineMarks: {
              bold: true,
              italic: true,
              code: true,
              strikethrough: true,
              underline: true,
            },
            listTypes: {
              ordered: true,
              unordered: true,
            },
            headingLevels: [2, 3, 4, 5],
            blockTypes: {
              blockquote: true,
              code: true,
            },
          },
          links: true,
          images: {
            directory: 'public/images/docs',
            publicPath: '/images/docs/',
          },
        }),

        tags: fields.array(
          fields.text({ label: 'Tag' }),
          {
            label: 'Tags',
            itemLabel: (props) => props.value,
          }
        ),

        author: fields.text({
          label: 'Author',
          description: 'Who wrote this document?',
        }),

        publishDate: fields.date({
          label: 'Publish Date',
          defaultValue: { kind: 'today' },
        }),

        lastUpdated: fields.date({
          label: 'Last Updated',
          defaultValue: { kind: 'today' },
        }),
      },
    }),
  },

  ui: {
    brand: {
      name: 'Workspace',
    },
    navigation: {
      Projects: ['projects'],
      'Sub-Projects': ['subProjects'],
      Updates: ['updates'],
      Documentation: ['docs'],
    },
  },
});
