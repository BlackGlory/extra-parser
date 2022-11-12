import { consumeNode } from '@src/consume-node'
import { IToken, INodePattern } from '@src/types'

describe('consumeNode', () => {
  test('consumed', async () => {
    const tokens: IToken[] = [{
      tokenType: 'ConsumableToken'
    , value: 'value'
    }]
    const nodePattern: INodePattern = token => {
      if (token[0].tokenType === 'ConsumableToken') {
        return {
          consumed: 1
        , node: {
            nodeType: 'Node'
          , value: token[0].value
          }
        }
      }
    }

    const result = await consumeNode(nodePattern, tokens)

    expect(tokens).toStrictEqual([])
    expect(result).toStrictEqual({
      consumed: 1
    , node: {
        nodeType: 'Node'
      , value: 'value'
      }
    })
  })

  test('not consumed', async () => {
    const tokens: IToken[] = [{
      tokenType: 'UnconsumableToken'
    , value: 'value'
    }]
    const nodePattern: INodePattern = token => {
      if (token[0].tokenType === 'ConsumableToken') {
        return {
          consumed: 1
        , node: {
            nodeType: 'Node'
          , value: token[0].value
          }
        }
      }
    }

    const result = await consumeNode(nodePattern, tokens)

    expect(tokens).toStrictEqual([{
      tokenType: 'UnconsumableToken'
    , value: 'value'
    }])
    expect(result).toBe(undefined)
  })
})
