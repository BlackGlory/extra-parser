import { matchRepetitions } from '@src/match-repetitions'
import { INodePattern, IToken } from '@src/types'

describe('matchRepetitions', () => {
  test('tokens as patterns', async () => {
    const patterns = ['Token']
    const tokens: IToken[] = [
      {
        tokenType: 'Token'
      , value: 'value'
      }
    ]

    const result = await matchRepetitions(patterns, tokens)

    expect(result).toStrictEqual([
      {
        tokenType: 'Token'
      , value: 'value'
      }
    ])
  })

  test('node patterns', async () => {
    const patterns: INodePattern[] = [
      tokens => {
        if (
          tokens.length >= 2 &&
          tokens[0].tokenType === 'Token' &&
          tokens[1].tokenType === 'Token'
        ) {
          return {
            node: {
              nodeType: 'TwoToken'
            , values: [tokens[0].value, tokens[1].value]
            }
          , consumed: 2
          }
        }
      }
    ]
    const tokens: IToken[] = [
      {
        tokenType: 'Token'
      , value: '1'
      }
    , {
        tokenType: 'Token'
      , value: '2'
      }
    , {
        tokenType: 'Token'
      , value: '3'
      }
    ]

    const result = await matchRepetitions(patterns, tokens)

    expect(result).toStrictEqual([
      {
        consumed: 2
      , node: {
          nodeType: 'TwoToken'
        , values: ['1', '2']
        }
      }
    ])
  })

  describe('minimumRepetitions', () => {
    test('matches are greater than or equal to minimum repetitions', async () => {
      const patterns = ['Token']
      const tokens: IToken[] = [
        {
          tokenType: 'Token'
        , value: 'value'
        }
      ]

      const result = await matchRepetitions(patterns, tokens, {
        minimumRepetitions: 1
      })

      expect(result).toStrictEqual([
        {
          tokenType: 'Token'
        , value: 'value'
        }
      ])
    })

    test('matches are less than minimum repetitions', async () => {
      const patterns = ['Token']
      const tokens: IToken[] = [
        {
          tokenType: 'Token'
        , value: 'value'
        }
      ]

      const result = await matchRepetitions(patterns, tokens, {
        minimumRepetitions: 2
      })

      expect(result).toBe(undefined)
    })
  })

  describe('maximumRepetitions', () => {
    test('matches are less than or equal to maximum repetitions', async () => {
      const patterns = ['Token']
      const tokens: IToken[] = [
        {
          tokenType: 'Token'
        , value: 'value'
        }
      ]

      const result = await matchRepetitions(patterns, tokens, {
        maximumRepetitions: 1
      })

      expect(result).toStrictEqual([
        {
          tokenType: 'Token'
        , value: 'value'
        }
      ])
    })

    test('matches are greater than maxmium repetitions', async () => {
      const patterns = ['Token']
      const tokens: IToken[] = [
        {
          tokenType: 'Token'
        , value: 'value'
        }
      , {
          tokenType: 'Token'
        , value: 'value'
        }
      ]

      const result = await matchRepetitions(patterns, tokens, {
        maximumRepetitions: 1
      })

      expect(result).toStrictEqual([
        {
          tokenType: 'Token'
        , value: 'value'
        }
      ])
    })
  })
})
