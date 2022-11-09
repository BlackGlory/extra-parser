# extra-parser
## Install
```sh
npm install --save extra-parser
# or
yarn add extra-parser
```

## API
```ts
interface IToken<T extends string> {
  type: T
  value: string
}

interface INode<T extends string> {
  type: T
}

interface ITokenPatternMatch<T extends IToken<string>> {
  consumed: number
  token: T
}

interface INodePatternMatch<T extends INode<string>> {
  consumed: number
  node: T
}

type TokenPattern<Token extends IToken<string>> =
  (text: string) => ITokenPatternMatch<Token> | Falsy

type NodePattern<
  Token extends IToken<string>
, Node extends INode<string>
> = (tokens: Array<Token>) => INodePatternMatch<Node> | Falsy
```

### tokenize
```ts
function tokenize<
  Token extends IToken<string>
, TokenPattern extends ITokenPattern<Token>
>(
  text: string
, patterns: Array<TokenPattern>
): IterableIterator<Token>
```

### parse
```ts
function parse<
  Token extends IToken<string>
, Node extends INode<string>
, NodePattern extends INodePattern<Token, Node>
>(
  tokens: Array<Token>
, patterns: Array<NodePattern>
): IterableIterator<Node>
```

### createTokenPatternFromRegExp
```ts
function createTokenPatternFromRegExp<TokenType extends string>(
  tokenType: TokenType
, regExp: RegExp
): TokenPattern<IToken<TokenType>>
```
