// https://github.com/vuejs/vitepress/issues/573#issuecomment-1629971757
const fs = require('fs');

const filePath = 'node_modules/@vue/compiler-sfc/dist/compiler-sfc.cjs.js';

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    const modifiedData = data.replace(
        /context.imports\.push\(\{\s*exp,\s*path:\s*path2\s*}\);/g,
        "context.imports.push({ exp, path: path2 && path2[0] === '/' ? decodeURIComponent(path2) : path2 });"
    );

    fs.writeFile(filePath, modifiedData, 'utf8', (err) => {
        if (err) {
            console.error(err);
            return;
        }

        console.log('File modified successfully!');
    });
});
