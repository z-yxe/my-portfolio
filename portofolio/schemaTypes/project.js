import {defineField, defineType} from 'sanity'

export default defineType({
    name: 'project',
    title: 'Projects',
    type: 'document',
    fields: [
        defineField({
            name: 'orderId',
            title: 'Urutan Tampil (Order ID)',
            type: 'number',
            description: 'Masukkan angka 1 untuk tampil paling atas, 2 untuk urutan kedua, dan seterusnya. Kosongkan jika tidak ingin diatur manual.',
        }),
        defineField({
            name: 'title',
            title: 'Project Title',
            type: 'string',
        }),
        defineField({
            name: 'image',
            title: 'Project Image',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
        }),
        defineField({
            name: 'role',
            title: 'My Role & Contribution',
            type: 'text',
            rows: 4
        }),
        defineField({
            name: 'tags',
            title: 'Tags',
            type: 'array',
            of: [{type: 'string'}],
        }),
        defineField({
            name: 'trailerUrl',
            title: 'Gameplay Trailer URL (YouTube)',
            type: 'url',
        }),
        defineField({
            name: 'sourceUrl',
            title: 'Source Code URL (GitHub)',
            type: 'url',
        }),
        defineField({
            name: 'demoUrl',
            title: 'Live Demo URL',
            type: 'url',
        }),
    ],
})