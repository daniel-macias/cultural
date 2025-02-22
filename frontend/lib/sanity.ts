import { createClient } from '@sanity/client';

const sanityClient = createClient({
  projectId: '851c4m8b', //This can be public, for anywone reading the repo thinking i made a mistake
  dataset: 'production',
  apiVersion: '2024-02-05',
  useCdn: true,
});

export default sanityClient;
