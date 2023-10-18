const test = require('ava')
const { convert } = require('../helper/spec')

test('(convert) it works for import all as *', assert => {
  assert.truthy(convert('amdjs-api/import-no-default-module', {
    dependenciesImportNamespaceSet: new Set([
      'alpha-dep'
    ])
  }))
})

test('(convert) it works for import as single component', assert => {
  assert.truthy(convert('amdjs-api/import-single-component-module', {
    dependenciesImportSingleComponentSet: new Set([
      'alpha-dep'
    ])
  }))
})
