import { isntFalsy } from '@blackglory/prelude'
import { IToken, INode, INodePattern } from './types'
import { matchSequence } from './match-sequence'

export interface IBinaryOperatorExpressionNode<
  NodeType extends string
, LeftNode extends INode
, RightNode extends INode
> extends INode {
  nodeType: NodeType
  left: LeftNode
  right: RightNode
}

export function createBinaryOperatorExpressionNodePattern<
  Token extends IToken
, Node extends IBinaryOperatorExpressionNode<string, LeftNode, RightNode>
, LeftNode extends INode
, RightNode extends INode
>({ nodeType, centerTokenType, rightNodePattern, leftNodePattern }: {
  nodeType: Node['nodeType']
  centerTokenType: string
  leftNodePattern: INodePattern<Token, LeftNode>
  rightNodePattern: INodePattern<Token, RightNode>
}): INodePattern<
  Token
, IBinaryOperatorExpressionNode<Node['nodeType'], Node['left'], Node['right']>
> {
  return tokens => {
    const matches = matchSequence<[INode, IToken, INode]>(
      [
        leftNodePattern as INodePattern<IToken, LeftNode>
      , centerTokenType
      , rightNodePattern as INodePattern<IToken, RightNode>
      ]
    , tokens
    )
    if (isntFalsy(matches)) {
      const [leftMatch, token, rightMatch] = matches
      return {
        consumed: leftMatch.consumed + 1 + rightMatch.consumed
      , node: {
          nodeType
        , left: leftMatch.node as Node['left']
        , right: rightMatch.node as Node['right']
        }
      }
    }
  }
}
