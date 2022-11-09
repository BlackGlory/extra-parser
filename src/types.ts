import { Falsy } from '@blackglory/prelude'

export interface IToken<Type extends string> {
  type: Type
  value: string
}

export interface INode<Type extends string> {
  type: Type
}

export interface ITokenPatternMatch<Token extends IToken<string>> {
  consumed: number
  token: Token
}

export interface INodePatternMatch<Node extends INode<string>> {
  consumed: number
  node: Node
}

export interface ITokenPattern<Token extends IToken<string>> {
  (text: string): ITokenPatternMatch<Token> | Falsy
}

export interface INodePattern<
  Token extends IToken<string>
, Node extends INode<string>
> {
  (tokens: Array<Token>): INodePatternMatch<Node> | Falsy
}
