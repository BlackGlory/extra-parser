import { isntNull } from '@blackglory/types'
import { ITokenPattern, IToken } from './types'

export function createTokenPatternFromRegExp<T extends string>(
  tokenType: T
, regExp: RegExp
): ITokenPattern<IToken<T>> {
  const startsWithRegExp = convertToStartsWithRegExp(regExp)

  const pattern: ITokenPattern<IToken<T>> = {
    tokenType
  , match(text) {
      const result = startsWithRegExp.exec(text)
      if (isntNull(result)) {
        const [matchedText] = result
        return { consumed: matchedText.length }
      } else {
        return { consumed: 0 }
      }
    }
  }

  return pattern
}

function convertToStartsWithRegExp(re: RegExp): RegExp {
  return new RegExp(
    re.source.startsWith('^') ? re.source : `^${re.source}`
  , re.flags
  )
}
