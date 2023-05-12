const { sortPages } = require('./report')
const { test, expect } = require('@jest/globals')

test('sortPages 2 pages', () => {
    const input = {
        'https://wagslane.dev': 3,
        'https://wagslane.dev/path': 1
    }
    const actual = sortPages(input)
    const expected = [
        ['https://wagslane.dev', 3],
        ['https://wagslane.dev/path', 1]
    ]
    expect(actual).toEqual(expected)
})
test('sortPages 5 pages', () => {
    const input = {
        'https://wagslane.dev': 3,
        'https://wagslane.dev/path': 1,
        'https://wagslane.dev/blog': 4,
        'https://wagslane.dev/gallery': 6,
        'https://wagslane.dev/lib': 2
    }
    const actual = sortPages(input)
    const expected = [
        ['https://wagslane.dev/gallery', 6],
        ['https://wagslane.dev/blog', 4],
        ['https://wagslane.dev', 3],
        ['https://wagslane.dev/lib', 2],
        ['https://wagslane.dev/path', 1],
    ]
    expect(actual).toEqual(expected)
})