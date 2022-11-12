import { Falsy, Awaitable } from '@blackglory/prelude'

export interface IToken {
  tokenType: string
  value: string
}

export interface INode {
  nodeType: string
}

export interface ITokenPatternMatch<Token extends IToken> {
  consumed: number
  token: Token
}

export interface INodePatternMatch<Node extends INode> {
  consumed: number
  node: Node
}

export interface ITokenPattern<Token extends IToken = IToken> {
  (text: string): Awaitable<ITokenPatternMatch<Token> | Falsy>
}

export interface INodePattern<
  Token extends IToken = IToken
, Node extends INode = INode
> {
  (tokens: ReadonlyArray<Token>): Awaitable<INodePatternMatch<Node> | Falsy>
}
