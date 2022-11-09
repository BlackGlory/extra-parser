import { parse } from '@src/parse'
import { IToken, INodePattern, INode } from '@src/types'
import { takeUntil, toArray } from 'iterable-operator'
import { getError } from 'return-style'

describe('parse', () => {
  test('all known tokens', () => {
    const pattern1: INodePattern<IToken<string>, INode<'Identifier'>> = (tokens) => {
      const [firstToken, ...restTokens] = tokens
      if (firstToken.type === 'Alphabet') {
        const usedRestTokens = toArray(takeUntil(restTokens, x => {
          return x.type !== 'Alphabet'
              && x.type !== 'Number'
        }))
        const consumed = [firstToken, ...usedRestTokens].length
        const value = [firstToken, ...usedRestTokens].map(x => x.value).join('')
        return {
          consumed
        , node: {
            type: 'Identifier'
          , value
          }
        }
      }
    }
    const pattern2: INodePattern<IToken<string>, INode<'Fallback'>> = (tokens) => {
      return {
        consumed: tokens.length
      , node: {
          type: 'Fallback'
        , value: tokens.map(x => x.value).join('')
        }
      }
    }
    const token1: IToken<'Alphabet'> = {
      type: 'Alphabet'
    , value: 'a'
    }
    const token2: IToken<'Number'> = {
      type: 'Number'
    , value: '1'
    }
    const patterns = [pattern1, pattern2]
    const tokens = [token1, token2]

    const result = toArray(parse(tokens, patterns))

    expect(result).toStrictEqual([
      {
        type: 'Identifier'
      , value: 'a1'
      }
    ])
  })

  test('contains unknown tokens', () => {
    const pattern1: INodePattern<IToken<string>, INode<'Identifier'>> = (tokens) => {
      const [firstToken, ...restTokens] = tokens
      if (firstToken.type === 'Alphabet') {
        const usedRestTokens = toArray(takeUntil(restTokens, x => {
          return x.type !== 'Alphabet'
              && x.type !== 'Number'
        }))
        const consumed = [firstToken, ...usedRestTokens].length
        const value = [firstToken, ...usedRestTokens].map(x => x.value).join('')
        return {
          consumed
        , node: {
            type: 'Identifier'
          , value
          }
        }
      }
    }
    
    const token1: IToken<'Alphabet'> = {
      type: 'Alphabet'
    , value: 'a'
    }
    const token2: IToken<'WhiteSpace'> = {
      type: 'WhiteSpace'
    , value: ' '
    }
    const token3: IToken<'Number'> = {
      type: 'Number'
    , value: '1'
    }
    const patterns = [pattern1]
    const tokens = [token1, token2, token3]

    const err = getError(() => toArray(parse(tokens, patterns)))

    expect(err).toBeInstanceOf(Error)
  })

  test('parse in order', () => {
    const pattern1: INodePattern<IToken<string>, INode<'Identifier'>> = (tokens) => {
      const [firstToken, ...restTokens] = tokens
      if (firstToken.type === 'Alphabet') {
        const usedRestTokens = toArray(takeUntil(restTokens, x => {
          return x.type !== 'Alphabet'
              && x.type !== 'Number'
        }))
        const consumed = [firstToken, ...usedRestTokens].length
        const value = [firstToken, ...usedRestTokens].map(x => x.value).join('')
        return {
          consumed
        , node: {
            type: 'Identifier'
          , value
          }
        }
      }
    }
    
    const pattern2: INodePattern<IToken<string>, INode<'Fallback'>> = (tokens) => {
      return {
        consumed: tokens.length
      , node: {
          type: 'Fallback'
        , value: tokens.map(x => x.value).join('')
        }
      }
    }
    const token1: IToken<'Alphabet'> = {
      type: 'Alphabet'
    , value: 'a'
    }
    const token2: IToken<'Number'> = {
      type: 'Number'
    , value: '1'
    }
    const patterns = [pattern1, pattern2]
    const tokens = [token1, token2]

    const result = toArray(parse(tokens, patterns))

    expect(result).toStrictEqual([
      {
        type: 'Identifier'
      , value: 'a1'
      }
    ])
  })
})
