# postj

A command line utility to post JSON messages, e.g. an Apache AVRO schema to Kafka's schema registry.

## Installation

```
npm i -g postj
```
Run `postj` to see all command line options.

## Build

```
git clone https://github.com/DRIVER-EU/postj.git
npm install
npm run build
```

## Manual

A simple command line application to post JSON messages.

Although you can use 'curl' to post data, this can be quite cumbersome in case you are dealing with large JSON objects. Also on Windows, 'curl' often isn't installed. So this is a very simple utility that easily allows you to post a JSON file to an endpoint.

Please note that the main reason to create this small utility was my need to easily register AVRO schema's with Apache Kafka. So the '-a' option is there, which will validate the schema too using the [avsc](https://github.com/mtth/avsc) library, and set the appropriate headers for the Kafka schema registry.

Options

  -h, --help Boolean    Show help text
  -u, --uri String      Endpoint URI, e.g. http://localhost:1234/api
  -f, --file String     JSON file to send's
  -H, --header String   Optional header to use, default: { "Content-type": "application/json" }
  -a, --avro Boolean    Set header to { "Content-type": "application/vnd.schemaregistry.v1+json" }

Examples

  01. Post a JSON file.                $ postj http://localhost:1234/api -f data.json
  02. Post an AVRO schema to a TOPIC.  $ postj http://localhost:3601/api/schema-registry/subjects/TOPIC/versions -a -f data\test.avsc
  03. Override the default header.     $ postj http://localhost:1234/api -H "{ "key1": "value1" }" -f data.json
