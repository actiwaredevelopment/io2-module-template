const fs = require('fs');
const path = require('path');


const FONT_SOURCE = './node_modules/@fluentui/font-icons-mdl2/fonts';
const FONT_DEST = './public/fonts/font-icons-mdl2';

const LANGUAGE_SOURCE = './../../module-definition/languages';
const LANGUAGE_DEST = './public/locales/language/module';

try {
    fs.mkdirSync(FONT_DEST, {
        recursive: true
    });

    if (fs.existsSync(FONT_SOURCE) === true) {
        let files = fs.readdirSync(FONT_SOURCE, {
            withFileTypes: true
        });

        files = files.filter((element) => {
            return element.isFile() && element.name.includes('woff');
        });

        for (const file of files) {
            fs.copyFileSync(path.join(FONT_SOURCE, file.name), path.join(FONT_DEST, file.name));
        }
    }

    fs.mkdirSync(LANGUAGE_DEST, {
        recursive: true
    });

    if (fs.existsSync(LANGUAGE_SOURCE) === true) {
        const langFiles = fs.readdirSync(LANGUAGE_SOURCE, {
            withFileTypes: true
        });

        for (const file of langFiles) {
            let fileName = file.name;
            const splittedName = file.name.split('-');

            if (splittedName.length === 2) {
                fileName = `${splittedName[0]}.json`;
            }

            fs.copyFileSync(path.join(LANGUAGE_SOURCE, file.name), path.join(LANGUAGE_DEST, fileName));
        }
    }
} catch (error) {
    console.log(error);
}
