import path from "node:path";
import { fileURLToPath } from "node:url";
import { readdirSync } from "node:fs";
import crypto from "node:crypto";
import matter from "gray-matter";
import dayjs from "dayjs";
import { writeFile } from "node:fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const articlePath = path.resolve(__dirname, "../../src/pages");

interface IPermalink {
    dir: string;
    customDirName?: string;
    dirnameSeperator?: string;
    filenameSeperator?: string;
}
interface IPageInfo {
    name: string;
    path: string;
    children?: Array<IPageInfo>;
}
class Permalink {
    dir: string;
    customDirPath: string;
    dirnameSeperator: string;
    filenameSeperator: string;
    private pagesInfo: Array<IPageInfo>;
    rewrites: Array<Record<string, string>> = [];
    constructor({
        dir, // 存放文章的文件夹
        customDirName, // 自定义页面文件夹名称
        dirnameSeperator, // 文件夹名称分隔符
        filenameSeperator, // 文件名分隔符
    }: IPermalink) {
        this.dir = dir;
        this.customDirPath = path.resolve(dir, customDirName || "custom-pages");
        this.dirnameSeperator = dirnameSeperator || "-";
        this.filenameSeperator = filenameSeperator || ".";
        this.pagesInfo = this.readRawDir();
        console.log(this.pagesInfo);
        // this.rewrites = this.getRewrites();
        // console.log(this.rewrites);
    }
    private readRawDir(dirPath: string = this.dir, category: string[] = []) {
        const result = [];
        readdirSync(dirPath, {
            withFileTypes: true,
        }).forEach((item) => {
            const fPath = path.resolve(dirPath, item.name);

            if (item.isDirectory()) {
                const parsedName = item.name
                    .split(this.dirnameSeperator)
                    .slice(1)
                    .join(this.dirnameSeperator);
                result.push({
                    rawName: item.name,
                    parsedName,
                    absolutePath: fPath,
                    category: [...category],
                    children: this.readRawDir(fPath, [...category, parsedName]),
                });
            } else {
                result.push({
                    rawName: item.name,
                    parsedName: item.name
                        .split(this.filenameSeperator)
                        .slice(1)
                        .join(this.filenameSeperator),
                    absolutePath: fPath,
                    category: [...category],
                });
            }
        });
        return result;
    }
    /**
     * 生成文章的 frontmatter
     * @param absolutePath 文章的绝对路径
     */
    private generateFrontMatter(absolutePath: string) {
        const fmObj = matter.read(absolutePath); // 读取当前的front-matter
        const data = fmObj.data;
        const hash = crypto
            .createHash("md5")
            .update(absolutePath)
            .digest("hex")
            .slice(0, 6); // 生成文章的hash
        const frontmatter = { ...data };
        const title = item.name.split(".").slice(1, -1).join(".");
        if (!data.title || !data.date || !data.permalink) {
            frontmatter.title = frontmatter.title || title;
            frontmatter.permalink = frontmatter.permalink || `/page/${hash}`;
            frontmatter.date =
                frontmatter.date || dayjs().format("YYYY-MM-DD hh:mm:ss");
            frontmatter.categaries = [...categaries];
            frontmatter.author = {
                name: "allen",
                link: "https://github.com/allenice1565",
            };
            writeFile(fPath, matter.stringify(fmObj.content, frontmatter));
        }
    }
    private getRewrites(pages = this.pagesInfo) {
        pages.forEach((item) => {
            if (item.isDir) {
                if (item.children && item.children.length) {
                    this.getRewrites(item.children);
                } else {
                    const dirname = item.name
                        .split(this.dirnameSeperator)
                        .slice(1)
                        .join(this.dirnameSeperator);
                    // this.rewrites[]
                }
                // result.push({
                //     name: item.name,
                //     path: item.path,
                //     children: this.getRewrites(item.children),
                // });
            }
        });
    }
}
const permalink = new Permalink({
    dir: articlePath,
});
console.log("permalink.rewrites", permalink.rewrites);
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
