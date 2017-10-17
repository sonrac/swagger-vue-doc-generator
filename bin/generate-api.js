const InitCli        = require('../src/InitCli'),
      cli            = new InitCli('0.1', 'Generate Vue.js client for swagger spec')

cli.generateApi()