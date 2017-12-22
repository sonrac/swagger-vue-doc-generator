const fs            = require('fs'),
      swagger       = require('swagger-vue'),
      parse         = require('./../node_modules/swagger-vue/lib/parse'),
      codegen       = require('./2.0/generator-api/generator'),
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
    constructor(filename, options) {
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
    generate() {
        let data       = parse({
            swagger   : this.data,
            moduleName: this.options.moduleName,
            className : this.options.className
        })
        let codeResult = codegen(data)

        fs.writeFileSync(this.outFile, codeResult)
    }
}

/**
 *
 * @ignore module.exports
 * @ignore exports
 */

module.exports = GenerateApi