const $fs = require('fs-extra')
const $path = require('path')
const dataManagerRepoPublicPath = 'c:/projects/data_manager/public'
const distPath = './dist/js'
const distFileNames = [
    'tabulator.min.js',
    // 'tabulator.min.js.map',
]
for (const distFileName of distFileNames) {
    $fs.copy(
        $path.join(distPath, distFileName), 
        $path.join(dataManagerRepoPublicPath, distFileName), 
    )
}
