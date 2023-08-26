import * as path from 'path';
import * as fs from 'fs/promises';
import { Dirent, existsSync } from 'fs';

async function* getFiles(dir): AsyncGenerator<Dirent> {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = path.resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      yield* getFiles(res);
    } else {
      dirent.path = res;
      yield dirent;
    }
  }
}

async function run(typePaths: string[]) {
  const jsonDir = './schemas';

  if (!existsSync(jsonDir)) {
    await fs.mkdir(jsonDir);
  }

  for (const typePath of typePaths) {
    for await (const item of getFiles(typePath)) {
      if (item.isDirectory() || !item.name.endsWith('.js')) {
        continue;
      }

      try {
        const [part2, part1] = item.path.split(path.sep).reverse();
        const schemaFileName = `${part1}.${part2.split('.')[0]}.json`;
        const m = await import(item.path);
        const schema = m.Schema;
        await fs.writeFile(path.join(jsonDir, schemaFileName), schema);
      } catch (err) {
        console.error(err);
      }
    }
  }
}

run(['./dist/auth', './dist/tasks']);
