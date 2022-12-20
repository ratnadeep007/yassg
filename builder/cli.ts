import fs from "fs";
import path from "path";

const argv = process.argv;

const command = argv[2];

if (!command) {
    throw "command required";
}

if (command === "pages") {
    const action = process.argv[3];
    if (!action) {
        throw "action required";
    }
    const name = process.argv[4];
    if (!name) {
        throw "name required";
    }
    if (action === "new") {
        let template = fs.readFileSync(path.join(__dirname, '/pageTemplate.html'));
        let modTemplate = template.toString().replace('<!-- add here -->', `${name}`);
        fs.writeFileSync(path.join(__dirname, `../pages/${name}.html`), modTemplate); 
    }
} else if (command === "api") {
    const action = process.argv[3];
    if (!action) {
        throw "action required";
    }
    const name = process.argv[4];
    if (!name) {
        throw "name required";
    }
    if (action === "new") {
        let template = fs.readFileSync(path.join(__dirname, '/apiTemplate.ts'));
        fs.writeFileSync(path.join(__dirname, `../pages/api/${name}.ts`), template);
    }
}