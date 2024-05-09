# extra-parser
A functional parser toolkit.

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
  (text: string): ITokenPatternMatch<Token> | Falsy
}

interface INodePattern<Token extends IToken = IToken, Node extends INode = INode> {
  (tokens: ReadonlyArray<Token>): INodePatternMatch<Node> | Falsy
}

type MapSequenceToPatterns<
  Sequence extends ReadonlyArray<Token | Node>
, Token extends IToken = IToken
, Node extends INode = INode
> = {
  [Index in keyof Sequence]:
    [Sequence[Index]] extends [infer TokenOrNode]
  ? (
      TokenOrNode extends Token
      ? string
    : TokenOrNode extends Node
      ? INodePattern<Token, TokenOrNode>
    : never
    )
  : never
}

type MapSequenceToMatches<
  Sequence extends ReadonlyArray<Token | Node>
, Token extends IToken = IToken
, Node extends INode = INode
> = {
  [Index in keyof Sequence]:
    [Sequence[Index]] extends [infer TokenOrNode]
  ? (
      TokenOrNode extends IToken
      ? Token
    : TokenOrNode extends INode
      ? INodePatternMatch<TokenOrNode>
    : never
    )
  : never
}
```

### tokenize
```ts
function tokenize<Token extends IToken = IToken>(
  patterns: Array<ITokenPattern<Token>>
, text: string
): IterableIterator<Token>
```

### parse
```ts
function parse<Token extends IToken = IToken, Node extends INode = INode>(
  patterns: Array<INodePattern<Token, Node>>
, tokens: Token[]
): IterableIterator<Node>
```

### consumeNode
```ts
function consumeNode<
  Token extends IToken = IToken
, Node extends INode = INode
>(
  nodePattern: INodePattern<Token, Node>
, tokens: Token[]
): INodePatternMatch<Node> | Falsy
```

### consumeToken
```ts
function consumeToken<Token extends IToken = IToken>(
  tokenType: string
, tokens: Token[]
): Token | Falsy
```

### matchAnyOf
```ts
function matchAnyOf<
  Token extends IToken = IToken
, Node extends INode = INode
>(
  nodePatterns: ReadonlyArray<INodePattern<Token, Node>>
, tokens: ReadonlyArray<Token>
): INodePatternMatch<Node> | Falsy
```

### matchSequence
```ts
function matchSequence<
  Sequence extends ReadonlyArray<Token | Node>
, Token extends IToken = IToken
, Node extends INode = INode
>(
  patterns: MapSequenceToPatterns<Sequence, Token, Node>
, tokens: ReadonlyArray<Token>
): MapSequenceToMatches<Sequence, Token, Node> | Falsy
```

### matchRepetitions
```ts
function matchRepetitions<
  Sequence extends ReadonlyArray<Token | Node>
, Token extends IToken = IToken
, Node extends INode = INode
>(
  patterns: MapSequenceToPatterns<Sequence, Token, Node>
, tokens: ReadonlyArray<Token>
, options?: {
    minimumRepetitions?: number = 1
    maximumRepetitions?: number = Infinity
  }
): Array<Token | INodePatternMatch<Node>> | Falsy
```

### createTokenPatternFromRegExp
```ts
function createTokenPatternFromRegExp<Token extends IToken>(
  tokenType: Token['tokenType']
, regExp: RegExp
): ITokenPattern<IToken>
```

### createUnaryOperatorExpressionNodePattern
```ts
interface IUnaryOperatorExpressionNode<
  NodeType extends string
, RightNode extends INode
> extends INode {
  nodeType: NodeType
  right: RightNode
}

function createUnaryOperatorExpressionNodePattern<
  Token extends IToken
, Node extends IUnaryOperatorExpressionNode<string, RightNode>
, RightNode extends INode
>(params: {
  nodeType: Node['nodeType']
  leftTokenType: string
  rightNodePattern: INodePattern<Token, RightNode>
}): INodePattern<
  Token
, IUnaryOperatorExpressionNode<Node['nodeType'], Node['right']>
>
```

### createBinaryOperatorExpressionNodePattern
```ts
interface IBinaryOperatorExpressionNode<
  NodeType extends string
, LeftNode extends INode
, RightNode extends INode
> extends INode {
  nodeType: NodeType
  left: LeftNode
  right: RightNode
}

function createBinaryOperatorExpressionNodePattern<
  Token extends IToken
, Node extends IBinaryOperatorExpressionNode<string, LeftNode, RightNode>
, LeftNode extends INode
, RightNode extends INode
>(params: {
  nodeType: Node['nodeType']
  centerTokenType: string
  leftNodePattern: INodePattern<Token, LeftNode>
  rightNodePattern: INodePattern<Token, RightNode>
}): INodePattern<
  Token
, IBinaryOperatorExpressionNode<Node['nodeType'], Node['left'], Node['right']>
>
```

### createGroupedExpressionNodePattern
```ts
function createGroupedExpressionNodePattern<
  Token extends IToken
, CenterNode extends INode
>(params: {
  leftTokenType: string
  rightTokenType: string
  centerNodePattern: INodePattern<Token, CenterNode>
}): INodePattern<Token, CenterNode>
```

### createValueExpressionNodePattern
```ts
interface IValueExpressionNode<
  NodeType extends string
, Value
> extends INode {
  nodeType: NodeType
  value: Value
}

function createValueExpressionNodePattern<
  Token extends IToken
, Node extends IValueExpressionNode<string, Value>
, Value
>(params: {
  nodeType: Node['nodeType']
  valueTokenType: string
  transformValue: (value: string) => Value
}): INodePattern<Token, IValueExpressionNode<Node['nodeType'], Node['value']>>
```
