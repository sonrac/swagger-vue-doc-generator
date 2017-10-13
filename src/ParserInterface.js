/**
 * @ignore module.exports
 * @ignore exports
 */

/**
 * Parser interface
 * Declare parse method must be defined in class
 */
class ParserInterface {
  /**
   * ParserInterface constructor
   * @throws TypeError When create new instance
   * @throws Error When parse method does not define
   */
  constructor () {
    if (new.target === ParserInterface) {
      throw new TypeError('ParserInterface is interface')
    }
    if (typeof this.parse === 'undefined' || typeof this.parse !== 'function') {
      throw new Error('Parse method must be defined')
    }
  }
}

module.exports = ParserInterface