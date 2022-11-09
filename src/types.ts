import { Falsy } from '@blackglory/prelude'

export interface IToken<T extends string> {
  type: T
  value: string
}

export interface INode<T extends string> {
  type: T
}

export interface ITokenPatternMatch<T extends IToken<string>> {
  consumed: number
  token: T
}

export interface INodePatternMatch<T extends INode<string>> {
  consumed: number
  node: T
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
