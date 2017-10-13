const _       = require('lodash'),
      fs      = require('fs'),
      swagger = require('swagger-vue'),
      yaml    = require('yaml')

/**
 * @class GenerateApi
 * Generate api with VUE generator
 *
 * @property {string} filename Source swagger filename
 * @property {GeneratorOptions} options Generator options
 * @property {Swagger20} data Swagger data
 */
class GenerateApi {
  /**
   *
   * @param {String} filename
   * @param {GeneratorOptions|undefined} options
   */
  constructor (filename, options) {
    this.filename = filename

    this.options  = options || {}
    this.outFile  = options.outFile || __dirname + '/../dist/'
    this._content = this._checkFile()
    this.data     = this._parseData()
  }

  /**
   * Generate vue.js client
   */
  generate () {
    console.log(this.data)
    let data = swagger({
      swagger   : this.data,
      moduleName: this.options.moduleName,
      className : this.options.className
    })

    console.log(this.outFile, data)

    fs.writeFileSync(this.outFile, data)
  }

  /**
   * Check swagger file exists
   *
   * @param {boolean|undefined} checked
   *
   * @private
   */
  _checkFile (checked) {

    if (fs.existsSync(this.filename)) {
      return fs.readFileSync(this.filename).toString()
    }

    let filename = __dirname + this.filename
    if (!fs.existsSync(this.filename) && (filename !== this.filename) && !checked) {
      this.filename = filename
      this._checkFile(true)
    }

    throw new Error('Swagger json or yml file does not exists')
  }

  /**
   * Parse data from file
   *
   * @return {Swagger20}
   * @private
   */
  _parseData () {
    let data = undefined
    try {
      data = JSON.parse(this._content)
    } catch (e) {
      console.log(e)
      try {
        data = yaml.tokenize(this._content)
      } catch (e) {
        throw new Error('Error parse data from file')
      }
    }
    console.log(data)

    return data
  }
}

/**
 *
 * @ignore module.exports
 * @ignore exports
 */

module.exports = GenerateApi