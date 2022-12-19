import express, { Express, Request, Response } from 'express';
import * as fs from "fs";
import * as path from "path";
import { PrismaClient } from '@prisma/client'
import dotenv from  "dotenv";
import { env, send } from 'process';

dotenv.config();


const app: Express = express();

const prisma = new PrismaClient();

const port = process.env.PORT || 3000;

if (env.ENV !== "DEV") {
    app.use('/css', express.static(path.join(__dirname, "/../css"), { redirect: false}));
}

async function sendHtml(req: Request, res: Response) {
    const dir = env.ENV === "DEV" ? "pages" : ".";
    let fileName = req.path === '/' ? 'index' : req.path;
    const content = fs.readFileSync(`./${dir}/${fileName}.html`);
    let pageData = await prisma.pageData.findUnique({
        where: {
            path: req.path
        }
    });
    const p = {
        ...pageData,
        menus: JSON.parse(pageData?.menus || '{}'),
    }

    // replace apline.js state with data from db
    let contentHtml = content.toString();
    let pData = JSON.stringify(p);
    pData = pData.replace(/{/, '');
    pData = pData.replace(/}$/, '');
    contentHtml = contentHtml.replace('"add it": "here"', pData);

    // replace component only do it server side in dev, and build mode it will be replaced
    if (env.ENV === "DEV") {
        let pattern = /<([A-Z][a-zA-Z0-9-]*) \/>/g;
        const re = new RegExp(pattern);
        const tags = [...contentHtml.matchAll(re)];
        if (tags) {
            for (const tag of tags) {
                const componentName = tag[0].replace('<', '').replace('/>', '').toLowerCase().trim();
                const componentContent = fs.readFileSync(`./${dir}/components/${componentName}.html`);
                const componentContentHtml = componentContent.toString();
                if (tag) {
                    contentHtml = contentHtml.replace(tag[0], componentContentHtml);
                }
            }
        }
    }

    res.setHeader("Content-Type", "text/html");
    res.send(contentHtml);
}

function registerFiles() {
    // file based routing
    const dir = env.ENV === "DEV" ? "pages" : ".";
    const files = fs.readdirSync(`${dir}`);
    for (const file of files) {
        if (file.includes('.css')) continue;
        if (file.includes('index')) {
            app.get('/', sendHtml);
        } else {
            const routeName = file.split(".")[0];
            app.get(`/${routeName}`, sendHtml);
        }
    }
}

async function registerRoutes() {
    const dir = "pages/api";
    const files = fs.readdirSync(path.join(__dirname, `/../${dir}`));
    for (const file of files) {
        const importName = file.split(".")[0];
        const imp = require(path.join(__dirname, `/../${dir}/${file}`));
        const methods = Object.keys(imp);
        if (methods.includes('get')) {
            app.get(`/api/${importName}`, imp["get"]);
        }
        if (methods.includes('post')) {
            app.post(`/api/${importName}`, imp["post"]);
        }
        if (methods.includes('delete')) {
            app.delete(`/api/${importName}`, imp["delete"]);
        }
        if (methods.includes('patch')) {
            app.patch(`/api/${importName}`, imp["patch"]);
        }
    }
}

registerFiles();
registerRoutes();

app.listen(port, () => console.log(`Server started at port: ${port}`));