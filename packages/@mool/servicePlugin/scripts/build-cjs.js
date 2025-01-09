import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve('dist');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

execSync('tsc --outDir dist --module commonjs', { stdio: 'inherit' });

fs.readdirSync(outDir).forEach(file => {
  if (file.endsWith('.js')) {
    fs.renameSync(path.join(outDir, file), path.join(outDir, file.replace('.js', '.cjs')));
  }
});