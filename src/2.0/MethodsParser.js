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
 * @property {Array.<String>.<MethodConfigObject>} methodsGroup Grouping parsed methods
 * @property {String} packageName Package name
 * @property {String} className Class name
 * @property {String} moduleName Module name
 */
class MethodsParser extends ParserInterface {
  constructor (methods, securityParser, definitions, options) {
    super()

    options = options || {}

    this.parameterParserConfig = options.parameterParserConfig
    // this.respParserConfig = options.respParserConfig

    this.moduleName  = options.moduleName
    this.className   = options.className
    this.packageName = options.packageName

    this.securityParser = securityParser
    this.parseMethods   = []
    this.definitions    = definitions
    this.methods        = methods
    this.modelPath      = options.modelPath
    this.docsPath       = options.docsPath
    this.methodsGroup   = {}
  }

  _iterateMethod (config, uri) {
    let _self   = this
    _.each(config, (methodConfig, method) => {
      method         = _.upperCase(method)
      let nextMethod = {
        path          : uri,
        method        : method,
        methodName    : methodConfig.operationId ? MethodsParser._normalizeMethodName(methodConfig.operationId) : MethodsParser._getPathToMethodName(config, method, uri),
        tags          : methodConfig.tags,
        summary       : methodConfig.summary,
        description   : methodConfig.description,
        externalDocs  : methodConfig.externalDocs,
        operationId   : methodConfig.operationId,
        produces      : methodConfig.produces,
        consumes      : methodConfig.consumes,
        schemes       : methodConfig.schemes,
        isDeprecated  : methodConfig.deprecated || false,
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
        _self.respParser     = new ResponseParser(methodConfig.responses)
        nextMethod.responses = _self.respParser.parse()
      }

      nextMethod             = _self._addSecurityParameters(nextMethod)
      nextMethod.packageName = _self.packageName
      nextMethod.className   = _self.className
      nextMethod.moduleName  = _self.moduleName
      nextMethod.docsPath    = _self.docsPath
      nextMethod.modelPath   = _self.modelPath
      nextMethod.definitions = _self.definitions

      if (nextMethod.tags) {
        let tags = nextMethod.tags
        for (let i = 0; i < tags.length; i++) {
          if (typeof this.methodsGroup[tags[i]] === 'undefined') {
            this.methodsGroup[tags[i]] = []
          }

          this.methodsGroup[tags[i]].push(nextMethod)
        }
      }

      _self.parseMethods.push(nextMethod)

    })
  }

  /**
   * Normalize method name
   *
   * @return {string}
   *
   * @private
   */
  static _normalizeMethodName (id) {
    /* eslint-disable */
    return id.replace(/\.|\-|\{|\}/g, '_').split(' ').join('_')
    /* eslint-enable */
  }

  /**
   *
   * @param {Object} opts
   * @param m
   * @param path
   * @return {*}
   * @private
   */
  static _getPathToMethodName (opts, m, path) {
    if (path === '/' || path === '') {
      return m
    }

    // clean url path for requests ending with '/'
    let cleanPath = path.replace(/\/$/, '')

    let segments = cleanPath.split('/').slice(1)
    segments     = _.transform(segments, function (result, segment) {
      if (segment[0] === '{' && segment[segment.length - 1] === '}') {
        segment = 'by' + segment[1].toUpperCase() + segment.substring(2, segment.length - 1)
      }
      result.push(segment)
    })
    let result   = _.camelCase(segments.join('-'))
    return m.toLowerCase() + result[0].toUpperCase() + result.substring(1)
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
      _.each(headers, (headConfig) => {
        if (typeof headConfig === 'undefined') {
          return
        }
        methodConfig.headers.push(headConfig)
      })
    }

    if (_.size(parameters)) {
      _.each(parameters, (paramConfig, index) => {
        if (typeof paramConfig === 'undefined') {
          return
        }
        methodConfig.parameters.push(paramConfig)
        if (paramConfig.in) {
          if (typeof methodConfig.parameters[paramConfig.in + 'Params'] === 'undefined') {
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
   *
   * @return {Array.<MethodConfigObject>}
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