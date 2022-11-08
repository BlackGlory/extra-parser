export interface IToken<T extends string> {
  type: T
  value: string
}

export interface INode<T extends string> {
  type: T
}

export interface ITokenPattern<T extends IToken<any>> {
  tokenType: T['type']

  /**
   * 当函数返回的consumed大于0时表示匹配.
   */
  match: (text: string) => {
    consumed: number
  }
}

/**
 * 节点模式是一种接口, 它提供的parse方法将被用于尝试消耗给定的IToken[].
 */
export interface INodePattern<T extends INode<any>> {
  nodeType: T['type']

  /**
   * 当函数返回的consumed大于0时表示匹配.
   */
  parse: (tokens: Array<IToken<any>>) => {
    consumed: number
    result?: Omit<T, 'type'>
  }
}
