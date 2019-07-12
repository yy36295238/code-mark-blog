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
                    '/java/stream',
                    '/java/string_utils',
                    '/java/date_utils',
                    '/java/rsa_utils',
                ]
            },
            {
                title: 'javascript',
                collapsable: false,
                children: [
                    '/javascript/utils',
                ]
            },
        ]
    }
}
