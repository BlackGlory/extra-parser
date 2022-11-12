import { createBinaryOperatorExpressionNodePattern } from '@src/create-binary-operator-expression-node-pattern'
import { IToken, INodePattern } from '@src/types'

describe('createBinaryOperatorExpressionNodePattern', () => {
  test('matched', async () => {
    const centerTokenType = 'And'
    const leftNodePattern: INodePattern = tokens => {
      if (tokens[0].tokenType === 'Reference') {
        return {
          consumed: 1
        , node: {
            nodeType: 'Identifier'
          , value: 'left'
          }
        }
      }
    }
    const rightNodePattern: INodePattern = tokens => {
      if (tokens[0].tokenType === 'Reference') {
        return {
          consumed: 1
        , node: {
            nodeType: 'Identifier'
          , value: 'right'
          }
        }
      }
    }
    const tokens: IToken[] = [
      {
        tokenType: 'Reference'
      , value: 'left'
      }
    , {
        tokenType: 'And'
      , value: 'and'
      }
    , {
        tokenType: 'Reference'
      , value: 'right'
      }
    ]
    const pattern = createBinaryOperatorExpressionNodePattern({
      nodeType: 'AndExpression'
    , centerTokenType
    , leftNodePattern
    , rightNodePattern
    })

    const result = await pattern(tokens)

    expect(result).toStrictEqual({
      consumed: 3
    , node: {
        nodeType: 'AndExpression'
      , left: {
          nodeType: 'Identifier'
        , value: 'left'
        }
      , right: {
          nodeType: 'Identifier'
        , value: 'right'
        }
      }
    })
  })

  describe('not matched', () => {
    test('tokens are less than needed', async () => {
      const centerTokenType = 'And'
      const leftNodePattern: INodePattern = tokens => {
        if (tokens[0].tokenType === 'Reference') {
          return {
            consumed: 1
          , node: {
              nodeType: 'Identifier'
            , value: 'left'
            }
          }
        }
      }
      const rightNodePattern: INodePattern = tokens => {
        if (tokens[0].tokenType === 'Reference') {
          return {
            consumed: 1
          , node: {
              nodeType: 'Identifier'
            , value: 'right'
            }
          }
        }
      }
      const tokens: IToken[] = []
      const pattern = createBinaryOperatorExpressionNodePattern({
        nodeType: 'AndExpression'
      , centerTokenType
      , leftNodePattern
      , rightNodePattern
      })

      const result = await pattern(tokens)

      expect(result).toBe(undefined)
    })

    test('left node is not matched', async () => {
      const centerTokenType = 'And'
      const leftNodePattern: INodePattern = tokens => {
        if (tokens[0].tokenType === 'Reference') {
          return {
            consumed: 1
          , node: {
              nodeType: 'Identifier'
            , value: 'left'
            }
          }
        }
      }
      const rightNodePattern: INodePattern = tokens => {
        if (tokens[0].tokenType === 'Reference') {
          return {
            consumed: 1
          , node: {
              nodeType: 'Identifier'
            , value: 'right'
            }
          }
        }
      }
      const tokens: IToken[] = [
        {
          tokenType: 'Name'
        , value: 'name'
        }
      , {
          tokenType: 'And'
        , value: 'and'
        }
      , {
          tokenType: 'Reference'
        , value: 'right'
        }
      ]
      const pattern = createBinaryOperatorExpressionNodePattern({
        nodeType: 'AndExpression'
      , centerTokenType
      , leftNodePattern
      , rightNodePattern
      })

      const result = await pattern(tokens)

      expect(result).toBe(undefined)
    })

    test('center token is not matched', async () => {
      const centerTokenType = 'And'
      const leftNodePattern: INodePattern = tokens => {
        if (tokens[0].tokenType === 'Reference') {
          return {
            consumed: 1
          , node: {
              nodeType: 'Identifier'
            , value: 'left'
            }
          }
        }
      }
      const rightNodePattern: INodePattern = tokens => {
        if (tokens[0].tokenType === 'Reference') {
          return {
            consumed: 1
          , node: {
              nodeType: 'Identifier'
            , value: 'right'
            }
          }
        }
      }
      const tokens: IToken[] = [
        {
          tokenType: 'Reference'
        , value: 'left'
        }
      , {
          tokenType: 'Or'
        , value: 'or'
        }
      , {
          tokenType: 'Reference'
        , value: 'right'
        }
      ]
      const pattern = createBinaryOperatorExpressionNodePattern({
        nodeType: 'AndExpression'
      , centerTokenType
      , leftNodePattern
      , rightNodePattern
      })

      const result = await pattern(tokens)

      expect(result).toBe(undefined)
    })

    test('right node is not matched', async () => {
      const centerTokenType = 'And'
      const leftNodePattern: INodePattern = tokens => {
        if (tokens[0].tokenType === 'Reference') {
          return {
            consumed: 1
          , node: {
              nodeType: 'Identifier'
            , value: 'left'
            }
          }
        }
      }
      const rightNodePattern: INodePattern = tokens => {
        if (tokens[0].tokenType === 'Reference') {
          return {
            consumed: 1
          , node: {
              nodeType: 'Identifier'
            , value: 'right'
            }
          }
        }
      }
      const tokens: IToken[] = [
        {
          tokenType: 'Reference'
        , value: 'left'
        }
      , {
          tokenType: 'And'
        , value: 'and'
        }
      , {
          tokenType: 'Name'
        , value: 'name'
        }
      ]
      const pattern = createBinaryOperatorExpressionNodePattern({
        nodeType: 'AndExpression'
      , centerTokenType
      , leftNodePattern
      , rightNodePattern
      })

      const result = await pattern(tokens)

      expect(result).toBe(undefined)
    })
  })
})
