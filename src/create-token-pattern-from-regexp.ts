import { Falsy, isntNull } from '@blackglory/prelude'
import { IToken, ITokenPattern, ITokenPatternMatch } from './types'

export function createTokenPatternFromRegExp<Token extends IToken>(
  tokenType: Token['tokenType']
, regExp: RegExp
): ITokenPattern<IToken> {
  const startsWithRegExp = convertToStartsWithRegExp(regExp)

  return (text: string): ITokenPatternMatch<IToken> | Falsy => {
    const result = startsWithRegExp.exec(text)
    if (isntNull(result)) {
      const [matchedText] = result

      if (matchedText) {
        return {
          consumed: matchedText.length
        , token: {
            tokenType: tokenType
          , value: matchedText
          }
        }
      }
    }

    return false
  }
}

function convertToStartsWithRegExp(re: RegExp): RegExp {
  return new RegExp(
    re.source.startsWith('^') ? re.source : `^${re.source}`
  , re.flags
  )
}
