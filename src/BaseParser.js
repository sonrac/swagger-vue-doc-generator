const ParametersParser     = require('./2.0/ParametersParser'),
      SecuritySchemaParser = require('./2.0/DefinitionsParser'),
      ParserInterface      = require('./ParserInterface')
/**
 * @ignore module.exports
 * @ignore exports
 */

/**
 * Base class for swagger parser
 * @class BaseParser
 *
 * @property {MethodsParser} methodParser Methods parser
 * @property {SecuritySchemaParser} schemaParser Parser for security schema
 */
class BaseParser extends ParserInterface {

  constructor (data) {
    super()

    if (new.target === BaseParser) {
      throw new TypeError('Cannot construct Abstract instances directly')
    }

    this.data         = data
    this.paramParser  = new ParametersParser()
    this.schemaParser = new SecuritySchemaParser()
  }
}

module.exports = BaseParser