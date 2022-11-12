import { matchRepetitions } from '@src/match-repetitions'
import { IToken } from '@src/types'

describe('matchRepetitions', () => {
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
