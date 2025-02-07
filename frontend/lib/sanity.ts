import { createClient } from '@sanity/client';

const sanityClient = createClient({
  projectId: '851c4m8b', 
  dataset: 'production',
  apiVersion: '2024-02-05',
  useCdn: true,
});

export default sanityClient;
