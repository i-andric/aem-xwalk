import * as sass from 'sass';
import fs from 'fs';
import path from 'path';
import { readdir } from 'fs/promises';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Specify the files you want to ignore
const ignoredFiles = ['_media-queries.scss', '_mixins.scss', '_all-helpers.scss'];

const compileAndSave = async (sassFile) => {
  const dest = sassFile.replace(path.extname(sassFile), '.css');

  try {
    const result = sass.compile(sassFile);
    
    fs.writeFile(dest, result.css, (err) => {
      if (err) console.log(err);
      console.log(`Compiled ${sassFile} to ${dest}`);
    });
  } catch (error) {
    console.error(`Error compiling ${sassFile}:`, error);
  }
};

const processFiles = async (parent) => {
  let files = await readdir(parent, { withFileTypes: true });
  for (const file of files) {
    if (file.isDirectory()) {
      await processFiles(path.join(parent, file.name));
    } else if (path.extname(file.name) === '.scss') {
      if (!ignoredFiles.includes(file.name)) {
        await compileAndSave(path.join(parent, file.name));
      } else {
        console.log(`${file.name} has been explicitly ignored for compilation`);
      }
    }
  }
};

// Program execution process
for (const folder of ['styles', 'blocks']) {
  try {
    await processFiles(path.join(__dirname, folder));
  } catch (err) {
    console.error(err);
  }
}

fs.watch('.', { recursive: true }, (eventType, fileName) => {
  if (path.extname(fileName) === '.scss' && eventType === 'change') {
    const baseName = path.basename(fileName);
    if (!ignoredFiles.includes(baseName)) {
      compileAndSave(path.join(__dirname, fileName)).catch(console.error);
    } else {
      console.log(`${fileName} has been explicitly ignored for compilation`);
    }
  }
});
