import { createTokenPatternFromRegExp } from '@src/create-token-pattern-from-regexp'

describe('createTokenPatternFromRegExp', () => {
  test('single character match', () => {
    const tokenType = 'Alphabet'
    const regExp = /[a-bA-B]/

    const result = createTokenPatternFromRegExp(tokenType, regExp)

    expect(result).toStrictEqual({
      tokenType
    , match: expect.any(Function)
    })
    expect(result.match('a')).toStrictEqual({ consumed: 1 })
    expect(result.match('ab')).toStrictEqual({ consumed: 1 })
    expect(result.match('1')).toStrictEqual({ consumed: 0 })
    expect(result.match('12')).toStrictEqual({ consumed: 0 })
    expect(result.match(' a')).toStrictEqual({ consumed: 0 })
  })

  test('multiple character match', () => {
    const tokenType = 'Alphabet'
    const regExp = /[a-bA-B]+/

    const result = createTokenPatternFromRegExp(tokenType, regExp)

    expect(result).toStrictEqual({
      tokenType
    , match: expect.any(Function)
    })
    expect(result.match('a')).toStrictEqual({ consumed: 1 })
    expect(result.match('ab')).toStrictEqual({ consumed: 2 })
    expect(result.match('1')).toStrictEqual({ consumed: 0 })
    expect(result.match('12')).toStrictEqual({ consumed: 0 })
    expect(result.match(' a')).toStrictEqual({ consumed: 0 })
  })
})
