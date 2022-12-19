import * as fs from "fs";
import { spawn } from "child_process";
import path from "path";

function fixTailwind() {
    fs.rmSync(path.join(__dirname, "/../build"), { recursive: true, force: true });
    fs.mkdirSync(path.join(__dirname, "/../build"));
    const postcss = path.join(__dirname, "/../node_modules/.bin/postcss");
    const output = path.join(__dirname, "/../build/css/output.css");
    const input = path.join(__dirname, "/../pages/main.css");
    let child = spawn(`${postcss}`, ['-o', `${output}`, `${input}`]);
    child.on("error", (e) => {console.log(e); return;})


    const dirs = fs.readdirSync(path.join(__dirname, "/../pages"));
    for (const file of dirs) {
        if (file.includes(".html")) {
            try {
                const content = fs.readFileSync(path.join(__dirname, "/../pages", `/${file}`), { encoding: 'utf-8' });
                let contentHtml = content.toString();

                contentHtml = contentHtml.replace('<script src="https://cdn.tailwindcss.com"></script>', `<link rel="stylesheet" href="/css/output.css" />`);
                contentHtml = appendComponents(contentHtml);
                fs.writeFileSync(path.join(__dirname, `/../build/${file}`), contentHtml, { flag: 'w', encoding: 'utf-8' });
            } catch(e) {
                console.error(e);
            }
        }
    }
    process.exit(0);
}

function appendComponents(contentHtml: string): string {
    let pattern = /<([A-Z][a-zA-Z0-9-]*) \/>/g;
    const re = new RegExp(pattern);
    const tags = [...contentHtml.matchAll(re)];
    if (tags) {
        for (const tag of tags) {
            const componentName = tag[0].replace('<', '').replace('/>', '').toLowerCase().trim();
            const componentContent = fs.readFileSync(path.join(__dirname, `/../pages/components/${componentName}.html`));
            const componentContentHtml = componentContent.toString();
            if (tag) {
                contentHtml = contentHtml.replace(tag[0], componentContentHtml);
            }
        }
    }
    return contentHtml;
}

fixTailwind();

