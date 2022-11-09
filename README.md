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
, TokenPattern extends ITokenPattern<Token> = ITokenPattern<Token>
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
, NodePattern extends INodePattern<Token, Node> = INodePattern<Token, Node> 
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
): ITokenPattern<IToken<TokenType>>
function createTokenPatternFromRegExp<Token extends IToken<string>>(
  tokenType: Token['type']
, regExp: RegExp
): ITokenPattern<IToken<Token['type']>>
```
