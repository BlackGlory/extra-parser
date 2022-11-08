const { pathsToModuleNameMapper } = require('ts-jest')
const { compilerOptions } = require('./tsconfig.base.json')

module.exports = {
  preset: 'ts-jest'
, testMatch: ['**/__tests__/**/?(*.)+(spec|test).[jt]s?(x)']
, testEnvironment: 'node'
, moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/'
  })
}
