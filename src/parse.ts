import { IToken, INodePattern, INode } from './types'

export function* parse<T extends string, U extends string>(
  patterns: Array<INodePattern<INode<T>>>
, tokens: Array<IToken<U>>
): IterableIterator<INode<T>> {
  let i = 0
  loop: while (i < tokens.length) {
    const remainingTokens = tokens.slice(i)

    for (const { nodeType, parse } of patterns) {
      const result = parse(remainingTokens)
      if (result.consumed > 0) {
        const node: INode<T> = {
          type: nodeType
        , ...result.result
        }
        yield node

        i += result.consumed
        continue loop
      }
    }

    throw new Error(`Unknown tokens: ${JSON.stringify(tokens)}`)
  }
}
