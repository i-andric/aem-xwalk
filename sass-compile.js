import * as sass from 'sass';
import fs from 'fs';
import path from 'path';
import { readdir } from 'fs/promises';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Specify the directories you want to ignore
const ignoredDirs = ['styles/mixins'];

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
      const fullPath = path.join(parent, file.name);
      const relativePath = path.relative(__dirname, fullPath);
      const isIgnored = ignoredDirs.some(dir => relativePath.startsWith(dir));
      if (!isIgnored) {
        await compileAndSave(fullPath);
      } else {
        console.log(`${relativePath} has been explicitly ignored for compilation`);
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
    const relativePath = path.relative(__dirname, path.join(__dirname, fileName));
    const isIgnored = ignoredDirs.some(dir => relativePath.startsWith(dir));
    if (!isIgnored) {
      compileAndSave(path.join(__dirname, fileName)).catch(console.error);
    } else {
      console.log(`${relativePath} has been explicitly ignored for compilation`);
    }
  }
});
