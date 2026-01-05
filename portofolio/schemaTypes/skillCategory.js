import {defineField, defineType} from 'sanity'

export default defineType({
    name: 'skillCategory',
    title: 'Skill Categories',
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