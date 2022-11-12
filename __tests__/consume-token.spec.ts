import { consumeToken } from '@src/consume-token'
import { IToken } from '@src/types'

describe('consumeToken', () => {
  test('consumed', () => {
    const tokens: IToken[] = [{
      tokenType: 'ConsumableToken'
    , value: 'value'
    }]

    const result = consumeToken('ConsumableToken', tokens)

    expect(tokens).toStrictEqual([])
    expect(result).toStrictEqual({
      tokenType: 'ConsumableToken'
    , value: 'value'
    })
  })

  test('not consumed', () => {
    const tokens: IToken[] = [{
      tokenType: 'ConsumableToken'
    , value: 'value'
    }]

    const result = consumeToken('UnconsumableToken', tokens)

    expect(tokens).toStrictEqual([{
      tokenType: 'ConsumableToken'
    , value: 'value'
    }])
    expect(result).toBe(undefined)
  })
})
