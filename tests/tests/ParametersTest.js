const ParametersParser = require('../../src/2.0/ParametersParser'),
      chai             = require('chai'),
      testData = {
        first: [
            {
                "name"            : "access_token",
                "in"              : "query",
                "description"     : "Access token from fb",
                "type"            : "string",
                "default"         : "EAACEdEose0cBAMYym5TupeZCCh0Qtlix0Efbf1e0HRZCozeodcESsFPFH7QoqTXyLvIV9QaZCNCTezptOZAlpxRzpu44HtjYu1eV2pxydPrxh8WRuGTlx5Me8lmmZCfEtqXXNtSZCCQkoh6I0HWZCdw2LR9vjIZBkIxFGuMkdK195ZAvQ7ZBd1WOvC25Jxfc2qX56YkI45DVJvKNnJcqZBABz7A",
                "camelCaseName"   : "accessToken",
                "isQueryParameter": true,
                "cardinality"     : "?"
            }
        ],
          second: [
              {
                  "name"            : "access_token",
                  "in"              : "query",
                  "description"     : "Access token from fb",
                  "type"            : "string",
                  "default"         : "EAACEdEose0cBAMYym5TupeZCCh0Qtlix0Efbf1e0HRZCozeodcESsFPFH7QoqTXyLvIV9QaZCNCTezptOZAlpxRzpu44HtjYu1eV2pxydPrxh8WRuGTlx5Me8lmmZCfEtqXXNtSZCCQkoh6I0HWZCdw2LR9vjIZBkIxFGuMkdK195ZAvQ7ZBd1WOvC25Jxfc2qX56YkI45DVJvKNnJcqZBABz7A",
                  "camelCaseName"   : "accessToken",
                  "isQueryParameter": true,
                  "enum"            : [
                      1,
                      2,
                      3
                  ],
                  "$ref"            : "#/definitions/User",
                  "cardinality"     : "?"
              }
          ]
      },
      _                = require('lodash');

chai.should()

describe('Test parameters', () => {
    it('Test parser', (done) => {
        let parser = new ParametersParser(testData.first),
            data   = parser.parse()

        parser.querys.should.be.a('array')
        parser.querys.should.length(1)
        parser.querys[0].should.be.a('object')

        data.should.be.a('array')
        data.should.length(1)
        data[0].should.be.a('object')
        data[0].isQueryParameter.should.equals(true)
        data[0].name.should.equals('access_token')
        data[0].camelCaseName.should.equals('accessToken')
        done();
    })

    it('Test enums parser', (done) => {
        let parser = new ParametersParser(testData.second),
            data   = parser.parse()
        data[0].ref.should.is.a('string')
        data[0].ref.should.equals('User')
        data[0].isQueryParameter.should.equals(true)

        parser.querys.should.be.a('array')
        parser.querys.should.length(1)
        parser.querys[0].should.be.a('object')

        parser.enums[0].should.be.a('object')
        parser.enums[0].name.should.equals('AccessToken Enum')
        parser.enums[0].values.should.be.a('array')
        parser.enums[0].values.should.length(3)
        parser.enums[0].values[0].should.equals(1)
        parser.enums[0].values[1].should.equals(2)
        parser.enums[0].values[2].should.equals(3)

        done();
    })

    it('Test skipped parameters', (done) => {
        _.each({'x-exclude-from-bindings': true, 'x-proxy-header': 'test'}, (value, header) => {
            let jsonData        = testData.second
            jsonData[0][header] = value
            let parser          = new ParametersParser(jsonData),
                data            = parser.parse()

            data.should.length(0)
        });
        done();
    })
})