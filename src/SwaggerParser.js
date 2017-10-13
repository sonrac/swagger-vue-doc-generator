const Parser20 = require('./2.0/Parser'),
      ParserInterface = require('./ParserInterface')

/**
 * @ignore Parser20
 */

/**
 * Parser for swagger data
 *
 * @class SwaggerParser
 * @property {String} type Swagger type (2.0 only supported)
 * @property {Swagger20} data Swagger data (from json or yaml)
 * @property {Parser} parser Swagger parse object
 */
class SwaggerParser extends ParserInterface {
  /**
   * SwaggerParser constructor
   *
   * @param {String} type Swagger type (2.0 only supported)
   * @param {Swagger20} data Swagger data (from json or yaml)
   * @param {ParserOptions} parserOptions Parser options
   */
  constructor (type, data, parserOptions) {
    super()

    this.type   = type
    this.data   = data
    this.parser = this._getParser(parserOptions)
  }

  /**
   * Get swagger parser object
   *
   * @param {ParserOptions} parserOptions Parser options
   *
   * return {ParserInterface}
   * @private
   */
  _getParser (parserOptions) {
    switch (this.type) {
      default:
        return new Parser20(this.data, parserOptions)
    }
  }

  /**
   * Parse swagger data
   *
   * @return {Swagger20}
   */
  parse() {
    return this.parser.parse()
  }
}

/**
 * @ignore module.exports
 * @ignore exports
 */
module.exports = SwaggerParser