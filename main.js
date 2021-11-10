const fs = require("fs");
const colors = require("colors");

let config = JSON.parse(fs.readFileSync('./storage/config.json').toString());
let modules = config.modules;

modules.forEach((module) => {
    if (module.enabled) {
        toConsole(`Module ${colors.yellow(module.name.toUpperCase())} is now loading...`);
        require(module.src);
        toConsole(`Module ${colors.yellow(module.name.toUpperCase())} loaded successfully.`);
    } else {
        toConsole(`Module ${colors.yellow(module.name.toUpperCase())} is disabled.`);
    }
});

function toConsole(data) {
    console.log(`${colors.underline(`[ ${config.name} ${config.version} ${config.stage} ]`)} ${data}`)
}