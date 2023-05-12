const { normalizeURL, getURLsFromHTML } = require('./crawl.js')
const { test, expect } = require('@jest/globals')

test('normalizeURL strip protocol', () => {
    const input = 'https://blog.boot.dev/path'
    const actual = normalizeURL(input)
    const expected = 'blog.boot.dev/path';
    expect(actual).toEqual(expected)
})
test('normalizeURL strip trailing slash', () => {
    const input = 'https://blog.boot.dev/path/'
    const actual = normalizeURL(input)
    const expected = 'blog.boot.dev/path';
    expect(actual).toEqual(expected)
})
test('normalizeURL capitals', () => {
    const input = 'https://Blog.boot.dev/path'
    const actual = normalizeURL(input)
    const expected = 'blog.boot.dev/path';
    expect(actual).toEqual(expected)
})
test('normalizeURL strip http', () => {
    const input = 'http://Blog.boot.dev/path'
    const actual = normalizeURL(input)
    const expected = 'blog.boot.dev/path';
    expect(actual).toEqual(expected)
})

test('getURLsFromHTML absolute', () => {
    const inputHTMLBody = `
    <html>
        <body>
            <h1>Hi, here's a link</h1>
            <a href="https://blog.boot.dev/path" >Boot.dev blog page</a>
        </body>
    </html>
    `;
    const inputBaseURL = 'https://blog.boot.dev/path';
    const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL)
    const expected = ['https://blog.boot.dev/path'];
    expect(actual).toEqual(expected)
})
test('getURLsFromHTML relative', () => {
    const inputHTMLBody = `
    <html>
        <body>
            <h1>Hi, here's a link</h1>
            <a href="/path/" >Boot.dev blog page</a>
        </body>
    </html>
    `;
    const inputBaseURL = 'https://blog.boot.dev';
    const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL)
    const expected = ['https://blog.boot.dev/path/'];
    expect(actual).toEqual(expected)
})
test('getURLsFromHTML both', () => {
    const inputHTMLBody = `
    <html>
        <body>
            <h1>Hi, here's a link</h1>
            <a href="https://blog.boot.dev/path1/" >Boot.dev blog page</a>
            <a href="/path2/" >Boot.dev blog page</a>
        </body>
    </html>
    `;
    const inputBaseURL = 'https://blog.boot.dev';
    const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL)
    const expected = ['https://blog.boot.dev/path1/', 'https://blog.boot.dev/path2/'];
    expect(actual).toEqual(expected)
})
test('getURLsFromHTML invalid', () => {
  const inputHTMLBody = `
    <html>
        <body>
            <h1>Hi, here's a link</h1>
            <a href="invalid" >Invalid URL</a>
        </body>
    </html>
    `;
  const inputBaseURL = 'https://blog.boot.dev';
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expected = [];
  expect(actual).toEqual(expected);
});