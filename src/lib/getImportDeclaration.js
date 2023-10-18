module.exports = function (element, param, options) {
  const specifiers = []
  if (param) {
    if (param.type === 'ObjectPattern') {
      param.properties.forEach(property => {
        specifiers.push({
          type: 'ImportSpecifier',
          imported: { type: 'Identifier', name: property.key.name },
          local: { type: 'Identifier', name: property.value.name }
        })
      })
    } else {
      if (options?.dependenciesImportSingleComponentSet?.has(element)) {
        specifiers.push({
          type: 'ImportSpecifier',
          local: {
            type: 'Identifier',
            name: param
          },
          imported: {
            type: 'Identifier',
            name: param
          }
        })
      } else if (options?.dependenciesImportNamespaceSet?.has(element)) {
        specifiers.push({
          type: 'ImportNamespaceSpecifier',
          local: {
            type: 'Identifier',
            name: param
          }
        })
      } else {
        specifiers.push({
          type: 'ImportDefaultSpecifier',
          local: {
            type: 'Identifier',
            name: param
          }
        })
      }
    }
  }
  return {
    type: 'ImportDeclaration',
    specifiers: specifiers,
    source: {
      type: 'Literal',
      value: element
    }
  }
}
