({
    baseUrl: '../src/game/client/js',
    mainConfigFile: '../src/game/client/js/app/main.js',
    name: 'app/main',
    out: '../src/game/client/js/compiled/compiled.js',
    preserveLicenseComments: false,
    generateSourceMaps: false,
    optimize: 'uglify2',
    paths: {
        requireLib: 'libs/require'
    },
    include: 'requireLib'
})