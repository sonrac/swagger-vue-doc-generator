/**
 * @ignore module
 * @ignore module.exports
 *
 * @type {{InitCli: InitCli, DocGenerator: DocGenerator, GenerateApi: GenerateApi, SwaggerParser: SwaggerParser, ParserInterface: ParserInterface, parser20: {MethodsParser: MethodsParser, ParametersParser: ParametersParser, Parser: Parser, ResponseParser: ResponseParser, SecuritySchemesParser: SecuritySchemesParser}}}
 */
module.exports = {
  InitCli        : require('./src/InitCli'),
  DocGenerator   : require('./src/DocGenerator'),
  GenerateApi    : require('./src/GenerateApi'),
  SwaggerParser  : require('./src/SwaggerParser'),
  ParserInterface: require('./src/ParserInterface'),
  parser20       : {
    MethodsParser        : require('./src/2.0/MethodsParser'),
    ParametersParser     : require('./src/2.0/ParametersParser'),
    Parser               : require('./src/2.0/Parser'),
    ResponseParser       : require('./src/2.0/ResponseParser'),
    SecuritySchemesParser: require('./src/2.0/SecuritySchemesParser'),
  }
}
