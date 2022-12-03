import fs from 'fs/promises';
import path from 'path';

const FONT_SOURCE = './node_modules/@fluentui/font-icons-mdl2/fonts';
const FONT_DESTINATION = './public/fonts/font-icons-mdl2';

export async function copyIconFonts() {
    let files: string[];

    try {
        await fs.mkdir(FONT_DESTINATION, { recursive: true });

        files = await fs.readdir(FONT_SOURCE);
    } catch (error) {
        console.log(error);

        return;
    }

    for (const file of files) {
        try {
            console.log(`Copying ${file}...`);

            await fs.copyFile(path.join(FONT_SOURCE, file), path.join(FONT_DESTINATION, file));
        } catch (error) {
            console.log(error);
        }
    }
}

