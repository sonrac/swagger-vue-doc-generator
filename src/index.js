/**
 * @ignore module
 * @ignore module.exports
 *
 * @type {{InitCli: InitCli, DocGenerator: DocGenerator, GenerateApi: GenerateApi, SwaggerParser: SwaggerParser, ParserInterface: ParserInterface, parser20: {MethodsParser: MethodsParser, ParametersParser: ParametersParser, Parser: Parser, ResponseParser: ResponseParser, SecuritySchemesParser: SecuritySchemesParser}}}
 */
module.exports = {
  InitCli        : require('./InitCli'),
  DocGenerator   : require('./DocGenerator'),
  GenerateApi    : require('./GenerateApi'),
  SwaggerParser  : require('./SwaggerParser'),
  ParserInterface: require('./ParserInterface'),
  parser20       : {
    MethodsParser        : require('./2.0/MethodsParser'),
    ParametersParser     : require('./2.0/ParametersParser'),
    Parser               : require('./2.0/Parser'),
    ResponseParser       : require('./2.0/ResponseParser'),
    SecuritySchemesParser: require('./2.0/SecuritySchemesParser'),
  }
}