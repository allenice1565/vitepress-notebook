import { defineLoader } from "vitepress";
import config from "../config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { posts } from "./get-articles";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const articlePath = path.resolve(__dirname, "../../", config.srcDir);

export default defineLoader({
    watch: [`${articlePath}/**/*.md`],
    load(watchedFiles) {
        return { posts, watchedFiles };
    },
});
