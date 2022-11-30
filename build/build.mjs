import { replacePlaceholders, getNameFromPath, getDirFromPath } from "./utils.mjs";
import watch from 'node-watch';
import fs from 'fs';
import toml from 'toml'
import { exec } from 'child_process'
// const watch = require('node-watch');
// const fs = require('fs');
// const toml = require('toml');
// const { exec } = require("child_process");

/**
 * Call this function to build 
 */
export default function build() {

    // Parse config
    const configData = toml.parse(fs.readFileSync("./config/config.toml"));
    const entryPath = configData.entry.dir + "/" + configData.entry.infile;
    const infileName = getNameFromPath(configData.entry.infile)
    const outputPath =
        replacePlaceholders(configData.output.dir + "/" + configData.output.outfile, infileName);

    const params = configData.build.params
    const willWatch = configData.build.watch

    build_without_watch(entryPath, outputPath, params);

    if (willWatch) {
        watch(getDirFromPath(entryPath), (evt, name) => {

            // console.clear(); 
            console.log(`${name} changed (${evt}), compiling...\n`);

            build_without_watch(entryPath, outputPath, params);

        });
    }

}

function build_without_watch(entryPath, outputPath, arg_array) {

    const params = replacePlaceholders(arg_array.join(" "), getNameFromPath(outputPath));
    const command = `emcc ${entryPath} -o ${outputPath} ${params}`;

    console.log(`> ${command}\n`);

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`Compiled ${entryPath} successfully! ${stdout}`);
        console.log(`Watching ${getDirFromPath(entryPath)} for changes...\n`);
    });
}

// module.exports = build;