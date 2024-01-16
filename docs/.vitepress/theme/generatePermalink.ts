import path from "node:path";
import { fileURLToPath } from "node:url";
import { readdirSync } from "node:fs";
import crypto from "node:crypto";
import matter from "gray-matter";
import dayjs from "dayjs";
import { writeFile } from "node:fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const articlePath = path.resolve(__dirname, "../../src");

interface IPermalink {
    dir: string;
    customDirName?: string;
    dirnameSeperator?: string;
    filenameSeperator?: string;
}
interface IRawDir {
    name: string;
    path: string;
    children?: Array<IRawDir>;
}
class Permalink {
    dir: string;
    customDirName: string;
    dirnameSeperator: string;
    filenameSeperator: string;
    private rawDir: Array<IRawDir>;
    constructor({
        dir, // 存放文章的文件夹
        customDirName, // 自定义页面文件夹名称
        dirnameSeperator, // 文件夹名称分隔符
        filenameSeperator, // 文件名分隔符
    }: IPermalink) {
        this.dir = dir;
        this.customDirName = customDirName || "custom-pages";
        this.dirnameSeperator = dirnameSeperator || "-";
        this.filenameSeperator = filenameSeperator || ".";
        this.rawDir = [];
    }
    private readRawDir(dirPath: string = this.dir) {
        const result = [];
        readdirSync(dirPath, {
            withFileTypes: true,
        }).forEach((item) => {
            const fPath = path.resolve(dirPath, item.name);
            if (item.isDirectory()) {
                result.push({
                    name: item.name,
                    path: fPath,
                    children: this.readRawDir(dirPath),
                });
            } else {
                result.push({
                    name: item.name,
                    path: fPath,
                });
            }
        });
        return result;
    }
}
const rewrites = {};
const getPosts = (filePath, categaries = []) => {
    const result = [];
    readdirSync(filePath, {
        withFileTypes: true,
    }).forEach((item) => {
        const fPath = path.resolve(filePath, item.name);
        if (item.isDirectory()) {
            const dirname = item.name.split("-").slice(1).join("-");
            result.push({
                name: item.name,
                path: fPath,
                children: getPosts(fPath, [...categaries, dirname]),
            });
        } else {
            const m = matter.read(fPath);
            const data = m.data;
            const hash = crypto
                .createHash("md5")
                .update(fPath)
                .digest("hex")
                .slice(0, 6);
            const frontmatter = { ...data };
            const title = item.name.split(".").slice(1, -1).join(".");
            if (!data.title || !data.date || !data.permalink) {
                frontmatter.title = frontmatter.title || title;
                frontmatter.permalink =
                    frontmatter.permalink || `/page/${hash}`;
                frontmatter.date =
                    frontmatter.date || dayjs().format("YYYY-MM-DD hh:mm:ss");
                frontmatter.categaries = [...categaries];
                frontmatter.author = {
                    name: "allen",
                    link: "https://github.com/allenice1565",
                };
                writeFile(fPath, matter.stringify(m.content, frontmatter));
            }
            const relativePath = path
                .normalize(fPath.split(articlePath)[1])
                .split(path.sep)
                .join("/")
                .slice(1);
            rewrites[relativePath] = frontmatter.permalink.slice(1) + ".md";
            result.push({
                path: fPath,
                ...frontmatter,
            });
        }
    });
    return result;
};
const posts = getPosts(articlePath);

export { posts, rewrites };
