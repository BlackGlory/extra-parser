import {
  NonEmptyArray
, Falsy
, isntFalsy
, isString
, isFunction
, toArray
} from '@blackglory/prelude'
import { findAllIndexes } from 'iterable-operator'
import {
  IToken
, INode
, INodePattern
, INodePatternMatch
, MapSequenceToPatterns
, MapSequenceToMatches
} from './types'
import { consumeToken } from './consume-token'
import { consumeNode } from './consume-node'

/**
 * 模式将被拆分为以下子模式来处理:
 * - `[TokenType, ...TokenType[]]`
 * - `[NodePattern, ...NodePattern[]]`:
 *   根据NodePattern的定义, 这种子模式有可能陷入死循环.
 * - `[NodePattern, TokenType]`:
 *    这种子模式适用于二元或三元运算符这样的规则.
 *    在引擎盖下, 它首先匹配TokenType以防止NodePattern在匹配时陷入死循环.
 */
export async function matchSequence<Sequence extends ReadonlyArray<IToken | INode>>(
  patterns: MapSequenceToPatterns<Sequence>
, tokens: ReadonlyArray<IToken>
): Promise<MapSequenceToMatches<Sequence> | Falsy> {
  if (isTokenTypes(patterns)) {
    const matches: Array<IToken> = []

    const mutableTokens = toArray(tokens)
    for (const pattern of patterns) {
      const match = consumeToken(pattern, mutableTokens)
      if (isntFalsy(match)) {
        matches.push(match)
      } else {
        return
      }
    }

    return matches as MapSequenceToMatches<Sequence>
  } else if (isNodePatterns(patterns)) {
    const matches: Array<INodePatternMatch<INode>> = []

    const mutableTokens = toArray(tokens)
    for (const pattern of patterns) {
      const match = await consumeNode(pattern, mutableTokens)
      if (isntFalsy(match)) {
        matches.push(match)
      } else {
        return
      }
    }

    return matches as MapSequenceToMatches<Sequence>
  } else if (isNodePatternNodeType(patterns)) {
    const [nodePattern, tokenType] = patterns

    for (
      const indexOfToken of findAllIndexes(tokens, x => x.tokenType === tokenType)
    ) {
      const leftTokens = tokens.slice(0, indexOfToken)
      const leftMatch = await nodePattern(leftTokens)
      if (
        isntFalsy(leftMatch) &&
        leftMatch.consumed === indexOfToken
      ) {
        const matches: [INodePatternMatch<INode>, IToken] = [
          leftMatch
        , tokens[indexOfToken]
        ]
        return matches as MapSequenceToMatches<Sequence>
      }
    }
  } else {
    const matches: Array<INodePatternMatch<INode> | IToken> = []
    const remainingTokens = toArray(tokens)
    for (const subPatterns of splitPatterns(patterns)) {
      const subMatches = await matchSequence<Array<IToken | INode>>(
        subPatterns
      , remainingTokens
      )
      if (isntFalsy(subMatches)) {
        const consumed = subMatches
          .map(match => {
            return 'consumed' in match
                 ? match.consumed
                 : 1
          })
          .reduce((acc, cur) => acc + cur, 0)
        remainingTokens.splice(0, consumed)
        matches.push(...subMatches)
      } else {
        return
      }
    }
    return matches as MapSequenceToMatches<Sequence>
  }
}

type SubPatterns =
| [INodePattern<IToken, INode>, string]
| NonEmptyArray<string>
| NonEmptyArray<INodePattern<IToken, INode>>

/**
 * 该函数会匹配尽可能长的subPatterns.
 */
export function* splitPatterns<Sequence extends ReadonlyArray<IToken | INode>>(
  patterns: MapSequenceToPatterns<Sequence>
): IterableIterator<SubPatterns> {
  const mutablePatterns = toArray(patterns)

  while (mutablePatterns.length > 0) {
    if (isTokenType(mutablePatterns[0])) {
      const indexOfNodePattern = mutablePatterns.findIndex(x => isNodePattern(x))
      if (indexOfNodePattern === -1) {
        yield mutablePatterns.splice(0) as NonEmptyArray<string>
      } else {
        yield mutablePatterns.splice(0, indexOfNodePattern) as NonEmptyArray<string>
      }
    } else if (isNodePattern(mutablePatterns[0])) {
      const indexOfToken = mutablePatterns.findIndex(x => isTokenType(x))
      if (indexOfToken === -1) {
        yield mutablePatterns.splice(0) as NonEmptyArray<
          INodePattern<IToken, INode>
        >
      } else {
        yield mutablePatterns.splice(0, indexOfToken + 1) as [
          INodePattern<IToken, INode>
        , string
        ]
      }
    } else {
      throw new Error('Unknown patterns')
    }
  }
}

function isTokenTypes(arr: ReadonlyArray<unknown>): arr is ReadonlyArray<string> {
  return arr.every(isTokenType)
}

function isTokenType(val: unknown): val is string {
  return isString(val)
}

function isNodePatterns(
  arr: ReadonlyArray<unknown>
): arr is ReadonlyArray<INodePattern<IToken, INode>> {
  return arr.every(isNodePattern)
}

function isNodePattern(
  val: unknown
): val is INodePattern<IToken, INode> {
  return isFunction(val)
}

function isNodePatternNodeType(
  arr: ReadonlyArray<unknown>
): arr is readonly [INodePattern<IToken, INode>, string] {
  return arr.length === 2
      && isNodePattern(arr[0])
      && isTokenType(arr[1])
}
