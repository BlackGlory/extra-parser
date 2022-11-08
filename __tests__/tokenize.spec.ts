import { tokenize } from '@src/tokenize'
import { createTokenPatternFromRegExp } from '@src/create-token-pattern-from-regexp'
import { toArray } from '@blackglory/prelude'
import { getError } from 'return-style'

describe('tokenize', () => {
  test('all known characters', () => {
    const pattern1 = createTokenPatternFromRegExp('Alphabet', /[a-bA-B]/)
    const pattern2 = createTokenPatternFromRegExp('Number', /\d/)
    const patterns = [pattern1, pattern2]
    const text = 'a1b2'

    const result = toArray(tokenize(patterns, text))

    expect(result).toStrictEqual([
      {
        type: 'Alphabet'
      , value: 'a'
      }
    , {
        type: 'Number'
      , value: '1'
      }
    , {
        type: 'Alphabet'
      , value: 'b'
      }
    , {
        type: 'Number'
      , value: '2'
      }
    ])
  })

  test('contains unknown characters', () => {
    const pattern1 = createTokenPatternFromRegExp('Alphabet', /\d/)
    const pattern2 = createTokenPatternFromRegExp('Number', /[a-bA-B]/)
    const patterns = [pattern1, pattern2]
    const text = 'a1 b2'

    const err = getError(() => toArray(tokenize(patterns, text)))

    expect(err).toBeInstanceOf(Error)
  })

  test('match in order', () => {
    const pattern1 = createTokenPatternFromRegExp('Word', /\w/)
    const pattern2 = createTokenPatternFromRegExp('Number', /\d/)
    const patterns = [pattern1, pattern2]
    const text = 'a1'

    const result = toArray(tokenize(patterns, text))

    expect(result).toStrictEqual([
      {
        type: 'Word'
      , value: 'a'
      }
    , {
        type: 'Word'
      , value: '1'
      }
    ])
  })
})
