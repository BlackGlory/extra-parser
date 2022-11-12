import { isntFalsy } from '@blackglory/prelude'
import { ITokenPattern, IToken } from './types'

export async function* tokenize<Token extends IToken = IToken>(
  text: string
, patterns: Array<ITokenPattern<Token>>
): AsyncIterableIterator<Token> {
  let i = 0
  loop: while (i < text.length) {
    const remainingText = text.slice(i)

    for (const pattern of patterns) {
      const result = await pattern(remainingText)
      if (isntFalsy(result)) {
        yield result.token
        i += result.consumed
        continue loop
      }
    }

    throw new Error(`Unknown text: ${JSON.stringify(remainingText)}`)
  }
}
