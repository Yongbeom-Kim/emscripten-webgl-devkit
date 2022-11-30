const watch = require('node-watch');
const fs = require('fs');
const { exec } = require("child_process");
const toml = require('toml');

const configData = toml.parse(fs.readFileSync("./config/config.toml"));

// Parse Entry Path.
// If entryPath = configData.entry = ".src/main.cpp",
// If entryFile = "main.cpp",
// If entryFileName = "main"
const entryPath = configData.entry.dir + "/" + configData.entry.file;
const entryFile = configData.entry.file;
const entryFileName = entryFile.substring(0, entryFile.lastIndexOf("."));

// Run Command
const params = configData.command.params.join(" ").replaceAll("[name]", entryFileName);
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
    console.log(`Compiled successfully! ${stdout}`);
});
