import { assert, Falsy, isntFalsy, toArray } from '@blackglory/prelude'
import { IToken, INode, MapSequenceToPatterns, MapSequenceToMatches, INodePatternMatch } from './types'
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
): Promise<Array<Token | INodePatternMatch<Node>> | Falsy> {
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

  const results: Array<Token | INodePatternMatch<Node>> = []
  const mutableTokens = toArray(tokens)

  for (let i = 0; i < minimumRepetitions; i++) {
    const matches = await matchSequence(patterns, mutableTokens)
    if (isntFalsy(matches)) {
      handleMatches(matches)
    } else {
      return
    }
  }

  for (let i = minimumRepetitions; i < maximumRepetitions; i++) {
    const matches = await matchSequence(patterns, mutableTokens)
    if (isntFalsy(matches)) {
      handleMatches(matches)
    } else {
      break
    }
  }

  return results

  function handleMatches(
    matches: MapSequenceToMatches<Sequence, Token, Node>
  ): void {
    results.push(...matches)
    mutableTokens.splice(
      0
    , getConsumed(matches as Array<Token | INodePatternMatch<Node>>)
    )
  }
}

function getConsumed(matches: Array<IToken | INodePatternMatch<INode>>): number {
  return matches
    .map(match => 'consumed' in match ? match.consumed : 1)
    .reduce((acc, cur) => acc + cur)
}
