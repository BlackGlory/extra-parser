import { isntFalsy } from '@blackglory/prelude'
import { IToken, INode, INodePattern } from './types'
import { matchSequence } from './match-sequence'

export interface IUnaryOperatorExpressionNode<
  NodeType extends string
, RightNode extends INode
> extends INode {
  nodeType: NodeType
  right: RightNode
}

export function createUnaryOperatorExpressionNodePattern<
  Token extends IToken
, Node extends IUnaryOperatorExpressionNode<string, RightNode>
, RightNode extends INode
>({ leftTokenType, nodeType, rightNodePattern }: {
  nodeType: Node['nodeType']
  leftTokenType: string
  rightNodePattern: INodePattern<Token, RightNode>
}): INodePattern<
  Token
, IUnaryOperatorExpressionNode<Node['nodeType'], Node['right']>
> {
  return async tokens => {
    const matches = await matchSequence<[IToken, INode]>(
      [
        leftTokenType
      , rightNodePattern as INodePattern<IToken, RightNode>
      ]
    , tokens
    )
    if (isntFalsy(matches)) {
      const [leftToken, rightMatch] = matches
      return {
        consumed: 1 + rightMatch.consumed
      , node: {
          nodeType: nodeType
        , right: rightMatch.node as RightNode
        }
      }
    }
  }
}
