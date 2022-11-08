import { ITokenPattern, IToken } from './types'

export function* tokenize<T extends string>(
  patterns: Array<ITokenPattern<IToken<T>>>
, text: string
): IterableIterator<IToken<T>> {
  let i = 0
  loop: while (i < text.length) {
    const remainingText = text.slice(i)

    for (const { tokenType, match } of patterns) {
      const result = match(remainingText)
      if (result.consumed > 0) {
        const token: IToken<T> = {
          type: tokenType
        , value: remainingText.slice(0, result.consumed)
        }
        yield token

        i += result.consumed
        continue loop
      }
    }

    throw new Error(`Unknown text: ${remainingText}`)
  }
}
