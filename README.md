# extra-parser
## Install
```sh
npm install --save extra-parser
# or
yarn add extra-parser
```

## API
```ts
interface IToken {
  tokenType: string
  value: string
}

interface INode {
  nodeType: string
}

interface ITokenPatternMatch<Token extends IToken> {
  consumed: number
  token: Token
}

interface INodePatternMatch<Node extends INode> {
  consumed: number
  node: Node
}

interface ITokenPattern<Token extends IToken = IToken> {
  (text: string): Awaitable<ITokenPatternMatch<Token> | Falsy>
}

interface INodePattern<Token extends IToken = IToken, Node extends INode = INode> {
  (tokens: ReadonlyArray<Token>): Awaitable<INodePatternMatch<Node> | Falsy>
}
```

### tokenize
```ts
function tokenize<Token extends IToken = IToken>(
  text: string
, patterns: Array<ITokenPattern<Token>>
): AsyncIterableIterator<Token>
```

### parse
```ts
function parse<Token extends IToken = IToken, Node extends INode = INode>(
  tokens: Token[]
, patterns: Array<INodePattern<Token, Node>>
): AsyncIterableIterator<Node>
```

### createTokenPatternFromRegExp
```ts
function createTokenPatternFromRegExp<Token extends IToken>(
  tokenType: Token['tokenType']
, regExp: RegExp
): ITokenPattern<IToken>
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
