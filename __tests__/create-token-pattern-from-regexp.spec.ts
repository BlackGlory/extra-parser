import { createTokenPatternFromRegExp } from '@src/create-token-pattern-from-regexp'
import { isFunction } from '@blackglory/prelude'

describe('createTokenPatternFromRegExp', () => {
  test('single character match', () => {
    const tokenType = 'Alphabet'
    const regExp = /[a-bA-B]/

    const result = createTokenPatternFromRegExp(tokenType, regExp)

    expect(isFunction(result)).toBe(true)
    expect(result('a')).toStrictEqual({
      consumed: 1
    , token: {
        type: tokenType
      , value: 'a'
      }
    })
    expect(result('ab')).toStrictEqual({
      consumed: 1
    , token: {
        type: tokenType
      , value: 'a'
      }
    })
    expect(result('1')).toBeFalsy()
    expect(result('12')).toBeFalsy()
    expect(result(' a')).toBeFalsy()
  })

  test('multiple character match', () => {
    const tokenType = 'Alphabet'
    const regExp = /[a-bA-B]+/

    const result = createTokenPatternFromRegExp(tokenType, regExp)

    expect(isFunction(result)).toBe(true)
    expect(result('a')).toStrictEqual({
      consumed: 1
    , token: {
        type: tokenType
      , value: 'a'
      }
    })
    expect(result('ab')).toStrictEqual({
      consumed: 2
    , token: {
        type: tokenType
      , value: 'ab'
      }
    })
    expect(result('1')).toBeFalsy()
    expect(result('12')).toBeFalsy()
    expect(result(' a')).toBeFalsy()
  })
})
