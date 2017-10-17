const fs   = require('fs'),
      _    = require('lodash'),
      yaml = require('yaml')

/**
 * @abstract @class BaseGenerator
 *
 * Base generator class
 */
class BaseGenerator {
  /**
   * Base generator constructor
   */
  constructor () {
    if (new.target === BaseGenerator) {
      throw new TypeError('BaseGenerator is abstract class')
    }
  }

  /**
   * Check swagger file exists
   *
   * @param {boolean|undefined} checked First checked is not checked, add relative path
   * @param {String|undefined} propertyName Property name
   * @param {String|undefined} message Throw error message
   *
   * @throws Error if file not found
   *
   * @private
   */
  _checkFile (checked, propertyName, message) {
    message = message || 'Swagger json or yml file does not exists'
    propertyName = propertyName || 'filename'
    if (fs.existsSync(this[propertyName])) {
      return true
    }

    let filename = (process.cwd() + '/' + this[propertyName]).replace(/\/\//g, '/')

    if (!fs.existsSync(this[propertyName]) && (filename !== this[propertyName]) && checked !== true) {
      this[propertyName] = filename
      this._checkFile(true, propertyName, message)
    }

    throw new Error(message)
  }

  /**
   * Parse data from file
   *
   * @return {Swagger20}
   * @private
   */
  _parseData (content) {
    if (_.isString(content)) {
      this._content = content
    }

    let data = undefined
    try {
      data = JSON.parse(this._content)
    } catch (e) {
      try {
        data = yaml.tokenize(this._content)
      } catch (e) {
        throw new Error('Error parse data from file')
      }
    }

    return data
  }
}

/**
 * @ignore module
 * @ignore module.exports
 */
module.exports = BaseGenerator