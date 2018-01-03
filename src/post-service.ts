import * as fs from 'fs';
import * as path from 'path';
import * as avsc from 'avsc';
import * as request from 'request';
import { ICommandOptions } from './cli';

export class PostService {
  constructor(private options: ICommandOptions) {
    const filename = path.resolve(options.file);
    fs.exists(filename, exists => {
      if (!exists) {
        console.error(`Error: cannot find ${filename}!`);
        process.exit(1);
      }
      this.sendFile(filename);
    });
  }

  private sendFile(filename: string) {
    fs.readFile(filename, (err, data) => {
      if (err) {
        console.error(err.message);
        process.exit(1);
      }
      const json = JSON.parse(data.toString());
      if (this.options.avro) {
        try {
          // Check whether we are sending an AVRO schema
          const avroSchema = avsc.Type.forSchema(json);
          console.log('Sending valid AVRO schema: ' + avroSchema.name);
        } catch (err) {
          console.error('Error parsing schema, ' + err.message);
          process.exit(1);
        }
      }
      const body = { schema: JSON.stringify(json) };
      const requestOptions = {
        uri: this.options.uri,
        method: 'POST',
        body,
        json: true,
        headers: this.getHeaderOptions()
      };

      request(requestOptions, (error, response, body) => {
        if (error) { return console.error(error); }
        if (response.statusCode !== 200) { return console.error(body); }
        if (response.statusCode === 200) {
          console.log('Message sent successfully!');
          if (body) { console.log(typeof body === 'string' ? body : JSON.stringify(body)); }
        }
      });
    });
  }

  private getHeaderOptions() {
    const header = { 'Content-type': this.options.avro ? 'application/vnd.schemaregistry.v1+json' : 'application/json' };
    if (this.options.header) { Object.assign(header, JSON.parse(this.options.header)); }
    return header;
  }
}