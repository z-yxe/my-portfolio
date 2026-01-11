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
            name: 'socials',
            title: 'Social Media Links',
            type: 'array',
            of: [
                {
                    type: 'object',
                    title: 'Social Link',
                    fields: [
                        { 
                            name: 'platform', 
                            title: 'Platform Name', 
                            type: 'string', 
                            description: 'Contoh: GitHub, LinkedIn' 
                        },
                        { 
                            name: 'url', 
                            title: 'URL / Link', 
                            type: 'url' 
                        },
                        { 
                            name: 'icon', 
                            title: 'Icon Name (FontAwesome)', 
                            type: 'string', 
                            description: 'Nama ikon tanpa "fa-". Contoh: github, linkedin, instagram, twitter, youtube, tiktok' 
                        }
                    ],
                    preview: {
                        select: {
                            title: 'platform',
                            subtitle: 'url'
                        }
                    }
                }
            ]
        }),
        defineField({
            name: 'cvFile',
            title: 'Upload CV (PDF)',
            type: 'file',
            options: { accept: '.pdf' }
        }),
    ],
})