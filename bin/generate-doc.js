const GenerateApi    = require('../src/GenerateApi'),
      _              = require('lodash'),
      fs             = require('fs'),
      path           = require('path'),
      ArgumentParser = require('argparse').ArgumentParser,
      parser         = new ArgumentParser({
        version    : '0.1',
        addHelp    : true,
        description: 'Generate Vue.js client for swagger spec'
      })

parser.addArgument(
  ['-s', '--source'],
  {
    help    : 'Source swagger file destination',
    required: true
  }
)

parser.addArgument(
  ['-m', '--moduleName'],
  {
    help    : 'Swagger generator module name',
    required: true
  }
)

parser.addArgument(
  ['-c', '--className'],
  {
    help        : 'Swagger generator class name',
    defaultValue: 'API',
  }
)

parser.addArgument(
  ['-d', '--destination'],
  {
    help    : 'Destination for output generate client ',
    required: true
  }
)

const args      = parser.parseArgs(),
      jsonFile  = fs.existsSync(args.source) ? args.source : path.join(process.cwd(), args.source),
      generator = new GenerateApi(jsonFile, {
        outFile   : args.destination,
        moduleName: args.moduleName,
        className : args.className
      })

generator.generate()
