import { assert, Falsy, isntFalsy, toArray } from '@blackglory/prelude'
import { Flatten } from 'hotypes'
import { IToken, INode, MapSequenceToPatterns, MapSequenceToMatches } from './types'
import { matchSequence } from './match-sequence'

export async function matchRepetitions<
  Sequence extends ReadonlyArray<Token | Node>
, Token extends IToken = IToken
, Node extends INode = INode
>(
  patterns: MapSequenceToPatterns<Sequence, Token, Node>
, tokens: ReadonlyArray<Token>
, {
    minimumRepetitions = 1
  , maximumRepetitions = Infinity
  }: {
    minimumRepetitions?: number
    maximumRepetitions?: number
  } = {}
): Promise<Flatten<Array<MapSequenceToMatches<Sequence, Token, Node>>> | Falsy> {
  assert(Number.isInteger(minimumRepetitions), 'The minimum repetiions must be an integer')
  assert(
    minimumRepetitions >= 0
  , 'The minimum repetitions must be greater than or equal to 0'
  )
  assert(
    Number.isInteger(maximumRepetitions) || maximumRepetitions === Infinity
  , 'The maxmium repetiions must be an integer or an Infinity'
  )
  assert(
    maximumRepetitions >= minimumRepetitions
  , 'The maximum repetitions must be greater than or equal to the minimum repetitions'
  )

  const results: Array<MapSequenceToMatches<Sequence, Token, Node>> = []
  const mutableTokens = toArray(tokens)

  for (let i = 0; i < minimumRepetitions; i++) {
    const matches = await matchSequence(patterns, mutableTokens)
    if (isntFalsy(matches)) {
      results.push(matches)
      mutableTokens.splice(0, matches.length)
    } else {
      return
    }
  }

  for (let i = minimumRepetitions; i < maximumRepetitions; i++) {
    const matches = await matchSequence(patterns, mutableTokens)
    if (isntFalsy(matches)) {
      results.push(matches)
      mutableTokens.splice(0, matches.length)
    } else {
      break
    }
  }

  return results.flat() as Flatten<Array<MapSequenceToMatches<Sequence, Token, Node>>>
}
