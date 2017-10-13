const ParserInterface  = require('../ParserInterface'),
      _                = require('lodash'),
      ParametersParser = require('./ParametersParser'),
      ResponseParser   = require('./ResponseParser')

/**
 * @ignore _
 */

/**
 * Methods parser for swagger 2.0
 * @class MethodsParser
 *
 * @property {Object} methods Original methods data
 * @property {ResponseParser|undefined} respParser Response parser object
 * @property {ParametersParser|undefined} paramParser Parameters parser object
 * @property {SecuritySchemesParser} securityParser Security parser
 * @property {ParameterParserOptionsObject} parameterParserConfig Parameters parser config object
 * @property {Array.<MethodConfigObject>} parseMethods Parsed methods
 */
class MethodsParser extends ParserInterface {
  constructor (methods, securityParser, options) {
    super()

    options = options || {}

    this.parameterParserConfig = options.parameterParserConfig
    // this.respParserConfig = options.respParserConfig

    this.securityParser = securityParser
    this.parseMethods   = []
    this.methods        = methods
  }

  _iterateMethod (config, uri) {
    let _self   = this,
        methods = []
    _.each(config, (methodConfig, method) => {
      method         = _.upperCase(method)
      let nextMethod = {
        path          : uri,
        method        : method,
        tags          : methodConfig.tags,
        summary       : methodConfig.summary,
        description   : methodConfig.description,
        externalDocs  : methodConfig.externalDocs,
        operationId   : methodConfig.operationId,
        produces      : methodConfig.produces,
        consumes      : methodConfig.consumes,
        schemes       : methodConfig.schemes,
        isDeprecated  : methodConfig.deprecated,
        security      : methodConfig.security,
        isSecure      : typeof methodConfig.security !== 'undefined',
        isGET         : method === 'GET',
        isPUT         : method === 'PUT',
        isOPTIONS     : method === 'OPTIONS',
        isDELETE      : method === 'DELETE',
        isHEAD        : method === 'HEAD',
        isPOST        : method === 'POST',
        isTRACE       : method === 'TRACE',
        isCONNECT     : method === 'CONNECT',
        isPATCH       : method === 'PATCH',
        headers       : [],
        parameters    : [],
        bodyParams    : [],
        queryParams   : [],
        formDataParams: [],
        enums         : [],
        pathParams    : [],
      }

      if (_.size(methodConfig.parameters)) {
        _self.paramParser         = new ParametersParser(methodConfig.parameters, _self.parameterParserConfig)
        nextMethod.parameters     = _self.paramParser.parse()
        nextMethod.headers        = _self.paramParser.headers
        nextMethod.enums          = _self.paramParser.enums
        nextMethod.bodyParams     = _self.paramParser.bodys
        nextMethod.queryParams    = _self.paramParser.querys
        nextMethod.formDataParams = _self.paramParser.formDatas
        nextMethod.pathParams     = _self.paramParser.paths
      }

      if (_.size(methodConfig.responses)) {
        _self.respParser = new ResponseParser(methodConfig.responses)
      }

      nextMethod = _self._addSecurityParameters(nextMethod)

      _self.parseMethods.push(nextMethod)

    })
  }

  /**
   * Add security headers & params
   *
   * @param {MethodConfigObject} methodConfig
   *
   * @return {MethodConfigObject}
   * @private
   */
  _addSecurityParameters (methodConfig) {
    let _self      = this,
        headers    = this.securityParser.getHeadersForRequest(methodConfig.security),
        parameters = this.securityParser.getParametersForRequest(methodConfig.security)

    if (_.size(headers)) {
      _.each(headers, (headConfig, index) => {
        if (typeof headConfig === "undefined") {
          return
        }
        methodConfig.headers.push(headConfig)
      })
    }

    if (_.size(parameters)) {
      _.each(parameters, (paramConfig, index) => {
        if (typeof paramConfig === "undefined") {
          return
        }
        methodConfig.parameters.push(paramConfig)
        if (paramConfig.in) {
          if (typeof methodConfig.parameters[paramConfig.in + 'Params'] === "undefined") {
            throw new Error('Unsupported operand. Send issue please about error')
          }
          methodConfig.parameters[paramConfig.in + 'Params'].push(paramConfig)
        }
      })
    }

    return methodConfig
  }

  /**
   * Parse methods data
   */
  parse () {
    let _self = this

    _.each(this.methods, (config, uri) => {
      _self._iterateMethod(config, uri)
    })

    return this.parseMethods
  }
}

/**
 * @ignore module.exports
 * @ignore exports
 */
module.exports = MethodsParser