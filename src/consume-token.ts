import { Falsy } from '@blackglory/prelude'
import { IToken } from './types'

/**
 * 尝试匹配token, 如果成功, 则消耗掉相应的token.
 * 
 * @param tokens 匹配成功时会发生原地修改
 */
export function consumeToken<Token extends IToken = IToken>(
  tokenType: string
, tokens: Token[]
): Token | Falsy {
  const firstToken: IToken | undefined = tokens[0]
  
  if (firstToken && firstToken.tokenType === tokenType) {
    tokens.shift()
    return firstToken as Token
  }
}
