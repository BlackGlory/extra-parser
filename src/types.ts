import { Falsy, Awaitable } from '@blackglory/prelude'

export interface IToken<TokenType extends string> {
  tokenType: TokenType
  value: string
}

export interface INode<NodeType extends string> {
  nodeType: NodeType
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
  (text: string): Awaitable<ITokenPatternMatch<Token> | Falsy>
}

export interface INodePattern<
  Token extends IToken<string>
, Node extends INode<string>
> {
  (tokens: ReadonlyArray<Token>): Awaitable<INodePatternMatch<Node> | Falsy>
}
