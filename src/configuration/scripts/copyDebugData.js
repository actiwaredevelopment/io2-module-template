const fs = require('fs');
const path = require('path');

const DATA_SOURCE = '../../debug';
const DATA_DEST = './public/debug';

try {
    if (process.env.NODE_ENV === 'development') {
        fs.mkdirSync(DATA_DEST, {
            recursive: true
        });

        const files = fs.readdirSync(DATA_SOURCE, {
            withFileTypes: true
        });

        for (const file of files) {
            fs.copyFileSync(path.join(DATA_SOURCE, file.name), path.join(DATA_DEST, file.name));
        }
    } else {
        console.log('Not in development mode, skipping debug data copy.');
    }
} catch (error) {
    console.log(error);
}
