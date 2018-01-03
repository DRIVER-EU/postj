import { PostService } from './post-service';
import * as commandLineArgs from 'command-line-args';
import { OptionDefinition } from 'command-line-args';
import * as npmPackage from '../package.json';

export interface ICommandOptions {
  file: string;
  uri: string;
  header: string;
  avro: boolean;
  help: boolean;
}

export class CommandLineInterface {
  static optionDefinitions: OptionDefinition[] = [{
    name: 'help',
    alias: 'h',
    type: Boolean,
    typeLabel: '[underline]{Boolean}',
    description: 'Show help text'
  }, {
    name: 'uri',
    alias: 'u',
    type: String,
    defaultOption: true,
    typeLabel: '[underline]{String}',
    description: 'Endpoint URI, e.g. http://localhost:1234/api'
  }, {
    name: 'file',
    alias: 'f',
    type: String,
    typeLabel: '[underline]{String}',
    description: 'JSON file to send\'s'
  }, {
    name: 'header',
    alias: 'H',
    type: String,
    typeLabel: '[underline]{String}',
    description: 'Optional header to use (default { "Content-type": "application/json" }).'
  }, {
    name: 'avro',
    alias: 'a',
    type: Boolean,
    typeLabel: '[underline]{Boolean}',
    description: 'Set header to (default { "Content-type": "application/vnd.schemaregistry.v1+json" }).'
  }];

  static sections = [
    {
      header: `${npmPackage.name}, v${npmPackage.version}`,
      content: `${npmPackage.license} license.

    ${npmPackage.description}

    Although you can use 'curl' to post data, this can be quite cumbersome
    in case you are dealing with large JSON objects. Also on Windows, 'curl'
    often isn't installed. So this is a very simple utility that easily
    allows you to post a JSON file to an endpoint.

    Please note that the main reason to create this small utility was my need
    to easily register AVRO schema's with Apache Kafka. So the '-a' option is
    there, which will validate the schema too, and set the appropriate headers
    for the Kafka schema registry.
    `
    }, {
      header: 'Options',
      optionList: CommandLineInterface.optionDefinitions
    }, {
      header: 'Examples',
      content: [{
        desc: '01. Post a JSON file.',
        example: `$ ${npmPackage.name} http://localhost:1234/api -f data.json`
      }, {
        desc: '02. Post an AVRO schema (in JSON).',
        example: `$ ${npmPackage.name} http://localhost:3601/api/schema-registry/subjects/TOPIC/versions -a -f data\\test.avsc`
      }, {
        desc: '03. Override the default header.',
        example: `$ ${npmPackage.name} http://localhost:1234/api -H "{ \"key1\": \"value1\" }" -f data.json`
      }]
    }
  ];
}

const options: ICommandOptions = commandLineArgs(
  CommandLineInterface.optionDefinitions
);

if (options.help || !options.uri || !options.file) {
  const getUsage = require('command-line-usage');
  const usage = getUsage(CommandLineInterface.sections);
  console.log(usage);
  process.exit(1);
} else {
  new PostService(options);
}
