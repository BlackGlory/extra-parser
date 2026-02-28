import { IToken, INodePattern, INode } from './types'

export function* parse<
  Token extends IToken = IToken
, Node extends INode = INode
>(
  patterns: Array<INodePattern<Token, Node>>
, tokens: Token[]
): IterableIterator<Node> {
  let i = 0
  loop: while (i < tokens.length) {
    const remainingTokens = tokens.slice(i)

    for (const pattern of patterns) {
      const result = pattern(remainingTokens)
      if (result) {
        yield result.node
        i += result.consumed
        continue loop
      }
    }

    throw new Error(`Unparseable tokens: ${JSON.stringify(remainingTokens)}`)
  }
}
