import { createGroupedExpressionNodePattern } from '@src/create-grouped-expression-node-pattern'
import { IToken, INodePattern } from '@src/types'

describe('createGroupedExpressionNodePattern', () => {
  test('matched', () => {
    const leftTokenType = 'LeftParenthesis'
    const rightTokenType = 'RightParenthesis'
    const centerNodePattern: INodePattern = tokens => {
      if (tokens[0].tokenType === 'Literal') {
        return {
          consumed: 1
        , node: {
            nodeType: 'String'
          , value: tokens[0].value
          }
        }
      }
    }
    const pattern = createGroupedExpressionNodePattern({
      leftTokenType
    , centerNodePattern
    , rightTokenType
    })
    const tokens: IToken[] = [
      {
        tokenType: 'LeftParenthesis'
      , value: '('
      }
    , {
        tokenType: 'Literal'
      , value: 'text'
      }
    , {
        tokenType: 'RightParenthesis'
      , value: ')'
      }
    ]

    const result = pattern(tokens)

    expect(result).toStrictEqual({
      consumed: 3
    , node: {
        nodeType: 'String'
      , value: 'text'
      }
    })
  })

  describe('not matched', () => {
    test('tokens are less than needed', () => {
      const leftTokenType = 'LeftParenthesis'
      const rightTokenType = 'RightParenthesis'
      const centerNodePattern: INodePattern = tokens => {
        if (tokens[0].tokenType === 'Literal') {
          return {
            consumed: 1
          , node: {
              nodeType: 'String'
            , value: tokens[0].value
            }
          }
        }
      }
      const tokens: IToken[] = []
      const pattern = createGroupedExpressionNodePattern({
        leftTokenType
      , centerNodePattern
      , rightTokenType
      })

      const result = pattern(tokens)

      expect(result).toBe(undefined)
    })

    test('left token is not matched', () => {
      const leftTokenType = 'LeftParenthesis'
      const rightTokenType = 'RightParenthesis'
      const centerNodePattern: INodePattern = tokens => {
        if (tokens[0].tokenType === 'Literal') {
          return {
            consumed: 1
          , node: {
              nodeType: 'String'
            , value: tokens[0].value
            }
          }
        }
      }
      const tokens: IToken[] = [
        {
          tokenType: 'Literal'
        , value: '('
        }
      , {
          tokenType: 'Literal'
        , value: 'text'
        }
      , {
          tokenType: 'RightParenthesis'
        , value: ')'
        }
      ]
      const pattern = createGroupedExpressionNodePattern({
        leftTokenType
      , centerNodePattern
      , rightTokenType
      })

      const result = pattern(tokens)

      expect(result).toBe(undefined)
    })

    test('center node is not matched', () => {
      const leftTokenType = 'LeftParenthesis'
      const rightTokenType = 'RightParenthesis'
      const centerNodePattern: INodePattern = tokens => {
        if (tokens[0].tokenType === 'Literal') {
          return {
            consumed: 1
          , node: {
              nodeType: 'String'
            , value: tokens[0].value
            }
          }
        }
      }
      const tokens: IToken[] = [
        {
          tokenType: 'LeftParenthesis'
        , value: '('
        }
      , {
          tokenType: 'String'
        , value: 'text'
        }
      , {
          tokenType: 'RightParenthesis'
        , value: ')'
        }
      ]
      const pattern = createGroupedExpressionNodePattern({
        leftTokenType
      , centerNodePattern
      , rightTokenType
      })

      const result = pattern(tokens)

      expect(result).toBe(undefined)
    })

    test('right token is not matched', () => {
      const leftTokenType = 'LeftParenthesis'
      const rightTokenType = 'RightParenthesis'
      const centerNodePattern: INodePattern = tokens => {
        if (tokens[0].tokenType === 'Literal') {
          return {
            consumed: 1
          , node: {
              nodeType: 'String'
            , value: tokens[0].value
            }
          }
        }
      }
      const tokens: IToken[] = [
        {
          tokenType: 'LeftParenthesis'
        , value: '('
        }
      , {
          tokenType: 'Literal'
        , value: 'text'
        }
      , {
          tokenType: 'Literal'
        , value: ')'
        }
      ]
      const pattern = createGroupedExpressionNodePattern({
        leftTokenType
      , centerNodePattern
      , rightTokenType
      })

      const result = pattern(tokens)

      expect(result).toBe(undefined)
    })
  })
})
