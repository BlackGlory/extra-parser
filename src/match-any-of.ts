import { Falsy, isntFalsy } from '@blackglory/prelude'
import { IToken, INode, INodePattern, INodePatternMatch } from './types'

/**
 * 从多个模式中依序匹配, 直到有一个匹配结果为真值, 返回该真值.
 */
export function matchAnyOf<
  Token extends IToken = IToken
, Node extends INode = INode
>(
  nodePatterns: ReadonlyArray<INodePattern<Token, Node>>
, tokens: ReadonlyArray<Token>
): INodePatternMatch<Node> | Falsy {
  for (const pattern of nodePatterns) {
    const match = pattern(tokens)
    if (isntFalsy(match)) {
      return match
    }
  }
}
