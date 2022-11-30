import("./build.mjs").then((build) => {

    var argv = require('minimist')(process.argv.slice(2));
    // console.log(argv);

    // node __ build for development environment
    if (argv["_"][0] === "build") {
        console.log("Building... \n");
        build.default();
    }
    
})
