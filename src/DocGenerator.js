const _             = require('lodash'),
      fs            = require('fs'),
      Handlebars    = require('handlebars'),
      HTML          = 'HTML',
      path          = require('path'),
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
    this.templatePath      = options.templatePath || (path.join(__dirname, this.version, 'templates', this.type.toLowerCase()))
    this.data              = options.swagger
    this.additionalLayouts = options.additionalLayouts || {}
    this.parserOptions     = options.parserOptions
    this.destination       = options.destination || path.join(__dirname, '/../dist')
    this._checkFile(false, 'destination', 'Destination folder not found')
    this.additionalHelpers = options.additionalHelpers || {}
    this.filename          = options.inputJson
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

    // fs.writeFileSync(path.join(process.cwd(), 'api-data.json'), JSON.stringify(this.swaggerData))

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

    this._generateMethods()
    this._generateModels()
  }

  _generateMain () {
    let template = fs.readFileSync(path.join(this.templatePath, 'md.hbs')).toString(),
        content  = Handlebars.compile(template)(this.swaggerData)

    this._writeContent(content, this._getMainFileName())
  }

  _getMainFileName () {
    return this.type === DocGenerator.HTML ? 'index.html' : 'README.MD'
  }

  _getExt () {
    return this.type === DocGenerator.HTML ? 'html' : 'md'
  }

  _writeContent (content, fileName) {
    fs.writeFileSync(path.join(this.destination, fileName), content)
  }

  _generateModels () {
    let _self = this,
        template = fs.readFileSync(path.join(this.templatePath, 'model.hbs')).toString(),
        content = ''

    _.each(this.swaggerData.definitions, (config, name) => {
      config.modelName = name
      content = Handlebars.compile(template)(config)
      _self._writeContent(content, path.join(this.modelPath, name + '.' + _self._getExt()))
    })
  }

  _generateMethods () {
    let template = fs.readFileSync(path.join(this.templatePath, 'method.hbs')).toString(),
        responseTemplate = fs.readFileSync(path.join(this.templatePath, 'response.hbs')).toString(),
        content  = '',
        _self    = this
    Handlebars.registerPartial('response', responseTemplate)
    _.each(this.swaggerData.methods, (config, index) => {
      content = Handlebars.compile(template)(config)
      _self._writeContent(content, path.join(_self.docsPath, config.methodName + '.' + _self._getExt()))
    })
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
    let fileContent = fs.readFileSync(path.join(this.templatePath, filename + '.hbs')).toString()

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

        return options.inverse(this)
      }
    })

    Handlebars.registerHelper('breaklines', function(text) {
      text = Handlebars.Utils.escapeExpression(text);
      text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
      return new Handlebars.SafeString(text);
    });

    Handlebars.registerHelper('requireFilter', function (require) {
      return require ? 'required' : 'optional'
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