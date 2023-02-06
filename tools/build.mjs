import fs from "node:fs";
import * as rollup from "rollup";
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";

fs.rmSync("build", { recursive: true, force: true });
fs.mkdirSync("build");

const extensions = [".mjs", ".js", ".json", ".node", ".ts", ".tsx"];

const bundle = await rollup.rollup({
    input: "src/ui/index.tsx",

    plugins: [
        babel({
            babelHelpers: "bundled",
            extensions: extensions.filter(extension => extension !== ".json"),
        }),
        json({
            compact: true,
            namedExports: false,
        }),
        commonjs(),
        resolve({
            extensions,
        }),
    ],

    onwarn(warning, rollupWarn) {
        if (warning.code !== "CIRCULAR_DEPENDENCY") {
            rollupWarn(warning);
        }
    },
});

await bundle.write({
    format: "es",
    entryFileNames: "bundle.js",
    dir: "build",
});
