# extra-parser
## Install
```sh
npm install --save extra-parser
# or
yarn add extra-parser
```

## API
```ts
interface IToken<Type extends string> {
  type: Type
  value: string
}

interface INode<Type extends string> {
  type: Type
}

interface ITokenPatternMatch<Token extends IToken<string>> {
  consumed: number
  token: Token
}

interface INodePatternMatch<Node extends INode<string>> {
  consumed: number
  node: Node
}

interface ITokenPattern<Token extends IToken<string>> {
  (text: string): Awaitable<ITokenPatternMatch<Token> | Falsy>
}

interface INodePattern<
  Token extends IToken<string>
, Node extends INode<string>
> {
  (tokens: ReadonlyArray<Token>): Awaitable<INodePatternMatch<Node> | Falsy>
}
```

### tokenize
```ts
function tokenize<
  Token extends IToken<string>
, TokenPattern extends ITokenPattern<Token> = ITokenPattern<Token>
>(
  text: string
, patterns: Array<TokenPattern>
): AsyncIterableIterator<Token>
```

### parse
```ts
function parse<
  Token extends IToken<string>
, Node extends INode<string>
, NodePattern extends INodePattern<Token, Node> = INodePattern<Token, Node>
>(
  tokens: Array<Token>
, patterns: Array<NodePattern>
): AsyncIterableIterator<Node>
```

### createTokenPatternFromRegExp
```ts
function createTokenPatternFromRegExp<TokenType extends string>(
  tokenType: TokenType
, regExp: RegExp
): ITokenPattern<IToken<TokenType>>
function createTokenPatternFromRegExp<Token extends IToken<string>>(
  tokenType: Token['type']
, regExp: RegExp
): ITokenPattern<IToken<Token['type']>>
```

## FAQ
### Why are functions asynchronous?
Some parsers make heavy use of recursion,
and most JavaScript engines do not support tail-call optimization,
which leads to the possibility of stack overflow in programs.

Asynchronous functions are an escape route:
developers can change recursive functions to asynchronous recursive functions
to get their programs out of stack overflow problems
without significantly reducing readability.
