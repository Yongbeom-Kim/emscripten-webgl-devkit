const watch = require('node-watch');
const fs = require('fs');
const { exec } = require("child_process");

// watch('./src', {recursive: true}, console.log);

const obj = JSON.parse(fs.readFileSync("./config/config.json"));
const entryPoints = obj.entry;
const params = obj.params.join(" ");
const command = `emcc ./src/${entryfile} ${params}`

entryPoints.forEach(entryFile => {

    const entryFileName = entryFile.substring(0, entryFile.lastIndexOf("."));

    exec(command.replaceAll("[name]", entryFileName), (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
    
});