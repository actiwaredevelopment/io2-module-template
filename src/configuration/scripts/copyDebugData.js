const fs = require('fs');
const path = require('path');


const DATA_SOURCE = '../../debug';
const DATA_DEST = './public/debug';


try {
    fs.mkdirSync(DATA_DEST, {
        recursive: true
    });

    const files = fs.readdirSync(DATA_SOURCE, {
        withFileTypes: true
    });

    for (const file of files) {
        fs.copyFileSync(path.join(DATA_SOURCE, file.name), path.join(DATA_DEST, file.name));
    }
} catch (error) {
    console.log(error);
}
