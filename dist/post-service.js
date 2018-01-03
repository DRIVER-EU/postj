"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const avsc = require("avsc");
const request = require("request");
class PostService {
    constructor(options) {
        this.options = options;
        const filename = path.resolve(options.file);
        fs.exists(filename, exists => {
            if (!exists) {
                console.error(`Error: cannot find ${filename}!`);
                process.exit(1);
            }
            this.sendFile(filename);
        });
    }
    sendFile(filename) {
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
                }
                catch (err) {
                    console.warn('Warning parsing schema, ' + err.message);
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
                if (error) {
                    return console.error(error);
                }
                if (response.statusCode !== 200) {
                    return console.error(body);
                }
                if (response.statusCode === 200) {
                    console.log('Message sent successfully!');
                    if (body) {
                        console.log(typeof body === 'string' ? body : JSON.stringify(body));
                    }
                }
            });
        });
    }
    getHeaderOptions() {
        const header = { 'Content-type': this.options.avro ? 'application/vnd.schemaregistry.v1+json' : 'application/json' };
        if (this.options.header) {
            Object.assign(header, JSON.parse(this.options.header));
        }
        return header;
    }
}
exports.PostService = PostService;
//# sourceMappingURL=post-service.js.map