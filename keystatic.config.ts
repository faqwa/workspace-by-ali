import { config, collection, fields } from '@keystatic/core';

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

  // Branch configuration
  // Keystatic will commit all changes to 'draft' branch
  // branchPrefix: 'draft',

  collections: {
    // Projects Collection
    projects: collection({
      label: 'Projects',
      path: 'content/projects/*/',
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

        stream: fields.text({
          label: 'Primary Stream',
          description: 'e.g., hardware, biology, plasma',
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

    // Streams Collection (Nested)
    streams: collection({
      label: 'Streams',
      path: 'content/projects/*/streams/*/',
      slugField: 'title',

      schema: {
        title: fields.text({
          label: 'Stream Title',
          validation: { isRequired: true },
        }),

        parentProject: fields.text({
          label: 'Parent Project Slug',
          description: 'Auto-populated from path',
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

    // Updates Collection (Deep Nesting)
    updates: collection({
      label: 'Updates',
      path: 'content/projects/*/streams/*/updates/*',
      format: { contentField: 'content' },

      schema: {
        title: fields.text({
          label: 'Update Title',
          validation: { isRequired: true },
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
      Projects: ['projects', 'streams'],
      Content: ['updates'],
    },
  },
});
