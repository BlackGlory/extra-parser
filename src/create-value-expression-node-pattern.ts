import { isntFalsy, toArray } from '@blackglory/prelude'
import { consumeToken } from './consume-token'
import { IToken, INode, INodePattern } from './types'

export interface IValueExpressionNode<
  NodeType extends string
, Value
> extends INode {
  nodeType: NodeType
  value: Value
}

export function createValueExpressionNodePattern<
  Token extends IToken
, Node extends IValueExpressionNode<string, Value>
, Value
>({ valueTokenType, nodeType, transformValue }: {
  nodeType: Node['nodeType']
  valueTokenType: string
  transformValue: (value: string) => Value
}): INodePattern<Token, IValueExpressionNode<Node['nodeType'], Node['value']>> {
  return tokens => {
    const mutableTokens = toArray(tokens)

    const token = consumeToken(valueTokenType, mutableTokens)
    if (isntFalsy(token)) {
      return {
        consumed: 1
      , node: {
          nodeType
        , value: transformValue(token.value)
        }
      }
    }
  }
}
