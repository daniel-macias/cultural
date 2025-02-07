import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import schemas from './schemas';

export const sanityConfig = defineConfig({
  projectId: '851c4m8b', // Replace with actual project ID
  dataset: 'production',
  apiVersion: '2024-02-05',
  basePath: '/studio', // This is where Sanity Studio will be embedded
  plugins: [deskTool()],
  schema: {
    types: schemas,
  },
});