import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const html=await readFile('./index.html','utf8');
const css=await readFile('./styles.css','utf8');
const js=await readFile('./app.js','utf8');
assert.match(html,/id="reference-input"/);
assert.match(html,/id="post-canvas"/);
assert.match(html,/id="export-btn"/);
assert.match(html,/notranslate/);
assert.match(js,/quran-uthmani/);
assert.match(js,/arabicHash/);
assert.match(js,/sha256/);
assert.match(js,/toBlob/);
assert.match(js,/verified:true/);
assert.match(js,/6236/);
assert.match(css,/@media \(max-width:850px\)/);
console.log('Static smoke tests passed.');
