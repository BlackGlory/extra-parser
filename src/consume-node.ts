import { Falsy, isntFalsy } from '@blackglory/prelude'
import { IToken, INode, INodePattern, INodePatternMatch } from './types'

/**
 * 尝试匹配node, 如果成功, 则消耗掉相应的token.
 * 
 * @param tokens 匹配成功时会发生原地修改
 */
export function consumeNode<
  Token extends IToken = IToken
, Node extends INode = INode
>(
  nodePattern: INodePattern<Token, Node>
, tokens: Token[]
): INodePatternMatch<Node> | Falsy {
  const match = nodePattern(tokens)

  if (isntFalsy(match)) {
    tokens.splice(0, match.consumed)
    return match
  }
}
