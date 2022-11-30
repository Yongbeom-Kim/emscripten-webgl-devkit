const watch = require('node-watch');
const fs = require('fs');
const toml = require('toml');
const http = require('http');
const { exec, execSync } = require("child_process");

let webserver_served = false;

const configData = toml.parse(fs.readFileSync("./config/config.toml"));

// Parse Entry Path.
// If entryPath = configData.entry = ".src/main.cpp",
// If entryFile = "main.cpp",
// If entryFileName = "main"
const entryDir = configData.entry.dir;
const entryPath = configData.entry.dir + "/" + configData.entry.infile;
const entryFile = configData.entry.infile;
const entryFileName = entryFile.substring(0, entryFile.lastIndexOf("."));

const outputDir = replacePlaceholders(configData.output.dir);
const outputPath = replacePlaceholders(configData.output.dir + "/" + configData.output.outfile);

console.clear();

build();

// Run Command on file change
watch(entryDir, (evt, name) => {

    console.clear();
    console.log(`${name} changed (${evt}), compiling...\n`);

    build();

});

/**
 * Build emscripten file
 */
function build() {
    const params = replacePlaceholders(configData.command.params.join(" "));
    const command = `emcc ${entryPath} ${params}`;


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
        serve();
        console.log(`Watching ${entryDir} for changes...`);
    });
}

/**
 * Serve html file in a webserver
 */
function serve() {
    const PORT = 8080;
    if (webserver_served) {
        console.log(`Server available on: http://localhost:${PORT}`);
        return;
    }

    fs.readFile(outputPath, (err, html) => {
        if (err) throw err;

        const server = http.createServer((request, response) => {
            response.writeHeader(200, { "Content-Type": "text/html" });
            response.write(html);
            response.end();
        }).listen(PORT);
        
        console.log(`Server available on: http://localhost:${PORT}`);
    })
    webserver_served = true;
}

function replacePlaceholders(str) {
    return str.replaceAll("[name]", entryFileName);
}