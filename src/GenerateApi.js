const fs            = require('fs'),
      swagger       = require('swagger-vue'),
      BaseGenerator = require('./BaseGenerator')

/**
 * @class GenerateApi
 * Generate api with VUE generator
 *
 * @property {string} filename Source swagger filename
 * @property {GeneratorOptions} options Generator options
 * @property {Swagger20} data Swagger data
 */
class GenerateApi extends BaseGenerator {
  /**
   *
   * @param {String} filename
   * @param {GeneratorOptions|undefined} options
   */
  constructor (filename, options) {
    super()

    this.filename = filename

    this.options = options || {}
    this.outFile = options.outFile || __dirname + '/../dist/'
    this._checkFile()
    this._content       = fs.readFileSync(this.filename)
    this.data           = this._parseData()
    this.data.modelPath = options.modelPath || 'docs/models'
    this.data.docPath   = options.docsPath || 'docs'
  }

  /**
   * Generate vue.js client
   */
  generate () {
    let data = swagger({
      swagger   : this.data,
      moduleName: this.options.moduleName,
      className : this.options.className
    })

    fs.writeFileSync(this.outFile, data)
  }
}

/**
 *
 * @ignore module.exports
 * @ignore exports
 */

module.exports = GenerateApi