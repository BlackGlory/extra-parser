import { isntFalsy } from '@blackglory/prelude'
import { IToken, INodePattern, INode } from './types'

export function* parse<
  Token extends IToken<string>
, Node extends INode<string>
, NodePattern extends INodePattern<Token, Node> = INodePattern<Token, Node> 
>(
  tokens: Array<Token>
, patterns: Array<NodePattern>
): IterableIterator<Node> {
  let i = 0
  loop: while (i < tokens.length) {
    const remainingTokens = tokens.slice(i)

    for (const pattern of patterns) {
      const result = pattern(remainingTokens)
      if (isntFalsy(result)) {
        yield result.node
        i += result.consumed
        continue loop
      }
    }

    throw new Error(`Unparseable tokens: ${JSON.stringify(remainingTokens)}`)
  }
}
