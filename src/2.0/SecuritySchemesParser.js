const _                = require('lodash'),
      ParserInterface  = require('./../ParserInterface'),
      ParametersParser = require('./ParametersParser')

/**
 * @class SecuritySchemesParser
 * Security schema parser
 *
 * @property {Array.<SecurityObject>} schemes Security schemas config
 * @property {Array.<HeaderObject>} headers Security headers
 * @property {String} apiMethodLink Path to methods destination (without absolute path)
 * @property {Array.<ParameterObject>} parameters Security schemas parameters
 */
class SecuritySchemesParser extends ParserInterface {
  /**
   * SecuritySchemaParser Constructor
   *
   * @param {Array.<SecurityObject>} schemes Schemes definition object
   */
  constructor (schemes) {
    super()

    this.schemes    = schemes
    this.headers    = {}
    this.parameters = {}
  }

  /**
   * Parse headers & parameters from schemes
   *
   * @private
   */
  _parseParameters () {
    let _self = this
    _.each(this.schemes, (config, name) => {

      if (typeof config !== 'object' || (typeof config === 'object' && typeof config.in === 'undefined')) {
        return
      }

      let title = (config.in === 'header' ? 'Header ' : 'Parameter ') + ' for authorization by ' + name

      let paramObject = {
        title        : title,
        description  : title,
        name         : config.name,
        camelCaseName: _.camelCase(config.name),
        schemaName   : name,
        required     : config.required || false,
        value        : [config.default || ''],
      }

      paramObject['is' + _.upperFirst(config.in) + 'Parameter'] = true

      if (config.in === 'header') {
        if (typeof _self.headers[name] === 'undefined') {
          _self.headers[name] = []
        }

        _self.headers[name].push(paramObject)
      } else {
        if (typeof _self.parameters[name] === 'undefined') {
          _self.parameters[name] = []
        }

        _self.parameters[name].push(paramObject)
      }
    })
  }

  parse () {
    return this.schemes
  }

  /**
   * Get parameters for request
   * @param {Object} security Security object
   * @return {Array.<ParameterObject>}
   */
  getParametersForRequest (security) {
    return this._getHeadersOrParams(security, false)
  }

  /**
   * Get headers for request
   * @param {Object} security Security object
   * @param {boolean} isHeader True if needed headers or false if need parameters
   * @return {Array<HeaderObject>|Array.<ParameterObject>}
   */
  _getHeadersOrParams (security, isHeader) {
    let options = [],
        _self   = this

    isHeader = isHeader ? true : typeof isHeader === 'undefined'

    let optionName = isHeader ? 'headers' : 'parameters'

    if (!_.isObject(security)) {
      return []
    }

    _.each(security, (config, name) => {
      if (typeof _self[optionName][name] === 'undefined') {
        return
      }

      _.each(_self[optionName][name], function (config, name) {
        options.push(config)
      })
    })

    return options
  }

  /**
   * Get headers for request
   * @param {Object} security Security object
   *
   * @return {Array.<HeaderObject>}
   */
  getHeadersForRequest (security) {
    return this._getHeadersOrParams(security)
  }
}

/**
 * @ignore module.exports
 * @ignore exports
 */

module.exports = SecuritySchemesParser