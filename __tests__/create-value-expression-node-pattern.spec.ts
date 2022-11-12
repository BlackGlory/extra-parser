import { createValueExpressionNodePattern } from '@src/create-value-expression-node-pattern'
import { IToken } from '@src/types'

describe('createValueExpressionNodePattern', () => {
  test('matched', async () => {
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

    const result = await pattern(tokens)

    expect(result).toStrictEqual({
      consumed: 1
    , node: {
        nodeType: 'Identifier'
      , value: 'name:you know who'
      }
    })
  })

  describe('not matched', () => {
    test('tokens are less than needed', async () => {
      const nodeType = 'Identifier'
      const valueTokenType = 'Name'
      const transformValue = (x: string) => `name:${x}`
      const pattern = createValueExpressionNodePattern({
        nodeType
      , valueTokenType
      , transformValue
      })
      const tokens: IToken[] = []

      const result = await pattern(tokens)

      expect(result).toBe(undefined)
    })

    test('token is not matched', async () => {
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

      const result = await pattern(tokens)

      expect(result).toBe(undefined)
    })
  })
})
