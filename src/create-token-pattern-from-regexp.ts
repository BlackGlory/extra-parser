import { Falsy } from '@blackglory/prelude'
import { isntNull } from '@blackglory/types'
import { IToken, ITokenPattern, ITokenPatternMatch } from './types'

export function createTokenPatternFromRegExp<TokenType extends string>(
  tokenType: TokenType
, regExp: RegExp
): ITokenPattern<IToken<TokenType>>
export function createTokenPatternFromRegExp<Token extends IToken<string>>(
  tokenType: Token['tokenType']
, regExp: RegExp
): ITokenPattern<IToken<Token['tokenType']>>
export function createTokenPatternFromRegExp(
  tokenType: string
, regExp: RegExp
): ITokenPattern<IToken<string>> {
  const startsWithRegExp = convertToStartsWithRegExp(regExp)

  return (text: string): ITokenPatternMatch<IToken<string>> | Falsy => {
    const result = startsWithRegExp.exec(text)
    if (isntNull(result)) {
      const [matchedText] = result
      return {
        consumed: matchedText.length
      , token: {
          tokenType: tokenType
        , value: matchedText
        }
      }
    } else {
      return false
    }
  }
}

function convertToStartsWithRegExp(re: RegExp): RegExp {
  return new RegExp(
    re.source.startsWith('^') ? re.source : `^${re.source}`
  , re.flags
  )
}
