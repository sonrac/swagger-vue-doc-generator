const chai = require('chai'),
      _ = require('lodash'),
      SecuritySchemesParser = require('../../src/2.0/SecuritySchemesParser'),
      testingData = {
        params: {
          "APIKeyQueryParam": {
            "type": "apiKey",
            "in": "query",
            "name": "access_token"
          },
        },
        headers: {
          "APIKeyHeader": {
            "type": "apiKey",
            "in": "header",
            "name": "Authorization"
          },
        }
      }

chai.should()

describe('Security schemes parser test', function () {
  it('should test query params parse', function () {

    let parser = new SecuritySchemesParser(testingData.params),
        data = parser.parse()

    parser.headers.should.be.a('object')
    parser.parameters.should.be.a('object')
    parser.parameters.APIKeyQueryParam.should.be.a('array')
    parser.parameters.APIKeyQueryParam.should.length(1)
    parser.parameters.APIKeyQueryParam[0].camelCaseName.should.equals('accessToken')
    parser.parameters.APIKeyQueryParam[0].name.should.equals('access_token')
    parser.parameters.APIKeyQueryParam[0].isQueryParameter.should.equals(true)
  })
  it('should test headers params parse', function () {

    let parser = new SecuritySchemesParser(testingData.headers),
        data = parser.parse()

    parser.parameters.should.be.a('object')
    parser.headers.should.be.a('object')
    parser.headers.APIKeyHeader.should.be.a('array')
    parser.headers.APIKeyHeader.should.length(1)
    parser.headers.APIKeyHeader[0].camelCaseName.should.equals('authorization')
    parser.headers.APIKeyHeader[0].name.should.equals('Authorization')
    parser.headers.APIKeyHeader[0].isHeaderParameter.should.equals(true)
  })

  it('should test get parameters by security configuration', function () {
    let parser = new SecuritySchemesParser(_.extend(testingData.headers, testingData.params))
        data = parser.parse()

    parser.parameters.should.be.a('object')
    parser.headers.should.be.a('object')
    parser.headers.APIKeyHeader.should.be.a('array')
    parser.headers.APIKeyHeader.should.length(1)
    parser.headers.APIKeyHeader[0].camelCaseName.should.equals('authorization')
    parser.headers.APIKeyHeader[0].name.should.equals('Authorization')
    parser.headers.APIKeyHeader[0].isHeaderParameter.should.equals(true)

    parser.headers.should.be.a('object')
    parser.parameters.should.be.a('object')
    parser.parameters.APIKeyQueryParam.should.be.a('array')
    parser.parameters.APIKeyQueryParam.should.length(1)
    parser.parameters.APIKeyQueryParam[0].camelCaseName.should.equals('accessToken')
    parser.parameters.APIKeyQueryParam[0].name.should.equals('access_token')
    parser.parameters.APIKeyQueryParam[0].isQueryParameter.should.equals(true)

    headers = parser.getHeadersForRequest({'test': []})
    headers.should.be.a('array')
    headers.should.length(0)

    headers = parser.getHeadersForRequest({'APIKeyHeader': []})
    headers.should.be.a('array')
    headers.should.length(1)
    headers[0].camelCaseName.should.equals('authorization')

    parameters = parser.getParametersForRequest({'test': []})
    parameters.should.be.a('array')
    parameters.should.length(0)

    parameters = parser.getParametersForRequest({'APIKeyQueryParam': []})
    parameters.should.be.a('array')
    parameters.should.length(1)
    parameters[0].camelCaseName.should.equals('accessToken')

  })
})