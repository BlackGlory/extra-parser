import { tokenize } from '@src/tokenize'
import { createTokenPatternFromRegExp } from '@src/create-token-pattern-from-regexp'
import { toArrayAsync } from '@blackglory/prelude'
import { getErrorPromise } from 'return-style'

describe('tokenize', () => {
  test('all known characters', async () => {
    const pattern1 = createTokenPatternFromRegExp('Alphabet', /[a-bA-B]/)
    const pattern2 = createTokenPatternFromRegExp('Number', /\d/)
    const patterns = [pattern1, pattern2]
    const text = 'a1b2'

    const result = await toArrayAsync(tokenize(patterns, text))

    expect(result).toStrictEqual([
      {
        tokenType: 'Alphabet'
      , value: 'a'
      }
    , {
        tokenType: 'Number'
      , value: '1'
      }
    , {
        tokenType: 'Alphabet'
      , value: 'b'
      }
    , {
        tokenType: 'Number'
      , value: '2'
      }
    ])
  })

  test('contains unknown characters', async () => {
    const pattern1 = createTokenPatternFromRegExp('Alphabet', /\d/)
    const pattern2 = createTokenPatternFromRegExp('Number', /[a-bA-B]/)
    const patterns = [pattern1, pattern2]
    const text = 'a1 b2'

    const err = await getErrorPromise(toArrayAsync(tokenize(patterns, text)))

    expect(err).toBeInstanceOf(Error)
  })

  test('match in order', async () => {
    const pattern1 = createTokenPatternFromRegExp('Word', /\w/)
    const pattern2 = createTokenPatternFromRegExp('Number', /\d/)
    const patterns = [pattern1, pattern2]
    const text = 'a1'

    const result = await toArrayAsync(tokenize(patterns, text))

    expect(result).toStrictEqual([
      {
        tokenType: 'Word'
      , value: 'a'
      }
    , {
        tokenType: 'Word'
      , value: '1'
      }
    ])
  })
})
