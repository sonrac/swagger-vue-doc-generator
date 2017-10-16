const ParserInterface = require('../ParserInterface')

/**
 * Response parser
 * @class ResponseParser
 *
 * @property {Array.<Swagger20ResponseObject>} data Original responses
 */
class ResponseParser extends ParserInterface {

  /**
   * ResponseParser constructor
   *
   * @param {Array.<Swagger20ResponseObject>} responses Original responses
   */
  constructor (responses) {
    super()

    this.data = responses
  }

  /**
   * Parse response
   *
   * @return {Array.<Swagger20ResponseObject>}
   */
  parse () {
    return this.data
  }
}

/**
 * @ignore module.exports
 * @ignore exports
 */
module.exports = ResponseParser