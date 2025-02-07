import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Event Name',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'dates',
      title: 'Event Dates',
      type: 'array',
      of: [{ type: 'object', fields: [
        defineField({ name: 'start', title: 'Start Time', type: 'datetime' }),
        defineField({ name: 'end', title: 'End Time', type: 'datetime' }),
      ]}]
    }),
    defineField({
      name: 'promoImage',
      title: 'Promotional Image',
      type: 'image',
      options: { hotspot: true }, // Enables image cropping
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
        name: 'trending',
        title: 'Trending',
        type: 'boolean',
    }),
    defineField({
        name: 'priceRange',
        title: 'Price Range',
        type: 'object',
        fields: [
          defineField({
            name: 'minPrice',
            title: 'Minimum Price',
            type: 'number',
            validation: Rule => Rule.required().min(0).error('Minimum price must be a positive number'),
          }),
          defineField({
            name: 'maxPrice',
            title: 'Maximum Price',
            type: 'number',
            validation: Rule => Rule.required().min(0).error('Maximum price must be a positive number'),
          }),
        ],
      }),
  ],
});
