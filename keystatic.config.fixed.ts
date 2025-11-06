import { config, collection, fields } from '@keystatic/core';

/**
 * FIXED Keystatic Configuration
 *
 * Changes from original:
 * - Flat structure instead of nested glob patterns
 * - Relationship fields to link projects → streams → updates
 * - This allows creation to work properly
 *
 * Structure:
 * - content/projects/[project-slug]/
 * - content/streams/[stream-slug]/
 * - content/updates/[update-slug].md
 */

export default config({
  storage: {
    kind: 'local',
    // For production with GitHub, use:
    // kind: 'github',
    // repo: {
    //   owner: process.env.PUBLIC_GITHUB_REPO_OWNER || 'workspace-by-ali',
    //   name: process.env.PUBLIC_GITHUB_REPO_NAME || 'workspace-template',
    // },
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

    // Streams Collection (Flat with Project Reference)
    streams: collection({
      label: 'Streams',
      path: 'content/streams/*/',  // Flat: content/streams/my-stream/
      slugField: 'title',

      schema: {
        title: fields.text({
          label: 'Stream Title',
          validation: { isRequired: true },
        }),

        // Relationship field to link to project
        projectSlug: fields.text({
          label: 'Parent Project Slug',
          description: 'The slug of the project this stream belongs to',
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
          label: 'Stream Overview',
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
            directory: 'public/images/streams',
            publicPath: '/images/streams/',
          },
        }),

        startDate: fields.date({ label: 'Start Date' }),

        lastUpdated: fields.date({
          label: 'Last Updated',
          defaultValue: { kind: 'today' },
        }),
      },
    }),

    // Updates Collection (Flat with Stream Reference)
    updates: collection({
      label: 'Updates',
      path: 'content/updates/*',  // Flat: content/updates/2025-11-06-update.md
      format: { contentField: 'content' },

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

        streamSlug: fields.text({
          label: 'Stream Slug',
          description: 'The stream this update belongs to',
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
  },

  ui: {
    brand: {
      name: 'Workspace',
    },
    navigation: {
      Projects: ['projects'],
      Streams: ['streams'],
      Updates: ['updates'],
    },
  },
});
