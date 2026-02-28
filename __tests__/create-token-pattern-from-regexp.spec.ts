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
        tokenType: tokenType
      , value: 'a'
      }
    })
    expect(result('ab')).toStrictEqual({
      consumed: 1
    , token: {
        tokenType: tokenType
      , value: 'a'
      }
    })
    expect(result('1')).toBeFalsy()
    expect(result('12')).toBeFalsy()
    expect(result(' a')).toBeFalsy()
    expect(result('')).toBeFalsy()
  })

  test('multiple character match', () => {
    const tokenType = 'Alphabet'
    const regExp = /[a-bA-B]+/

    const result = createTokenPatternFromRegExp(tokenType, regExp)

    expect(isFunction(result)).toBe(true)
    expect(result('a')).toStrictEqual({
      consumed: 1
    , token: {
        tokenType: tokenType
      , value: 'a'
      }
    })
    expect(result('ab')).toStrictEqual({
      consumed: 2
    , token: {
        tokenType: tokenType
      , value: 'ab'
      }
    })
    expect(result('1')).toBeFalsy()
    expect(result('12')).toBeFalsy()
    expect(result(' a')).toBeFalsy()
    expect(result('')).toBeFalsy()
  })

  test('edge: empty character match', () => {
    const tokenType = 'Alphabet'
    const regExp = /[a-bA-B]{0}/

    const result = createTokenPatternFromRegExp(tokenType, regExp)

    expect(isFunction(result)).toBe(true)
    expect(result('a')).toBeFalsy()
    expect(result('')).toBeFalsy()
  })
})
