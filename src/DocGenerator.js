const _             = require('lodash'),
      fs            = require('fs'),
      Handlebars    = require('handlebars'),
      HTML          = 'HTML',
      BaseGenerator = require('./BaseGenerator'),
      SwaggerParser = require('./SwaggerParser'),
      Markdown      = 'Markdown'

/**
 * @class DocGenerator
 * Documentation generator (html or MarkDown)
 *
 * @property {String} type Output documentation type
 * @property {String} version Swagger version
 * @property {String} destination Output destination
 * @property {String} templatePath Path to template
 * @property {ParserOptions} parserOptions Swagger parser options
 * @property {Function} generatorCallback Custom generator callback
 * @property {Object.<Object>} additionalLayouts Additional layouts for Handlebars in format <code><file-name-or-relative-path>: <template-name></code>
 * @property {Object.<Object>} additionalHelpers Additional helpers for Handlebars in format <code><helper-name>: function (Handlebars) {
 *  // Some helper detail
 * }</code>
 * @property {String} moduleName Module name
 * @property {String} className Class name
 * @property {String} destination Output doc destination
 * @property {String} docsPath Method definitions path
 * @property {String} modelPath Model path
 */
class DocGenerator extends BaseGenerator {

  /**
   * DocGenerator constructor
   *
   * @param {String} type Documentation type (html or Markdown). One of (Markdown or HTML)
   * @param {DocGeneratorOptionsObject} options Swagger documentation generator options
   * @param {String} version Swagger version (default is 2.0)
   */
  constructor (type, options, version) {
    super()

    version                = version || '2.0'
    options                = options || {}
    this.type              = type
    this.version           = version
    this.generatorCallback = options.generatorCallback
    this.templatePath      = (options.templatePath || (__dirname + '/' + this.version +
      '/templates/' + this.type.toLowerCase() + '/')).replace(/\/\//g, '/')
    this.data              = options.swagger
    this.additionalLayouts = options.additionalLayouts || {}
    this.parserOptions     = options.parserOptions
    this.destination       = options.destination || __dirname + '/../dist'
    this._checkFile(false, 'destination', 'Destination folder not found')
    this.additionalHelpers = options.additionalHelpers || {}
    this.filename          = options.outFile
    this.moduleName        = options.moduleName
    this.className         = options.className
    this.modelPath         = options.modelPath
    this.docsPath          = options.docsPath

    this._checkFile()
    this._content = fs.readFileSync(this.filename).toString()

    this.data = this._parseData()

    this._checkFile(false, 'templatePath', 'Template path does not exists')

    let parser                  = new SwaggerParser(this.version, this.data, this.parserOptions || {
      className     : this.className,
      moduleName    : this.moduleName,
      packageName   : options.packageName,
      packageVersion: options.packageVersion,
      modelPath     : this.modelPath,
      docsPath      : this.docsPath
    })
    this.swaggerData            = parser.parse()
    this.swaggerData.moduleName = this.moduleName
    this.swaggerData.className  = this.className

    if (!_.size(this.data)) {
      throw new Error('Swagger data is empty')
    }
  }

  /**
   * @const {String} HTML
   *
   * @return {string}
   */
  static get HTML () {
    return HTML
  }

  /**
   * @const {String} Markdown
   *
   * @return {string}
   */
  static get Markdown () {
    return Markdown
  }

  /**
   * Generate documentation
   */
  generate () {
    if (typeof this.generatorCallback === 'function') {
      return this.generatorCallback.apply(this, [this.data])
    }

    this._prepareHandlebars()

    this._generateMain()
  }

  _generateMain () {
    let template = fs.readFileSync(this.templatePath + 'md.hbs').toString(),
        content  = Handlebars.compile(template)(this.swaggerData)

    this._writeContent(content, this._getMainFileName())

    this._generateMethods()
    this._generateModels()
  }

  _getMainFileName () {
    return this.type === DocGenerator.HTML ? 'index.html' : 'README.MD'
  }

  _writeContent (content, fileName) {
    fs.writeFileSync((this.destination + '/' + fileName).replace(/\/\//g, '/'), content)
  }

  _generateModels () {

  }

  _generateMethods () {

  }

  _prepareHandlebars () {
    this._registerPartial('methodList')
    this._registerPartial('securityDefinitions')

    let _self = this

    _.each(this.additionalLayouts, (file, name) => {
      _self._registerPartial(file, name)
    })

    this._registerHelpers()
  }

  _registerPartial (filename, templateName) {
    templateName = templateName || filename
    if (_.isNumber(templateName)) {
      templateName = filename.split('/')

      let clearTemplate = ''

      for (let i = 0; i < templateName.length; i++) {
        if ((clearTemplate = _.trim(templateName[i])).length) {
          templateName = clearTemplate
        }
      }
    }
    let fileContent = fs.readFileSync(this.templatePath + filename + '.hbs').toString()

    Handlebars.registerPartial(templateName, fileContent)
  }

  _registerHelpers () {

    Handlebars.registerHelper('ifCond', function (v1, v2, options) {
      if (v1 === v2) {
        return options.fn(this)
      }
      return options.inverse(this)
    })

    Handlebars.registerHelper('ifHas', function (object, paramName, value, options) {
      for (let i in object) {
        if (!object.hasOwnProperty(i)) {
          continue
        }

        let has = object[i][paramName] === value

        if (has) {
          return options.fn(this)
        }
      }
    })

    Handlebars.registerHelper('ifDefine', function (object, paramName, options) {
      if (typeof object[paramName] !== 'undefined') {
        return options.fn(this)
      }

      return options.inverse(this)
    })

    Handlebars.registerHelper('ifLength', function (object, options) {
      if (typeof object === 'undefined') {
        return options.inverse(this)
      }
      return object.length ? options.fn(this) : options.inverse(this)
    })

    _.each(this.additionalHelpers, (cb, name) => {
      if (typeof cb === 'function') {
        cb(name, Handlebars)
      }
    })
  }
}

/**
 * @ignore module
 * @ignore module.exports
 */
module.exports = DocGenerator