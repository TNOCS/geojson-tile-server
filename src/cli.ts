import * as commandLineArgs from 'command-line-args';
import { OptionDefinition } from 'command-line-args';
import { createService } from './server';
import * as npmPackage from '../package.json';

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
  maxZoom: number;
  promoteId: string;
  generatedId: boolean;
  help: boolean;
}

export class CommandLineInterface {
  static optionDefinitions: FixedOptionDefinition[] = [
    {
      name: 'help',
      alias: 'h',
      type: Boolean,
      typeLabel: '[underline]{Boolean}',
      description: 'Show help text'
    },
    {
      name: 'port',
      alias: 'p',
      type: Number,
      defaultValue: 8123,
      typeLabel: '[underline]{Number}',
      description: 'Port address'
    },
    {
      name: 'maxZoom',
      alias: 'z',
      type: Number,
      defaultValue: 22,
      typeLabel: '[underline]{Number}',
      description: 'Max zoom'
    },
    {
      name: 'data',
      alias: 'd',
      type: String,
      defaultValue: './data',
      typeLabel: '[underline]{String}',
      description: 'Data folder'
    },
    {
      name: 'promoteId',
      alias: 'i',
      type: String,
      typeLabel: '[underline]{String}',
      description: 'Name of the property to use as ID.'
    },
    {
      name: 'generateId',
      alias: 'g',
      type: Boolean,
      defaultValue: true,
      typeLabel: '[underline]{String}',
      description: 'Generate an ID for each feature automatically.'
    },
    {
      name: 'static',
      alias: 's',
      type: String,
      defaultValue: './public',
      typeLabel: '[underline]{String}',
      description: 'Static (public) folder'
    }
  ];

  static sections = [
    {
      header: `${npmPackage.name}, v${npmPackage.version}`,
      content: `${npmPackage.license} license.

    ${npmPackage.description}

    The output can be found at "http://HOSTNAME:PORT/LAYERNAME/z/x/y.EXT", where EXT is geojson, vt or mvt.`
    },
    {
      header: 'Options',
      optionList: CommandLineInterface.optionDefinitions
    },
    {
      header: 'Examples',
      content: [
        {
          desc: '01. Serve the data folder on port 8123',
          example: '$ geojson-tile-server'
        },
        {
          desc: '02. Serve the data folder on port 8080',
          example: '$ geojson-tile-server -p 8080'
        },
        {
          desc: '03. Serve the "geojson" folder on port 8080',
          example: '$ geojson-tile-server -d geojson -p 8080'
        }
      ]
    }
  ];
}

const options = commandLineArgs(
  CommandLineInterface.optionDefinitions
) as ICommandOptions;

if (options.help) {
  const getUsage = require('command-line-usage');
  const usage = getUsage(CommandLineInterface.sections);
  console.log(usage);
  process.exit(0);
} else {
  createService(options);
}
