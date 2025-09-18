import { promises as fs } from "fs";
import { join } from "path";
import glob from "fast-glob";

const contentDir = "./src";
const assetsDir = "./src/public";

const regex = /!\[[^\]]*\]\(([^)]+)\)/g;

const whitelist = [ "/preview.jpg", "onerror=", ]

async function run() {
  const files = await glob(`${contentDir}/**/*.md`);
  let broken = [];

  for (const file of files) {
    const text = await fs.readFile(file, "utf8");

    for (const match of text.matchAll(regex)) {
      const imgPath = match[1];

      // Check only local assets, skip remote
      if (imgPath.startsWith("http")) continue;
      
      if (whitelist.some(w => imgPath.includes(w))) {
        console.log(`⚠️  Skipped ${file}: ${imgPath}`);
        continue;
      }

      const localPath = join(assetsDir, imgPath.replace(/^\/assets\//, "assets/"));
      try {
        await fs.access(localPath);
      } catch {
        broken.push({ file, imgPath });
      }
    }
  }

  if (broken.length) {
    console.error("❌ Broken image links found:");
    broken.forEach(b => console.error(` - ${b.file}: ${b.imgPath}`));
    process.exit(1); // Fail CI
  } else {
    console.log("✅ All images exist");
  }
}

run();
