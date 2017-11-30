"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var commandLineArgs = require("command-line-args");
var server_1 = require("./server");
var npmPackage = require("../package.json");
var CommandLineInterface = /** @class */ (function () {
    function CommandLineInterface() {
    }
    CommandLineInterface.optionDefinitions = [
        { name: 'help', alias: 'h', type: Boolean, typeLabel: '[underline]{Boolean}', description: 'Show help text' },
        { name: 'port', alias: 'p', type: Number, defaultValue: 8123, typeLabel: '[underline]{Number}', description: 'Port address' },
        { name: 'data', alias: 'd', type: String, defaultValue: './data', typeLabel: '[underline]{String}', description: 'Data folder' },
        { name: 'static', alias: 's', type: String, defaultValue: './public', typeLabel: '[underline]{String}', description: 'Static (public) folder' }
    ];
    CommandLineInterface.sections = [{
            header: npmPackage.name + ", version " + npmPackage.version + " (created by " + npmPackage.author + ", " + npmPackage.license + " license)",
            content: npmPackage.description
        }, {
            header: 'Options',
            optionList: CommandLineInterface.optionDefinitions
        }, {
            header: 'Examples',
            content: [{
                    desc: '01. Serve the data folder on port 8123',
                    example: '$ geojson-tile-server'
                }, {
                    desc: '02. Serve the data folder on port 8080',
                    example: '$ geojson-tile-server -p 8080'
                }, {
                    desc: '03. Serve the "geojson" folder on port 8080',
                    example: '$ geojson-tile-server -d geojson -p 8080'
                }]
        }
    ];
    return CommandLineInterface;
}());
exports.CommandLineInterface = CommandLineInterface;
var options = commandLineArgs(CommandLineInterface.optionDefinitions);
if (options.help) {
    var getUsage = require('command-line-usage');
    var usage = getUsage(CommandLineInterface.sections);
    console.log(usage);
    process.exit(0);
}
else {
    server_1.createService(options);
}
//# sourceMappingURL=cli.js.map