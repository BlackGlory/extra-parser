import { createValueExpressionNodePattern } from '@src/create-value-expression-node-pattern'
import { IToken } from '@src/types'

describe('createValueExpressionNodePattern', () => {
  test('matched', () => {
    const nodeType = 'Identifier'
    const valueTokenType = 'Name'
    const transformValue = (x: string) => `name:${x}`
    const pattern = createValueExpressionNodePattern({
      nodeType
    , valueTokenType
    , transformValue
    })
    const tokens: IToken[] = [
      {
        tokenType: 'Name'
      , value: 'you know who'
      }
    ]

    const result = pattern(tokens)

    expect(result).toStrictEqual({
      consumed: 1
    , node: {
        nodeType: 'Identifier'
      , value: 'name:you know who'
      }
    })
  })

  describe('not matched', () => {
    test('tokens are less than needed', () => {
      const nodeType = 'Identifier'
      const valueTokenType = 'Name'
      const transformValue = (x: string) => `name:${x}`
      const pattern = createValueExpressionNodePattern({
        nodeType
      , valueTokenType
      , transformValue
      })
      const tokens: IToken[] = []

      const result = pattern(tokens)

      expect(result).toBe(undefined)
    })

    test('token is not matched', () => {
      const nodeType = 'Identifier'
      const valueTokenType = 'Name'
      const transformValue = (x: string) => `name:${x}`
      const pattern = createValueExpressionNodePattern({
        nodeType
      , valueTokenType
      , transformValue
      })
      const tokens: IToken[] = [
        {
          tokenType: 'Text'
        , value: 'you know who'
        }
      ]

      const result = pattern(tokens)

      expect(result).toBe(undefined)
    })
  })
})
