const _               = require('lodash'),
      ParserInterface = require('../ParserInterface')
/**
 * @ignore module.exports
 * @ignore exports
 * @ignore _
 */

/**
 * Parameters parser
 * @class ParametersParser
 *
 * @property {Array.<Swagger20ParameterObject>|Array.<Swagger20HeaderObject>} originalParameter origin parameter from constructor
 * @property {Array.<Swagger20ParameterObject>} parameters Parsed parameters
 * @property {Array.<Swagger20HeaderObject>} headers Parsed headers
 * @property {Array.<Swagger20ParameterObject>} querys Queries parsed parameters
 * @property {Array.<Swagger20ParameterObject>} formDatas Form data parser object
 * @property {Array.<Swagger20ParameterObject>} bodys Bodies parser parameters
 * @property {Array.<Swagger20ParameterObject>} enums Enums definition
 */
class ParametersParser extends ParserInterface {

  /**
   * Constructor
   *
   * @param {Object} parameters
   * @param {ParameterParserOptionsObject|undefined} options
   */
  constructor (parameters, options) {
    options = options || {}
    super()

    this.addEnumDescription = options.addEnumDescription || true

    this.originParameter = parameters
    this.parameters      = []
    this.headers         = []
    this.paths           = []
    this.querys          = []
    this.formDatas       = []
    this.bodys           = []
    this.enums           = []
    this._destroyParam()
  }

  /**
   * Destroy current parameter values
   *
   * @private
   */
  _destroyParam () {
    this._currentParam         = undefined
    this._currentOriginalParam = undefined
  }

  /**
   * Check ignore parameters
   * Ignore parameters which contain the x-exclude-from-bindings extension
   * Ignore headers which are injected by proxies & app servers
   * eg: https://cloud.google.com/appengine/docs/go/requests#Go_Request_headers
   *
   * @return {boolean}
   * @private
   */
  _checkProxyHeader () {
    return (this._currentOriginalParam['x-exclude-from-bindings'] === true) ||
      (typeof this._currentOriginalParam['x-proxy-header'] !== 'undefined')
  }

  /**
   * Load references name from property
   *
   * @private
   */
  _loadReference () {
    if (_.isString(this._currentOriginalParam.$ref)) {
      let segments           = this._currentOriginalParam.$ref.split('/')
      this._currentParam.ref = segments[segments.length - 1]
    }
  }

  /**
   * Parse enum data from parameter
   * If
   *
   * @private
   */
  _parseEnum () {
    if (this._currentOriginalParam.enum) {
      if (this._currentOriginalParam.length === 1) {
        this._currentParam.isSingleton = true
        this._currentParam.singleton   = this._currentOriginalParam.enum[0]
      } else {
        let _enum = {
          name  : _.upperFirst(_.camelCase(this._currentOriginalParam.name)) + ' Enum',
          camelCaseName: _.camelCase(this._currentOriginalParam.name),
          values: this._currentOriginalParam.enum,
        }

        if (this.addEnumDescription) {
          _enum.description = this._currentOriginalParam.description
        }

        this.enums.push(_enum)
      }
    }
  }

  /**
   * Parse parameter type and set property in <code>true</code>
   * One of is [isBodyParameter, isPathParameter, isQueryParameter, isHeaderParameter, isFormDataParameter]
   *
   * @private
   */
  _parseParameterType () {
    if (this._currentParam.in) {
      this._currentParam['is' + _.upperFirst(this._currentParam.in) + 'Parameter'] = true
    }

    let pattern

    if (this._currentParam.isQueryParameter && (pattern = this._currentParam['x-name-pattern'])) {
      this._currentParam.isPatternType = true
      this._currentParam.pattern       = pattern
    }

    this._currentParam.cardinality = this._currentParam.required ? '' : '?'
  }

  /**
   * Parse parameters
   *
   * @return {Array.<Swagger20ParameterObject>}
   */
  parse () {
    let _self = this
    _.each(this.originParameter, (parameter, name) => {
      _self._currentOriginalParam = parameter || {}
      _self._currentParam         = parameter

      if (_self._checkProxyHeader()) {
        return
      }

      _self._loadReference()
      _self._parseEnum()
      _self._parseParameterType()

      _self._currentParam.camelCaseName = _.camelCase(parameter.name)

      if (_self._currentParam.in) {
        _self[_self._currentParam.in + 's'].push(_self._currentParam)
      }

      _self.parameters.push(_self._currentParam)
    })

    this._destroyParam()

    return this.parameters
  }
}

module.exports = ParametersParser