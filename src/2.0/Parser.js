const SecuritySchemaParser = require('./SecuritySchemesParser'),
      ParserInterface      = require('../ParserInterface'),
      spawn                = require('child_process'),
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
 * @typedef {Object} Parser
 * @typedef {Swagger20} swagger
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

    if (data.swagger !== '2.0') {
      throw new Error('Unsupported swagger version by parser')
    }

    this.data           = data
    this.packageVersion = null
    this.getTagCommand  = optoins.getTagCommand || 'git tag -l'
    this.repoPath       = options.repo || __dirname
    this.packageName    = options.packageName || 'test-api'
    this.schemaParser   = new SecuritySchemaParser(this.data.definitions)
    this.methodsParser  = new MethodsParser(this.data.paths)

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
    this.genData.definitions      = this.data.definitions
    this.genData.definitionsGroup = []

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

    if (typeof this.genData.definitionsGroup[group] === 'undefined') {
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

  }
}

module.exports = Parser