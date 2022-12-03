import { copyIconFonts } from './copy-icon-fonts';

async function postinstall() {
    console.log('[1/1] Copying icon fonts...');
    await copyIconFonts();
}

postinstall();

