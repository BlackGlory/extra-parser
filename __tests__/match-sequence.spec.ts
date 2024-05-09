import { matchSequence, splitPatterns } from '@src/match-sequence'
import { toArray } from '@blackglory/prelude'
import { IToken, INodePattern } from '@src/types'

describe('matchSequence', () => {
  describe('[TokenType]', () => {
    test('matched', () => {
      const patterns = ['Token']
      const tokens: IToken[] = [
        {
          tokenType: 'Token'
        , value: 'value'
        }
      ]

      const result = matchSequence(patterns, tokens)

      expect(result).toStrictEqual([
        {
          tokenType: 'Token'
        , value: 'value'
        }
      ])
    })

    describe('not matched', () => {
      test('tokens are less than needed', () => {
        const patterns = ['Token']
        const tokens: IToken[] = []

        const result = matchSequence(patterns, tokens)

        expect(tokens).toStrictEqual([])
        expect(result).toBe(undefined)
      })

      test('token is not matched', () => {
        const patterns = ['Token']
        const tokens: IToken[] = [
          {
            tokenType: 'Foo'
          , value: 'value'
          }
        ]

        const result = matchSequence(patterns, tokens)

        expect(result).toBe(undefined)
      })
    })
  })

  describe('[NodePattern]', () => {
    test('matched', () => {
      const patterns = [
        (tokens: ReadonlyArray<IToken>) => ({
          consumed: 1
        , node: {
            nodeType: 'Node'
          , value: 'value'
          }
        })
      ]
      const tokens: IToken[] = [
        {
          tokenType: 'Token'
        , value: 'value'
        }
      ]

      const result = matchSequence(patterns, tokens)

      expect(result).toStrictEqual([
        {
          consumed: 1
        , node: {
            nodeType: 'Node'
          , value: 'value'
          }
        }
      ])
    })

    describe('not matched', () => {
      test('tokens are less than needed', () => {
        const patterns = [
          (tokens: ReadonlyArray<IToken>) => false as const
        ]
        const tokens: IToken[] = []

        const result = matchSequence(patterns, tokens)

        expect(tokens).toStrictEqual([])
        expect(result).toBe(undefined)
      })

      test('node is not matched', () => {
        const patterns = [
          (tokens: ReadonlyArray<IToken>) => false as const
        ]
        const tokens: IToken[] = [
          {
            tokenType: 'Token'
          , value: 'value'
          }
        ]

        const result = matchSequence(patterns, tokens)

        expect(result).toBe(undefined)
      })
    })
  })

  describe('[TokenType, NodePattern, TokenType]', () => {
    test('matched', () => {
      const patterns = [
        'Left'
      , (tokens: ReadonlyArray<IToken>) => {
          if (tokens[0].tokenType === 'Center') {
            return {
              consumed: 1
            , node: {
                nodeType: 'Center'
              , value: tokens[0].value
              }
            }
          }
        }
      , 'Right'
      ]
      const tokens: IToken[] = [
        {
          tokenType: 'Left'
        , value: 'left'
        }
      , {
          tokenType: 'Center'
        , value: 'center'
        }
      , {
          tokenType: 'Right'
        , value: 'right'
        }
      ]

      const result = matchSequence(patterns, tokens)

      expect(result).toStrictEqual([
        {
          tokenType: 'Left'
        , value: 'left'
        }
      , {
          consumed: 1
        , node: {
            nodeType: 'Center'
          , value: 'center'
          }
        }
      , {
          tokenType: 'Right'
        , value: 'right'
        }
      ])
    })

    describe('not matched', () => {
      test('tokens are less than needed', () => {
        const patterns = [
          'Left'
        , (tokens: ReadonlyArray<IToken>) => {
            if (tokens[0].tokenType === 'Center') {
              return {
                consumed: 1
              , node: {
                  nodeType: 'Center'
                , value: tokens[0].value
                }
              }
            }
          }
        , 'Right'
        ]
        const tokens: IToken[] = []

        const result = matchSequence(patterns, tokens)

        expect(result).toBe(undefined)
      })

      test('first token is not matched', () => {
        const patterns = [
          'Left'
        , (tokens: ReadonlyArray<IToken>) => {
            if (tokens[0].tokenType === 'Center') {
              return {
                consumed: 1
              , node: {
                  nodeType: 'CenterNode'
                , value: tokens[0].value
                }
              }
            }
          }
        , 'Right'
        ]
        const tokens: IToken[] = [
          {
            tokenType: 'Right'
          , value: 'right'
          }
        , {
            tokenType: 'Center'
          , value: 'center'
          }
        , {
            tokenType: 'Right'
          , value: 'right'
          }
        ]

        const result = matchSequence(patterns, tokens)

        expect(result).toBe(undefined)
      })

      test('node is not matched', () => {
        const patterns = [
          'Left'
        , (tokens: ReadonlyArray<IToken>) => {
            if (tokens[0].tokenType === 'Center') {
              return {
                consumed: 1
              , node: {
                  nodeType: 'Center'
                , value: tokens[0].value
                }
              }
            }
          }
        , 'Right'
        ]
        const tokens: IToken[] = [
          {
            tokenType: 'Right'
          , value: 'right'
          }
        , {
            tokenType: 'Center'
          , value: 'center'
          }
        , {
            tokenType: 'Right'
          , value: 'right'
          }
        ]

        const result = matchSequence(patterns, tokens)

        expect(result).toBe(undefined)
      })

      test('last token is not matched', () => {
        const patterns = [
          'Left'
        , (tokens: ReadonlyArray<IToken>) => {
            if (tokens[0].tokenType === 'Center') {
              return {
                consumed: 1
              , node: {
                  nodeType: 'Center'
                , value: tokens[0].value
                }
              }
            }
          }
        , 'Right'
        ]
        const tokens: IToken[] = [
          {
            tokenType: 'Left'
          , value: 'left'
          }
        , {
            tokenType: 'Center'
          , value: 'Center'
          }
        , {
            tokenType: 'Left'
          , value: 'left'
          }
        ]

        const result = matchSequence(patterns, tokens)

        expect(result).toBe(undefined)
      })
    })
  })

  describe('[NodePattern, TokenType, NodePattern]', () => {
    test('matched', () => {
      const patterns = [
        (tokens: ReadonlyArray<IToken>) => {
          if (tokens[0].tokenType === 'Left') {
            return {
              consumed: 1
            , node: {
                nodeType: 'Left'
              , value: tokens[0].value
              }
            }
          }
        }
      , 'Center'
      , (tokens: ReadonlyArray<IToken>) => {
          if (tokens[0].tokenType === 'Right') {
            return {
              consumed: 1
            , node: {
                nodeType: 'Right'
              , value: tokens[0].value
              }
            }
          }
        }
      ]
      const tokens: IToken[] = [
        {
          tokenType: 'Left'
        , value: 'left'
        }
      , {
          tokenType: 'Center'
        , value: 'center'
        }
      , {
          tokenType: 'Right'
        , value: 'right'
        }
      ]

      const result = matchSequence(patterns, tokens)

      expect(result).toStrictEqual([
        {
          consumed: 1
        , node: {
            nodeType: 'Left'
          , value: 'left'
          }
        }
      , {
          tokenType: 'Center'
        , value: 'center'
        }
      , {
          consumed: 1
        , node: {
            nodeType: 'Right'
          , value: 'right'
          }
        }
      ])
    })

    describe('not matched', () => {
      test('first node is not matched', () => {
        const patterns = [
          (tokens: ReadonlyArray<IToken>) => {
            if (tokens[0].tokenType === 'Left') {
              return {
                consumed: 1
              , node: {
                  nodeType: 'Left'
                , value: tokens[0].value
                }
              }
            }
          }
        , 'Center'
        , (tokens: ReadonlyArray<IToken>) => {
            if (tokens[0].tokenType === 'Right') {
              return {
                consumed: 1
              , node: {
                  nodeType: 'Right'
                , value: tokens[0].value
                }
              }
            }
          }
        ]
        const tokens: IToken[] = [
          {
            tokenType: 'Right'
          , value: 'right'
          }
        , {
            tokenType: 'Center'
          , value: 'center'
          }
        , {
            tokenType: 'Right'
          , value: 'right'
          }
        ]

        const result = matchSequence(patterns, tokens)

        expect(result).toBe(undefined)
      })

      test('token is not matched', () => {
        const patterns = [
          (tokens: ReadonlyArray<IToken>) => {
            if (tokens[0].tokenType === 'Left') {
              return {
                consumed: 1
              , node: {
                  nodeType: 'Left'
                , value: tokens[0].value
                }
              }
            }
          }
        , 'Center'
        , (tokens: ReadonlyArray<IToken>) => {
            if (tokens[0].tokenType === 'Right') {
              return {
                consumed: 1
              , node: {
                  nodeType: 'Right'
                , value: tokens[0].value
                }
              }
            }
          }
        ]
        const tokens: IToken[] = [
          {
            tokenType: 'Left'
          , value: 'left'
          }
        , {
            tokenType: 'Top'
          , value: 'top'
          }
        , {
            tokenType: 'Right'
          , value: 'right'
          }
        ]

        const result = matchSequence(patterns, tokens)

        expect(result).toBe(undefined)
      })

      test('last node is not matched', () => {
        const patterns = [
          (tokens: ReadonlyArray<IToken>) => {
            if (tokens[0].tokenType === 'Left') {
              return {
                consumed: 1
              , node: {
                  nodeType: 'Left'
                , value: tokens[0].value
                }
              }
            }
          }
        , 'Center'
        , (tokens: ReadonlyArray<IToken>) => {
            if (tokens[0].tokenType === 'Right') {
              return {
                consumed: 1
              , node: {
                  nodeType: 'Right'
                , value: tokens[0].value
                }
              }
            }
          }
        ]
        const tokens: IToken[] = [
          {
            tokenType: 'Left'
          , value: 'left'
          }
        , {
            tokenType: 'Center'
          , value: 'center'
          }
        , {
            tokenType: 'Left'
          , value: 'left'
          }
        ]

        const result = matchSequence(patterns, tokens)

        expect(result).toBe(undefined)
      })
    })
  })
})

