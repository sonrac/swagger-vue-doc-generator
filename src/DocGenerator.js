const _          = require('lodash'),
      fs         = require('fs'),
      Handlebars = require('handlebars'),
      HTML       = 'HTML',
      Markdown   = 'Markdown'

/**
 * @class DocGenerator
 * Documentation generator (html or MarkDown)
 *
 * @property {String} type Output documentation type
 * @property {String} version Swagger version
 * @property {String} templatePath Path to template
 * @property {Function} generatorCallback Custom generator callback
 * @property {Object.<Object>} additionalLayouts Additional layouts for Handlebars in format <code><file-name-or-relative-path>: <template-name></code>
 * @property {Object.<Object>} additionalHelpers Additional helpers for Handlebars in format <code><helper-name>: function (Handlebars) {
 *  // Some helper detail
 * }</code>
 */
class DocGenerator {

  /**
   * DocGenerator constructor
   *
   * @param {String} type Documentation type (html or Markdown). One of (Markdown or HTML)
   * @param {String} version Swagger version (default is 2.0)
   * @param {DocGeneratorOptionsObject} options Swagger documentation generator options
   */
  constructor (type, options, version) {
    version                = version || '2.0'
    options                = options || {}
    this.type              = type
    this.version           = version
    this.generatorCallback = options.generatorCallback
    this.templatePath      = (options.templatePath || (__dirname + '/' + this.version +
      '/templates/' + this.type.toLowerCase() + '/')).replace(/\/\//g, '/')
    this.data              = options.data
    this.additionalLayouts = options.additionalLayouts || {}
    this.additionalHelpers = options.additionalHelpers || {}

    if (!fs.existsSync(this.templatePath)) {
      throw new Error('Template path does not exists')
    }

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

  _registerPartial(filename, templateName) {
    if (_.isNumber(templateName)) {
      templateName = filename.split('/')

      let clearTemplate = ''

      for (let i = 0; i < templateName.length; i++) {
        if ((clearTemplate = _.trim(templateName[i])).length) {
          templateName = clearTemplate
        }
      }
    }
    let fileContent = fs.readFileSync(this.templatePath + filename)

    Handlebars.registerPartial(templateName, fileContent)
  }

  _registerHelpers () {

    Handlebars.registerHelper('ifHas', function (object, paramName, value, options) {
      let has = false
      for (let i in object) {
        if (!object.hasOwnProperty(i)) {
          continue
        }

        has = has || object[i][paramName] === value
      }

      return has ? options.fn(this) : options.inverse(this)
    });

    Handlebars.registerHelper('ifLength', function (object, options) {
      if (typeof object === "undefined") {
        return options.inverse(this)
      }
      return object.length ? options.fn(this) : options.inverse(this)
    });

    _.each(this.additionalHelpers, (cb, name) => {
      if (typeof cb === 'function') {
        cb(name, Handlebars)
      }
    })
  }
}