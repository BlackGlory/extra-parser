import { ITokenPattern, IToken } from './types'

export function* tokenize<Token extends IToken = IToken>(
  patterns: Array<ITokenPattern<Token>>
, text: string
): IterableIterator<Token> {
  let i = 0
  loop: while (i < text.length) {
    const remainingText = text.slice(i)

    for (const pattern of patterns) {
      const result = pattern(remainingText)
      if (result) {
        yield result.token
        i += result.consumed
        continue loop
      }
    }

    throw new Error(`Unknown text: ${JSON.stringify(remainingText)}`)
  }
}
