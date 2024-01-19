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
    children?: Array<IPageInfo>;
    rawName: string;
    parsedName: string;
    absolutePath: string;
    category: string[];
    permalink?: string;
    isDir?: boolean;
}
class ArticleInfo {
    dir: string;
    customDirPath: string;
    dirnameSeperator: string;
    filenameSeperator: string;
    posts: Array<IPageInfo>;
    rewrites: Record<string, string> = {};
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
        this.posts = this.readRawDir();
        this.rewrites = this.generateRewrites();
        console.log(123);
    }
    /**
     * 读取文件夹下的所有文章
     */
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
                    isDir: true,
                    rawName: item.name,
                    parsedName,
                    absolutePath: fPath,
                    category: [...category],
                    children: this.readRawDir(fPath, [...category, parsedName]),
                });
            } else {
                result.push({
                    isDir: false,
                    rawName: item.name,
                    parsedName: item.name
                        .split(this.filenameSeperator)
                        .slice(1)
                        .join(this.filenameSeperator),
                    absolutePath: fPath,
                    category: [...category],
                    permalink: this.generateFrontMatter(fPath, [...category]),
                });
            }
        });
        return result;
    }
    /**
     * 生成文章的 frontmatter
     * @param absolutePath 文章的绝对路径
     */
    private generateFrontMatter(absolutePath: string, categaries = []): string {
        const fmObj = matter.read(absolutePath); // 读取当前的front-matter
        const data = fmObj.data;
        const hash = crypto
            .createHash("md5")
            .update(absolutePath)
            .digest("hex")
            .slice(0, 6); // 生成文章的hash
        const frontmatter = { ...data };
        const title = path
            .basename(absolutePath)
            .split(".")
            .slice(1, -1)
            .join("."); // 文章的标题
        // 文章的frontmatter没有标题或者日期或者永久链接的时候，自动给文章添加标题，日期，永久链接
        if (!data.title || !data.date || !data.permalink) {
            frontmatter.title = frontmatter.title || title;
            frontmatter.permalink = frontmatter.permalink || `/page/${hash}`;
            frontmatter.date =
                frontmatter.date || dayjs().format("YYYY-MM-DD hh:mm:ss");
            frontmatter.categaries = [...categaries];
            frontmatter.author = {
                name: "Allen",
                link: "https://github.com/allenice1565",
            };
            writeFile(
                absolutePath,
                matter.stringify(fmObj.content, frontmatter),
            );
        }
        return frontmatter.permalink;
    }
    /**
     * 生成路由重写rewrites配置
     * @param pages 由readRawDir读取的文件夹的文章信息
     */
    private generateRewrites(pages = this.posts): Record<string, string> {
        const rewrites = {};
        pages.forEach((item) => {
            if (item.isDir) {
                return Object.assign(
                    rewrites,
                    this.generateRewrites(item.children),
                );
            }
            const relativePath = path
                .relative(`${this.dir}/../`, item.absolutePath)
                .split(path.sep)
                .join(path.posix.sep);
            rewrites[relativePath] = `${item.permalink.slice(1)}.md`;
        });
        return rewrites;
    }
}
const articleInfo = new ArticleInfo({
    dir: articlePath,
});
// const rewrites = {};
// const getPosts = (filePath, categaries = []) => {
//     const result = [];
//     readdirSync(filePath, {
//         withFileTypes: true,
//     }).forEach((item) => {
//         const fPath = path.resolve(filePath, item.name);
//         if (item.isDirectory()) {
//             const dirname = item.name.split("-").slice(1).join("-");
//             result.push({
//                 name: item.name,
//                 path: fPath,
//                 children: getPosts(fPath, [...categaries, dirname]),
//             });
//         } else {
//             const m = matter.read(fPath);
//             const data = m.data;
//             const hash = crypto
//                 .createHash("md5")
//                 .update(fPath)
//                 .digest("hex")
//                 .slice(0, 6);
//             const frontmatter = { ...data };
//             const title = item.name.split(".").slice(1, -1).join(".");
//             if (!data.title || !data.date || !data.permalink) {
//                 frontmatter.title = frontmatter.title || title;
//                 frontmatter.permalink =
//                     frontmatter.permalink || `/page/${hash}`;
//                 frontmatter.date =
//                     frontmatter.date || dayjs().format("YYYY-MM-DD hh:mm:ss");
//                 frontmatter.categaries = [...categaries];
//                 frontmatter.author = {
//                     name: "allen",
//                     link: "https://github.com/allenice1565",
//                 };
//                 writeFile(fPath, matter.stringify(m.content, frontmatter));
//             }
//             const relativePath = path
//                 .normalize(fPath.split(articlePath)[1])
//                 .split(path.sep)
//                 .join("/")
//                 .slice(1);
//             rewrites[relativePath] = frontmatter.permalink.slice(1) + ".md";
//             result.push({
//                 path: fPath,
//                 ...frontmatter,
//             });
//         }
//     });
//     return result;
// };
// const posts = getPosts(articlePath);
const posts = articleInfo.posts;
const rewrites = articleInfo.rewrites;
// console.log("articleInfo.posts", articleInfo.posts[0].children[0]);
console.log("articleInfo.rewrites", articleInfo.rewrites);

export { posts, rewrites };