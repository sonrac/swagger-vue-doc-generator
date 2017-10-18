const ParserInterface = require('../ParserInterface'),
      _               = require('lodash')

/**
 * Response parser
 * @class ResponseParser
 *
 * @property {Array.<Swagger20ResponseObject>} originalData Original responses
 * @property {Array.<Swagger20ResponseObject>} data Parsed responses
 * @param {String} modelPath Path to model
 */
class ResponseParser extends ParserInterface {

  /**
   * ResponseParser constructor
   *
   * @param {Array.<Swagger20ResponseObject>} responses Original responses
   * @param {String} modelPath Path to model
   */
  constructor (responses, modelPath) {
    super()

    this.originalData = responses
    this.modelPath = modelPath
  }

  /**
   * Load references name from property
   *
   * @return {undefined|String}
   *
   * @private
   */
  _loadReference (ref) {
    if (_.isString(ref)) {
      let segments = ref.split('/')
      return segments[segments.length - 1]
    }

    return undefined
  }

  /**
   * Parse response
   *
   * @return {Array.<Swagger20ResponseObject>}
   */
  parse () {
    let _self = this
    this.data = {}

    _.each(this.originalData, (config, code) => {
      if (config.schema && config.schema.$ref) {
        let ref          = _self._loadReference(config.schema.$ref)
        config.schema = _.isString(ref) ? {
          ref: ref
        } : {}
        config.modelPath = _self.modelPath
      }
      _self.data[code] = config
    })

    return this.data
  }
}

/**
 * @ignore module.exports
 * @ignore exports
 */
module.exports = ResponseParser