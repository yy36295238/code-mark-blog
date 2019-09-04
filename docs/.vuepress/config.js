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
                    '/java/Stream',
                    '/java/StringUtils',
                    '/java/DateUtils',
                    '/java/RsaUtils',
                    '/java/Maps',
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
