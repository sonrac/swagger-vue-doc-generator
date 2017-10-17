const chai                  = require("chai"),
      MethodsParser         = require("../../src/2.0/MethodsParser"),
      SecuritySchemesParser = require("../../src/2.0/SecuritySchemesParser"),
      testData              = {
        empty: {
          '\/user\/auth\/facebook': {
            'post': {
              'tags'       : [
                'User auth'
              ],
              'summary'    : 'Register & login user from facebook',
              'description': 'Register & login user from facebook',
              'produces'   : [
                'application\/json'
              ],
            }
          }
        },
        parameters: {
          '\/user\/auth\/facebook': {
            'post': {
              "tags"       : [
                "User auth"
              ],
              "summary"    : "Register & login user from facebook",
              "description": "Register & login user from facebook",
              "produces"   : [
                "application\/json"
              ],
              "parameters" : [
                {
                  "name"       : "test",
                  "in"         : "query",
                  "description": "Test Parameter",
                  "type"       : "string",
                  "default"    : "test"
                }
              ],
            }
          }
        }
      }

chai.should()

describe('Test methods parser', () => {
  it('should test empty method', function () {
    const security      = new SecuritySchemesParser({}),
          methodsParser = new MethodsParser(testData.empty, security)

    let data = methodsParser.parse()

    data.should.be.a('array')
    data.should.length(1)
    data[0].path.should.be.equal('/user/auth/facebook')
    data[0].method.should.be.equal('POST')
    data[0].isPOST.should.be.true
    data[0].isGET.should.be.false
    data[0].isDeprecated.should.be.false
    data[0].summary.should.be.equal('Register & login user from facebook')
  })

  it('should test with empty responses', function () {
    const security      = new SecuritySchemesParser({}),
          methodsParser = new MethodsParser(testData.parameters, security)

    let data = methodsParser.parse()

    data.should.be.a('array')
    data.should.length(1)
    data[0].path.should.be.equal('/user/auth/facebook')
    data[0].method.should.be.equal('POST')
    data[0].isPOST.should.be.true
    data[0].isGET.should.be.false
    data[0].isDeprecated.should.be.false
    data[0].summary.should.be.equal('Register & login user from facebook')
    data[0].parameters.should.be.a('array')
    data[0].parameters.should.length(1)
    data[0].parameters.should.length(1)
  })

  it('should test with response', function () {

  })

  it('should test with response & security schema', function () {

  })
})