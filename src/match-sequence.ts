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
export function matchSequence<
  Sequence extends ReadonlyArray<Token | Node>
, Token extends IToken = IToken
, Node extends INode = INode
>(
  patterns: MapSequenceToPatterns<Sequence, Token, Node>
, tokens: ReadonlyArray<Token>
): MapSequenceToMatches<Sequence, Token, Node> | Falsy {
  if (isTokenTypes(patterns)) {
    const matches: Array<Token> = []

    const mutableTokens = toArray(tokens)
    for (const pattern of patterns) {
      const match = consumeToken(pattern, mutableTokens)
      if (isntFalsy(match)) {
        matches.push(match)
      } else {
        return
      }
    }

    return matches as MapSequenceToMatches<Sequence, Token, Node>
  } else if (isNodePatterns<Token, Node>(patterns)) {
    const matches: Array<INodePatternMatch<Node>> = []

    const mutableTokens = toArray(tokens)
    for (const pattern of patterns) {
      const match = consumeNode(pattern, mutableTokens)
      if (isntFalsy(match)) {
        matches.push(match)
      } else {
        return
      }
    }

    return matches as MapSequenceToMatches<Sequence, Token, Node>
  } else if (isNodePatternNodeType<Token, Node>(patterns)) {
    const [nodePattern, tokenType] = patterns

    for (
      const indexOfToken of findAllIndexes(tokens, x => x.tokenType === tokenType)
    ) {
      const leftTokens = tokens.slice(0, indexOfToken)
      const leftMatch = nodePattern(leftTokens)
      if (
        isntFalsy(leftMatch) &&
        leftMatch.consumed === indexOfToken
      ) {
        const matches: [INodePatternMatch<Node>, Token] = [
          leftMatch
        , tokens[indexOfToken]
        ]
        return matches as MapSequenceToMatches<Sequence>
      }
    }
  } else {
    const matches: Array<INodePatternMatch<Node> | Token> = []
    const remainingTokens = toArray(tokens)
    for (const subPatterns of splitPatterns(patterns)) {
      const subMatches = matchSequence(
        subPatterns as MapSequenceToPatterns<Sequence, Token, Node>
      , remainingTokens
      )
      if (isntFalsy(subMatches)) {
        const consumed = subMatches
          .map((match: Token | INodePatternMatch<Node>) => {
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

type SubPatterns<Token extends IToken = IToken, Node extends INode = INode> =
| [INodePattern<Token, Node>, string]
| NonEmptyArray<string>
| NonEmptyArray<INodePattern<Token, Node>>

/**
 * 该函数会匹配尽可能长的subPatterns.
 */
export function* splitPatterns<
  Sequence extends ReadonlyArray<Token | Node>
, Token extends IToken = IToken
, Node extends INode = INode
>(
  patterns: MapSequenceToPatterns<Sequence, Token, Node>
): IterableIterator<SubPatterns<Token, Node>> {
  const mutablePatterns: Array<INodePattern<Token, Node> | string> = toArray(patterns)

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
          INodePattern<Token, Node>
        >
      } else {
        yield mutablePatterns.splice(0, indexOfToken + 1) as [
          INodePattern<Token, Node>
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

function isNodePatterns<Token extends IToken = IToken, Node extends INode = INode>(
  arr: ReadonlyArray<unknown>
): arr is ReadonlyArray<INodePattern<Token, Node>> {
  return arr.every(isNodePattern)
}

function isNodePattern<Token extends IToken = IToken, Node extends INode = INode>(
  val: unknown
): val is INodePattern<Token, Node> {
  return isFunction(val)
}

function isNodePatternNodeType<Token extends IToken = IToken, Node extends INode = INode>(
  arr: ReadonlyArray<unknown>
): arr is readonly [INodePattern<Token, Node>, string] {
  return arr.length === 2
      && isNodePattern(arr[0])
      && isTokenType(arr[1])
}
