import { parse } from '@src/parse'
import { IToken, INodePattern, INode } from '@src/types'
import { takeUntil, toArray, toArrayAsync } from 'iterable-operator'
import { getErrorPromise } from 'return-style'

describe('parse', () => {
  test('all known tokens', async () => {
    const pattern1: INodePattern<IToken<string>, INode<'Identifier'>> = tokens => {
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
    const pattern2: INodePattern<IToken<string>, INode<'Fallback'>> = tokens => {
      return {
        consumed: tokens.length
      , node: {
          nodeType: 'Fallback'
        , value: tokens.map(x => x.value).join('')
        }
      }
    }
    const token1: IToken<'Alphabet'> = {
      tokenType: 'Alphabet'
    , value: 'a'
    }
    const token2: IToken<'Number'> = {
      tokenType: 'Number'
    , value: '1'
    }
    const patterns = [pattern1, pattern2]
    const tokens = [token1, token2]

    const result = await toArrayAsync(parse(tokens, patterns))

    expect(result).toStrictEqual([
      {
        nodeType: 'Identifier'
      , value: 'a1'
      }
    ])
  })

  test('contains unknown tokens', async () => {
    const pattern1: INodePattern<IToken<string>, INode<'Identifier'>> = tokens => {
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
    
    const token1: IToken<'Alphabet'> = {
      tokenType: 'Alphabet'
    , value: 'a'
    }
    const token2: IToken<'WhiteSpace'> = {
      tokenType: 'WhiteSpace'
    , value: ' '
    }
    const token3: IToken<'Number'> = {
      tokenType: 'Number'
    , value: '1'
    }
    const patterns = [pattern1]
    const tokens = [token1, token2, token3]

    const err = await getErrorPromise(toArrayAsync(parse(tokens, patterns)))

    expect(err).toBeInstanceOf(Error)
  })

  test('parse in order', async () => {
    const pattern1: INodePattern<IToken<string>, INode<'Identifier'>> = tokens => {
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
    
    const pattern2: INodePattern<IToken<string>, INode<'Fallback'>> = (tokens) => {
      return {
        consumed: tokens.length
      , node: {
          nodeType: 'Fallback'
        , value: tokens.map(x => x.value).join('')
        }
      }
    }
    const token1: IToken<'Alphabet'> = {
      tokenType: 'Alphabet'
    , value: 'a'
    }
    const token2: IToken<'Number'> = {
      tokenType: 'Number'
    , value: '1'
    }
    const patterns = [pattern1, pattern2]
    const tokens = [token1, token2]

    const result = await toArrayAsync(parse(tokens, patterns))

    expect(result).toStrictEqual([
      {
        nodeType: 'Identifier'
      , value: 'a1'
      }
    ])
  })
})
