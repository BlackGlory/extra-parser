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

interface ITokenPattern<T extends IToken<any>> {
  tokenType: T['type']

  match: (text: string) => {
    consumed: number
  }
}

interface INodePattern<T extends INode<any>> {
  nodeType: T['type']

  parse: (tokens: Array<IToken<any>>) => {
    consumed: number
    result?: Omit<T, 'type'>
  }
}
```

### tokenize
```ts
function tokenize<T extends string>(
  patterns: Array<ITokenPattern<IToken<T>>>
, text: string
): IterableIterator<IToken<T>>
```

### parse
```ts
function parse<T extends string, U extends string>(
  patterns: Array<INodePattern<INode<T>>>
, tokens: Array<IToken<U>>
): IterableIterator<INode<T>>
```

### createTokenPatternFromRegExp
```ts
function createTokenPatternFromRegExp<T extends string>(
  tokenType: T
, regExp: RegExp
): ITokenPattern<IToken<T>>
```
