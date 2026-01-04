import {defineField, defineType} from 'sanity'

export default defineType({
    name: 'profile',
    title: 'Profile & Contact',
    type: 'document',
    fields: [
        defineField({
            name: 'about',
            title: 'About Me (Paragraph)',
            type: 'text',
            rows: 5
        }),
        defineField({
            name: 'contactMessage',
            title: 'Contact Section Message',
            type: 'text',
            rows: 3
        }),
        defineField({
            name: 'email',
            title: 'Email Address',
            type: 'string',
        }),
        defineField({
            name: 'github',
            title: 'GitHub URL',
            type: 'url',
        }),
        defineField({
            name: 'linkedin',
            title: 'LinkedIn URL',
            type: 'url',
        }),
        defineField({
            name: 'instagram',
            title: 'Instagram URL',
            type: 'url',
        }),
        defineField({
            name: 'whatsapp',
            title: 'WhatsApp URL (wa.me)',
            type: 'url',
        }),
        defineField({
            name: 'cvFile',
            title: 'Upload CV (PDF)',
            type: 'file',
            options: { accept: '.pdf' }
        }),
    ],
})