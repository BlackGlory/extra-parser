import { parse } from '@src/parse'
import { IToken, INodePattern } from '@src/types'
import { takeUntil, toArray } from 'iterable-operator'
import { getError } from 'return-style'

describe('parse', () => {
  test('all known tokens', () => {
    const pattern1: INodePattern = tokens => {
      const [firstToken, ...restTokens] = tokens
      if (firstToken.tokenType === 'Alphabet') {
        const usedRestTokens = toArray(takeUntil(restTokens, x => {
          return x.tokenType !== 'Alphabet'
              && x.tokenType !== 'Number'
        }))
        const consumed = [firstToken, ...usedRestTokens].length
        const value = [firstToken, ...usedRestTokens].map(x => x.value).join('')
        return {
          consumed
        , node: {
            nodeType: 'Identifier'
          , value
          }
        }
      }
    }
    const pattern2: INodePattern = tokens => {
      return {
        consumed: tokens.length
      , node: {
          nodeType: 'Fallback'
        , value: tokens.map(x => x.value).join('')
        }
      }
    }
    const token1: IToken = {
      tokenType: 'Alphabet'
    , value: 'a'
    }
    const token2: IToken = {
      tokenType: 'Number'
    , value: '1'
    }
    const patterns = [pattern1, pattern2]
    const tokens = [token1, token2]

    const result = toArray(parse(patterns, tokens))

    expect(result).toStrictEqual([
      {
        nodeType: 'Identifier'
      , value: 'a1'
      }
    ])
  })

  test('contains unknown tokens', () => {
    const pattern1: INodePattern = tokens => {
      const [firstToken, ...restTokens] = tokens
      if (firstToken.tokenType === 'Alphabet') {
        const usedRestTokens = toArray(takeUntil(restTokens, x => {
          return x.tokenType !== 'Alphabet'
              && x.tokenType !== 'Number'
        }))
        const consumed = [firstToken, ...usedRestTokens].length
        const value = [firstToken, ...usedRestTokens].map(x => x.value).join('')
        return {
          consumed
        , node: {
            nodeType: 'Identifier'
          , value
          }
        }
      }
    }
    const token1: IToken = {
      tokenType: 'Alphabet'
    , value: 'a'
    }
    const token2: IToken = {
      tokenType: 'WhiteSpace'
    , value: ' '
    }
    const token3: IToken = {
      tokenType: 'Number'
    , value: '1'
    }
    const patterns = [pattern1]
    const tokens = [token1, token2, token3]

    const err = getError(() => toArray(parse(patterns, tokens)))

    expect(err).toBeInstanceOf(Error)
  })

  test('parse in order', () => {
    const pattern1: INodePattern = tokens => {
      const [firstToken, ...restTokens] = tokens
      if (firstToken.tokenType === 'Alphabet') {
        const usedRestTokens = toArray(takeUntil(restTokens, x => {
          return x.tokenType !== 'Alphabet'
              && x.tokenType !== 'Number'
        }))
        const consumed = [firstToken, ...usedRestTokens].length
        const value = [firstToken, ...usedRestTokens].map(x => x.value).join('')
        return {
          consumed
        , node: {
            nodeType: 'Identifier'
          , value
          }
        }
      }
    }
    const pattern2: INodePattern = (tokens) => {
      return {
        consumed: tokens.length
      , node: {
          nodeType: 'Fallback'
        , value: tokens.map(x => x.value).join('')
        }
      }
    }
    const token1: IToken = {
      tokenType: 'Alphabet'
    , value: 'a'
    }
    const token2: IToken = {
      tokenType: 'Number'
    , value: '1'
    }
    const patterns = [pattern1, pattern2]
    const tokens = [token1, token2]

    const result = toArray(parse(patterns, tokens))

    expect(result).toStrictEqual([
      {
        nodeType: 'Identifier'
      , value: 'a1'
      }
    ])
  })
})
