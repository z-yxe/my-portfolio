import {defineField, defineType} from 'sanity'

export default defineType({
    name: 'skillCategory',
    title: 'Skill Categories',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Category Title (e.g. Languages)',
            type: 'string',
        }),
        defineField({
            name: 'skills',
            title: 'List of Skills',
            type: 'array',
            of: [{type: 'string'}],
        }),
    ],
})