describe('splitPatterns', () => {
  test('[TokenType] => [TokenType]', () => {
    const patterns = ['tokenType']

    const result = toArray(splitPatterns(patterns))

    expect(result).toStrictEqual([
      ['tokenType']
    ])
  })

  test('[NodePattern] => [NodePattern]', () => {
    const nodePattern: INodePattern = (tokens: ReadonlyArray<IToken>) => false
    const patterns = [nodePattern]

    const result = toArray(splitPatterns(patterns))

    expect(result).toStrictEqual([
      [nodePattern]
    ])
  })

  test('[TokenType, TokenType] => [TokenType, TokenType]', () => {
    const patterns = ['tokenType1', 'tokenType2']

    const result = toArray(splitPatterns(patterns))

    expect(result).toStrictEqual([
      ['tokenType1', 'tokenType2']
    ])
  })

  test('[NodePattern, NodePattern] => [NodePattern, NodePattern]', () => {
    const nodePattern1: INodePattern = (tokens: ReadonlyArray<IToken>) => false
    const nodePattern2: INodePattern = (tokens: ReadonlyArray<IToken>) => false
    const patterns = [nodePattern1, nodePattern2]

    const result = toArray(splitPatterns(patterns))

    expect(result).toStrictEqual([
      [nodePattern1, nodePattern2]
    ])
  })

  test('[Token, NodePattern] => [Token], [NodePattern]', () => {
    const nodePattern: INodePattern = (tokens: ReadonlyArray<IToken>) => false
    const patterns = ['tokenType', nodePattern]

    const result = toArray(splitPatterns(patterns))

    expect(result).toStrictEqual([
      ['tokenType']
    , [nodePattern]
    ])
  })

  test('[NodePattern, Token] => [NodePattern, Token]', () => {
    const nodePattern: INodePattern = (tokens: ReadonlyArray<IToken>) => false
    const patterns = [nodePattern, 'tokenType']

    const result = toArray(splitPatterns(patterns))

    expect(result).toStrictEqual([
      [nodePattern, 'tokenType']
    ])
  })

  test('[Token, NodePattern, Token] => [Token], [NodePattern, [Token]', () => {
    const nodePattern: INodePattern = (tokens: ReadonlyArray<IToken>) => false
    const patterns = ['tokenType1', nodePattern, 'tokenType2']

    const result = toArray(splitPatterns(patterns))

    expect(result).toStrictEqual([
      ['tokenType1']
    , [nodePattern, 'tokenType2']
    ])
  })

  test('[NodePattern, Token, NodePattern] => [NodePattern, Token], [NodePattern]', () => {
    const nodePattern1: INodePattern = (tokens: ReadonlyArray<IToken>) => false
    const nodePattern2: INodePattern = (tokens: ReadonlyArray<IToken>) => false
    const patterns = [nodePattern1, 'tokenType', nodePattern2]

    const result = toArray(splitPatterns(patterns))

    expect(result).toStrictEqual([
      [nodePattern1, 'tokenType']
    , [nodePattern2]
    ])
  })
})
