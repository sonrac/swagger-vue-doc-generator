const SecuritySchemaParser = require('./SecuritySchemesParser'),
      ParserInterface      = require('../ParserInterface'),
      spawn                = require('child_process'),
      _                    = require('lodash'),
      MethodsParser        = require('./MethodsParser')

/**
 * @ignore module.exports
 * @ignore exports
 * @ignore spawn
 */

/**
 * @class Parser
 * Parser for swagger
 *
 * @property {Swagger20} data Swagger data
 * @property {String|undefined} packageVersion Package version. If define command for get tags list not will be running
 * @property {String} getTagCommand Command for get tag lists. If <code>packageVersion</code> is empty
 * auto detect tag list and get last tag for detect package version
 * @property {String} packageName Package name
 * @property {String} className Class name
 * @property {String} moduleName Module name
 * @property {SecuritySchemaParser} schemeParser Security scheme parser
 * @property {MethodsParser} methodsParser Methods parser
 */
class Parser extends ParserInterface {

  /**
   * Constructor
   *
   * @param {Swagger20} data Swagger api data
   * @param {ParserOptions} options Parser options
   */
  constructor (data, options) {
    super()

    options = options || {}

    if (data.swagger !== '2.0') {
      throw new Error('Unsupported swagger version by parser')
    }

    this.data                   = data
    this.packageVersion         = options.packageVersion
    this.getTagCommand          = options.getTagCommand || 'git tag -l'
    this.repoPath               = options.repo || __dirname
    this.packageName            = options.packageName || 'test-api'
    this.schemaParser           = new SecuritySchemaParser(this.data.definitions)
    this.className              = options.className
    this.moduleName             = options.moduleName
    options.methodsParserConfig = options.methodsParserConfig || {
      parameterParserConfig: {
        addEnumDescription: true
      },
      className            : this.className,
      moduleName           : this.moduleName,
      packageName          : this.packageName
    }
    this.methodsParser          = new MethodsParser(this.data.paths, this.schemaParser, options.methodsParserConfig)

    this._initData(options)
    this._prepareDefinitions()
  }

  /**
   * Get package version
   *
   * @return {null|string}
   * @private
   */
  _getPackageVersion () {
    if (this.packageVersion) {
      return this.packageVersion
    }

    let gitTags = spawn.execSync('cd ' + this.repoPath + '; ' + this.getTagCommand).toString().split('\n').reverse()
    gitTags     = gitTags.slice(1, gitTags.length)

    if (!gitTags.length) {
      gitTags.push('dev-master@dev')
    }

    this.packageVersion = gitTags[0]

    return this.packageVersion
  }

  /**
   * Init base swagger data
   *
   * @param {ParserOptions} options Parser options
   * @private
   */
  _initData (options) {
    this.swagger                = {}
    this.swagger.title          = this.data.title
    this.swagger.description    = this.data.info.description
    this.swagger.apiVersion     = this.data.info.version
    this.swagger.packageVersion = this._getPackageVersion()
    this.swagger.isSecure       = typeof this.data.securityDefinitions !== 'undefined'
    this.swagger.className      = options.className
    this.swagger.moduleName     = options.moduleName
  }

  /**
   * Prepare definitions (project models)
   *
   * @private
   */
  _prepareDefinitions () {
    this.swagger.definitions      = this.data.definitions
    this.swagger.definitionsGroup = []

    let _self = this

    _.each(this.swagger.definitions, (definition, name) => {
      _self._addDefinitionToGroup(name, definition)
    })
  }

  /**
   * Generate definitions group
   *
   * @param {String} group Group name
   * @param {Object} definition Swagger definition
   * @private
   */
  _addDefinitionToGroup (group, definition) {
    if (typeof definition !== 'object') {
      return
    }

    if (typeof this.swagger.definitionsGroup[group] === 'undefined') {
      this.swagger.definitionsGroup[group] = []
    }

    this.swagger.definitionsGroup[group].push(definition)
  }

  /**
   * Parse data and return prepared data for templates
   *
   * @return {Swagger20}
   */
  parse () {
    this.swagger.security  = this.schemaParser.parse()
    this.swagger.methods   = this.methodsParser.parse()
    this.swagger.tagsGroup = this.methodsParser.methodsGroup

    return this.swagger
  }
}

module.exports = Parser