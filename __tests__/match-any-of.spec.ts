import { matchAnyOf } from '@src/match-any-of'
import { IToken, INodePattern } from '@src/types'

describe('matchAnyOf', () => {
  test('matched', () => {
    const nodePatterns: INodePattern[] = [
      jest.fn().mockReturnValue(false)
    , jest.fn(tokens => {
        if (tokens[0].tokenType === 'Foo') {
          return {
            consumed: 1
          , node: {
              nodeType: 'FooExpression'
            , value: tokens[0].value
            }
          }
        }
      })
    , jest.fn().mockReturnValue(false)
    ]
    const tokens: IToken[] = [
      {
        tokenType: 'Foo'
      , value: 'bar'
      }
    ]

    const result = matchAnyOf(nodePatterns, tokens)

    expect(result).toStrictEqual({
      consumed: 1
    , node: {
        nodeType: 'FooExpression'
      , value: 'bar'
      }
    })
    expect(nodePatterns[0]).toBeCalledTimes(1)
    expect(nodePatterns[1]).toBeCalledTimes(1)
    expect(nodePatterns[2]).not.toBeCalled()
  })

  test('not matched', () => {
    const nodePatterns: INodePattern[] = [
      jest.fn().mockReturnValue(false)
    , jest.fn(tokens => {
        if (tokens[0].tokenType === 'Foo') {
          return {
            consumed: 1
          , node: {
              nodeType: 'FooExpression'
            , value: tokens[0].value
            }
          }
        }
      })
    , jest.fn().mockReturnValue(false)
    ]
    const tokens: IToken[] = [
      {
        tokenType: 'Bar'
      , value: 'bar'
      }
    ]

    const result = matchAnyOf(nodePatterns, tokens)

    expect(result).toBe(undefined)
    expect(nodePatterns[0]).toBeCalledTimes(1)
    expect(nodePatterns[1]).toBeCalledTimes(1)
    expect(nodePatterns[2]).toBeCalledTimes(1)
  })
})
