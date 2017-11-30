import * as commandLineArgs from 'command-line-args';
import { OptionDefinition } from 'command-line-args';
import { createService } from './server';

/**
 * Adds missing properties from typings.
 */
export interface FixedOptionDefinition extends OptionDefinition {
  description: string;
  typeLabel: string;
}

export interface ICommandOptions {
  port: number;
  data: string;
  static: string;
  help: boolean;
}


export class CommandLineInterface {
  static optionDefinitions: FixedOptionDefinition[] = [
    { name: 'help', alias: 'h', type: Boolean, typeLabel: '[underline]{Boolean}', description: 'Show help text' },
    { name: 'port', alias: 'p', type: Number, defaultValue: 8123, typeLabel: '[underline]{Number}', description: 'Port address' },
    { name: 'data', alias: 'd', type: String, defaultValue: './data', typeLabel: '[underline]{String}', description: 'Data folder' },
    { name: 'static', alias: 's', type: String, defaultValue: './public', typeLabel: '[underline]{String}', description: 'Static (public) folder' }
  ];

  static sections = [{
    header: 'geojson-tile-server',
    content: 'A simple tile service, that takes one or more GeoJSON files and offers them as slippy maps.'
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
}

const options: ICommandOptions = commandLineArgs(CommandLineInterface.optionDefinitions);

if (options.help) {
  const getUsage = require('command-line-usage');
  const usage = getUsage(CommandLineInterface.sections);
  console.log(usage);
  process.exit(0);
} else {
  createService(options);
}