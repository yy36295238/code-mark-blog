module.exports = {
    title: 'Code-Mark',
    description: '代码标记',
    themeConfig: {
        sidebarDepth: 2,
        sidebar: [
            {
                title: 'java',
                collapsable: false,
                children: [
                    '/java/Streams',
                    '/java/StringUtils',
                    '/java/DateUtils',
                    '/java/RsaUtils',
                    '/java/Maps',
                    '/java/Spel',
                ]
            },
            {
                title: 'javascript',
                collapsable: false,
                children: [
                    '/javascript/utils',
                ]
            },
            {
                title: 'git',
                collapsable: false,
                children: [
                    '/git/git',
                ]
            },
        ]
    }
}
