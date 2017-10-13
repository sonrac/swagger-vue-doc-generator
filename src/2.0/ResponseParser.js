const ParserInterface = require('../ParserInterface')

/**
 * @ignore module.exports
 * @ignore exports
 */

/**
 * Response parser
 * @class ResponseParser
 *
 * @property {Array.<Swagger20ResponseObject>} data Original responses
 */
class ResponseParser extends ParserInterface {
  constructor (responses) {
    super()

    this.data = responses
  }
}

/**
 * @ignore module.exports
 * @ignore exports
 */
module.exports = ResponseParser