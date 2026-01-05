import {defineField, defineType} from 'sanity'

export default defineType({
    name: 'certification',
    title: 'Certifications & Achievements',
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
            title: 'Achievement Title',
            type: 'string',
            description: 'Contoh: Unity Essentials Pathway, Juara 3 Code Jam',
        }),
        defineField({
            name: 'organizer',
            title: 'Organizer / Issuer',
            type: 'string',
            description: 'Contoh: Unity Learn, Google Play, UNESA',
        }),
        defineField({
            name: 'date',
            title: 'Date / Year',
            type: 'string',
            description: 'Contoh: Oct 2024, 2023',
        }),
        defineField({
            name: 'credentialUrl',
            title: 'Credential URL (Optional)',
            type: 'url',
            description: 'Link ke sertifikat asli jika ada',
        }),
        defineField({
            name: 'logo',
            title: 'Logo / Icon (Optional)',
            type: 'image',
            options: { hotspot: true },
            description: 'Logo penyelenggara atau ikon piala',
        }),
    ],
})