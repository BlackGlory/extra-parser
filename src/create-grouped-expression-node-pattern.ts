import { isntFalsy } from '@blackglory/prelude'
import { IToken, INode, INodePattern } from './types'
import { matchSequence } from './match-sequence'

export function createGroupedExpressionNodePattern<
  Token extends IToken
, CenterNode extends INode
>({ leftTokenType, rightTokenType, centerNodePattern }: {
  leftTokenType: string
  rightTokenType: string
  centerNodePattern: INodePattern<Token, CenterNode>
}): INodePattern<Token, CenterNode> {
  return async tokens => {
    const matches = await matchSequence<[IToken, INode, IToken]>(
      [
        leftTokenType
      , centerNodePattern as INodePattern<IToken, CenterNode>
      , rightTokenType
      ]
    , tokens
    )
    if (isntFalsy(matches)) {
      const [leftToken, nodeMatch, rightToken] = matches
      return {
        consumed: 1 + nodeMatch.consumed + 1
      , node: nodeMatch.node as CenterNode
      }
    }
  }
}
