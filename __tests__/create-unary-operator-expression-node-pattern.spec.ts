import { createUnaryOperatorExpressionNodePattern } from '@src/create-unary-operator-expression-node-pattern'
import { IToken, INodePattern } from '@src/types'

describe('createUnaryOperatorExpressionNodePattern', () => {
  test('matched', async () => {
    const rightNodePattern: INodePattern = tokens => {
      if (tokens[0].tokenType === 'Reference') {
        return {
          consumed: 1
        , node: {
            nodeType: 'Identifier'
          , value: tokens[0].value
          }
        }
      }
    }
    const nodeType = 'NotExpression'
    const leftTokenType = 'Not'
    const pattern = createUnaryOperatorExpressionNodePattern({
      nodeType
    , leftTokenType
    , rightNodePattern
    })
    const tokens: IToken[] = [
      {
        tokenType: 'Not'
      , value: 'not'
      }
    , {
        tokenType: 'Reference'
      , value: 'id'
      }
    ]

    const result = await pattern(tokens)

    expect(result).toStrictEqual({
      consumed: 2
    , node: {
        nodeType: 'NotExpression'
      , right: {
          nodeType: 'Identifier'
        , value: 'id'
        }
      }
    })
  })

  describe('not matched', () => {
    test('tokens are less than needed', async () => {
      const rightNodePattern: INodePattern = tokens => {
        if (tokens[0].tokenType === 'Reference') {
          return {
            consumed: 1
          , node: {
              nodeType: 'Identifier'
            , value: tokens[0].value
            }
          }
        }
      }
      const nodeType = 'NotExpression'
      const leftTokenType = 'Not'
      const pattern = createUnaryOperatorExpressionNodePattern({
        nodeType
      , leftTokenType
      , rightNodePattern
      })
      const tokens: IToken[] = []

      const result = await pattern(tokens)

      expect(result).toBe(undefined)
    })

    test('first token is not matched', async () => {
      const rightNodePattern: INodePattern = tokens => {
        if (tokens[0].tokenType === 'Reference') {
          return {
            consumed: 1
          , node: {
              nodeType: 'Identifier'
            , value: tokens[0].value
            }
          }
        }
      }
      const leftTokenType = 'Not'
      const nodeType = 'NotExpression'
      const pattern = createUnaryOperatorExpressionNodePattern({
        leftTokenType
      , nodeType
      , rightNodePattern
      })
      const tokens: IToken[] = [
        {
          tokenType: 'Symbol'
        , value: 'not'
        }
      , {
          tokenType: 'Reference'
        , value: 'id'
        }
      ]

      const result = await pattern(tokens)

      expect(result).toBe(undefined)
    })

    test('right node is not matched', async () => {
      const rightNodePattern: INodePattern = tokens => {
        if (tokens[0].tokenType === 'Reference') {
          return {
            consumed: 1
          , node: {
              nodeType: 'Identifier'
            , value: tokens[0].value
            }
          }
        }
      }
      const leftTokenType = 'Not'
      const nodeType = 'NotExpression'
      const pattern = createUnaryOperatorExpressionNodePattern({
        leftTokenType
      , nodeType
      , rightNodePattern
      })
      const tokens: IToken[] = [
        {
          tokenType: 'Not'
        , value: 'not'
        }
      , {
          tokenType: 'Name'
        , value: 'name'
        }
      ]

      const result = await pattern(tokens)

      expect(result).toBe(undefined)
    })
  })
})
