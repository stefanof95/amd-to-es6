const test = require('ava')
const { convert } = require('../helper/spec')

test('(convert) it works for import all as *', assert => {
  assert.truthy(convert('amdjs-api/import-no-default-module', {
    dependenciesImportNamespaceSet: new Set([
      'alpha-dep'
    ])
  }))
})
