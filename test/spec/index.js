import test from 'ava'
import fs from 'fs'
import path from 'path'
import normalize from 'normalize-newline'
import converter from '../../index'

function compare (result, output) {
  return normalize(result).replace(/\s+/g, '') === normalize(output).replace(/\s+/g, '')
}

function convert (dir, options) {
  const file1 = path.join(__dirname, '../fixture/', dir, '/input.js')
  const file2 = path.join(__dirname, '../fixture/', dir, '/output.js')
  const input = fs.readFileSync(file1, 'utf8')
  const expected = fs.readFileSync(file2, 'utf8')
  const result = converter(input, options)
  const isValid = compare(result, expected)
  if (!isValid) {
    console.log('-- INPUT --')
    console.log(input)
    console.log('-- EXPECTED --')
    console.log(expected)
    console.log('-- RESULT --')
    console.log(result)
  }
  return isValid
}

function convertWithMap (dir, options) {
  const file1 = path.join(__dirname, '../fixture/', dir, '/input.js')
  const file2 = path.join(__dirname, '../fixture/', dir, '/output.json')
  const input = fs.readFileSync(file1, 'utf8')
  const expected = JSON.parse(fs.readFileSync(file2, 'utf8'))
  const result = converter(input, options)
  const isValid = compare(result.source, expected.source) && compare(result.map, expected.map)
  if (!isValid) {
    console.log('-- INPUT --')
    console.log(input)
    console.log('-- EXPECTED --')
    console.log(expected)
    console.log('-- RESULT --')
    console.log(result)
  }
  return isValid
}

test('the converter should be available', assert => {
  assert.truthy(typeof converter === 'function')
})

test('it works for an anonymous module', assert => {
  assert.truthy(convert('amdjs-api/anonymous-module'))
})

test('it works for a dependency free module', assert => {
  assert.truthy(convert('amdjs-api/dependency-free-module'))
})

test('it works for simplified commonjs wrapping', assert => {
  assert.truthy(convert('amdjs-api/simplified-commonjs-wrapping'))
})

test('it works for simplified commonjs wrapping that returns a literal', assert => {
  assert.truthy(convert('amdjs-api/simplified-commonjs-wrapping-returns-literal'))
})

test('it works for named simplified commonjs wrapping', assert => {
  assert.truthy(convert('amdjs-api/named-simplified-commonjs-wrapping'))
})

test('it works for named simplified commonjs wrapping with sugar', assert => {
  assert.truthy(convert('amdjs-api/named-simplified-commonjs-wrapping-with-sugar'))
})

test('it works for named simplified commonjs wrapping with sugar', assert => {
  assert.truthy(convert('amdjs-api/named-simplified-commonjs-wrapping-with-sugar-second'))
})

test('it works for named module', assert => {
  assert.truthy(convert('amdjs-api/named-module'))
})

test('it works for named module with arrow function', assert => {
  assert.truthy(convert('amdjs-api/named-module-arrow-fn'))
})

test('it works for an anonymous module', assert => {
  assert.truthy(convert('rjs-examples/simple-define'))
})

test('it works for named dependencies', assert => {
  assert.truthy(convert('rjs-examples/function-wrapping'))
})

test('it converts empty array in define correctly', assert => {
  assert.truthy(convert('define/callback-empty-array'))
})

test('it converts empty array in define with array function correctly', assert => {
  assert.truthy(convert('define/arrow-function-callback-empty-array'))
})

test('it converts define with callback only correctly using the built in parser', assert => {
  assert.truthy(convert('define/callback-only'))
})

test('it converts empty define with arrow function correctly', assert => {
  assert.truthy(convert('define/arrow-function-callback-only'))
})

test('it converts define with deps correctly', assert => {
  assert.truthy(convert('define/arrow-function-callback-with-deps'))
})

test('it converts define with arrow function with immediate return', assert => {
  assert.truthy(convert('define/arrow-function-immediate-return'))
})

test('it converts define with arrow function with immediate function return', assert => {
  assert.truthy(convert('define/arrow-function-immediate-return-function'))
})

test('it converts define with deps with arrow function correctly', assert => {
  assert.truthy(convert('define/callback-with-deps'))
})

test('it converts modules wrapped with iife correctly', assert => {
  assert.truthy(convert('define/iife'))
})

test('it converts quotes correctly', assert => {
  assert.truthy(convert('define/quotes'))
})

test('it converts define with an object in callback only correctly', assert => {
  assert.truthy(convert('define/object-only'))
})

test("it shouldn't convert files with no define", assert => {
  assert.truthy(convert('define/no-define'))
})

test('it leaves single line comments if required', assert => {
  assert.truthy(convert('define/single-line-comments', { comments: true }))
})

test('it leaves multi line comments if required', assert => {
  assert.truthy(convert('define/multi-line-comments', { comments: true }))
})

test('it leaves single line comments in code if required', assert => {
  assert.truthy(convert('define/comments', { comments: true }))
})

test('it converts define with unused deps correctly', assert => {
  assert.truthy(convert('define/callback-with-mismatch-deps'))
})

test('it keeps dependencies with side effects', assert => {
  assert.truthy(convert('app/behavior_1'))
})

test('it keeps dependencies with side effects', assert => {
  assert.truthy(convert('app/behavior_2'))
})

test('it converts controllers correctly', assert => {
  assert.truthy(convert('app/controller_1'))
})

