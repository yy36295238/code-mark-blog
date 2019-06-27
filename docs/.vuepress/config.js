module.exports = {
    title: 'Code-Mark',
    description: '代码标记',
    themeConfig: {
        sidebarDepth: 2,
        sidebar: {
            '/java/': [
                {
                    title: 'JAVA',
                    collapsable: false,
                    children: [
                        '/java/stream',
                        '/java/string_utils',
                        '/java/date_utils',
                    ]
                },
            ],

        }
    }
}