test('it keeps dependencies with side effects', assert => {
  assert.truthy(convert('app/controller_2'))
})

test('it works with const', assert => {
  assert.truthy(convert('app/controller_3'))
})

test('it works with let', assert => {
  assert.truthy(convert('app/controller_4'))
})

test('it keeps custom object assignments', assert => {
  assert.truthy(convert('app/enum_1'))
})

test('it leaves empty var statements', assert => {
  assert.truthy(convert('app/helper_1'))
})

test('it leaves empty var statements', assert => {
  assert.truthy(convert('app/helper_2'))
})

test('it works for named dependencies', assert => {
  assert.truthy(convert('app/helper_3'))
})

test('it leaves empty var statements', assert => {
  assert.truthy(convert('app/model_1'))
})

test('it handles returns of objects', assert => {
  assert.truthy(convert('app/model_2'))
})

test('it converts views correctly', assert => {
  assert.truthy(convert('app/view_1'))
})

test('it converts modules with functions after the return correctly', assert => {
  assert.truthy(convert('app/view_2'))
})

test('it converts modules with constructors assigned to variables correctly', assert => {
  assert.truthy(convert('app/view_3'))
})

test('it handles a var declaration which is moved to a separate line', assert => {
  assert.truthy(convert('app/view_4'))
})

test('it drops an empty define', assert => {
  assert.truthy(convert('app/view_spec_1'))
})

test('it converts subapps correctly', assert => {
  assert.truthy(convert('app/subapp_1'))
})

test('it converts subapp specs correctly', assert => {
  assert.truthy(convert('app/subapp_spec_1', { quotes: 'double' }))
})

test('it converts modules with one require sugar call expression correctly', assert => {
  assert.truthy(convert('app/module_1'))
})

test('it converts modules with multiple require sugar call expressions correctly', assert => {
  assert.truthy(convert('app/module_2'))
})

test('it converts module specs correctly', assert => {
  assert.truthy(convert('app/module_spec_1'))
})

test('it converts troopjs components correctly', assert => {
  assert.truthy(convert('web-examples/troopjs_component_1'))
})

test('it converts troopjs components correctly', assert => {
  assert.truthy(convert('web-examples/troopjs_component_2'))
})

test('it converts require sugar correctly', assert => {
  assert.truthy(convert('define/require-sugar'))
})

test('it converts require sugar with side effects correctly', assert => {
  assert.truthy(convert('define/require-sugar-with-side-effect'))
})

test('it converts require with property assignment correctly', assert => {
  assert.truthy(convert('define/require-sugar-with-property-assignment'))
})

test('it converts todomvc backbone requirejs example correctly', assert => {
  assert.truthy(convert('web-examples/todomvc_backbone_requirejs_1'))
})

test('it converts todomvc backbone requirejs example correctly', assert => {
  assert.truthy(convert('web-examples/todomvc_backbone_requirejs_2'))
})

test('it converts todomvc backbone requirejs example correctly', assert => {
  assert.truthy(convert('web-examples/todomvc_backbone_requirejs_3'))
})

test('it converts todomvc angular requirejs example correctly', assert => {
  assert.truthy(convert('web-examples/todomvc_angularjs_requirejs_1'))
})

test('it converts todomvc angular requirejs example correctly', assert => {
  assert.truthy(convert('web-examples/todomvc_angularjs_requirejs_2'))
})

test('it converts todomvc angular requirejs example correctly', assert => {
  assert.truthy(convert('web-examples/todomvc_angularjs_requirejs_3'))
})

test('it converts todomvc knockout requirejs example correctly', assert => {
  assert.truthy(convert('web-examples/todomvc_knockout_requirejs_1'))
})

test('it converts todomvc lavaca requirejs example correctly', assert => {
  assert.truthy(convert('web-examples/todomvc_lavaca_requirejs_1'))
})

test('it converts todomvc somajs requirejs example correctly', assert => {
  assert.truthy(convert('web-examples/todomvc_somajs_requirejs_1'))
})

test('it converts todomvc somajs requirejs example correctly', assert => {
  assert.truthy(convert('web-examples/todomvc_somajs_requirejs_2'))
})

test('it returns sourcemaps', assert => {
  assert.truthy(convertWithMap('source-maps/unnamed', { sourceMap: true }))
})

test('it returns sourcemaps with file reference', assert => {
  assert.truthy(convertWithMap('source-maps/named', { sourceMap: true, sourceFile: 'file1.js', sourceRoot: 'path/to/file' }))
})

test('it converts exports.default correctly', assert => {
  assert.truthy(convert('define/exports-default'))
})

test('it removes code that defines the __esModule property', assert => {
  assert.truthy(convert('define/object-define-property'))
})

test('it handles multiple exports assignments to undefined', assert => {
  assert.truthy(convert('define/exports-overrides'))
})

test('it handles anonymous imports', assert => {
  assert.truthy(convert('define/imports-anonymous'))
})

test('it handles destructuring', assert => {
  assert.truthy(convert('define/destructuring'))
})

test('it handles destructuring for multiple keys', assert => {
  assert.truthy(convert('define/destructuring-multiple-keys'))
})

test('it handles destructuring for named keys', assert => {
  assert.truthy(convert('define/destructuring-named-keys'))
})

test.skip('it handles multiple exports assignments', assert => {
  assert.truthy(convert('define/exports-multiple'))
})

test.skip('it handles exports with same names', assert => {
  assert.truthy(convert('define/exports-same'))
})
