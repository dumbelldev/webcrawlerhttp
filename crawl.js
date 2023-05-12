const { JSDOM } = require('jsdom')

const crawlPage = async (baseURL, currentURL, pages) => {
    console.log(`Actively crawling: ${currentURL}`)

    const baseURLObj = new URL(baseURL)
    const currentURLObj = new URL(currentURL)

    if(baseURLObj.hostname !== currentURLObj.hostname) {
        return pages
    }

    const normalizedCurrentURL = normalizeURL(currentURL)
    if(pages[normalizedCurrentURL] > 0) {
        pages[normalizedCurrentURL]++
        return pages
    }

    pages[normalizedCurrentURL] = 1

    try {
        const resp = await fetch(currentURL)
        if(resp.status > 399) {
            console.log(`Error in fetch with status code: ${resp.status} on page: ${currentURL}`)
            return pages
        }
        const contentType = resp.headers.get('content-type')
        if(!contentType.includes('text/html')) {
            console.log(`Non html response, content type: ${contentType}, on page: ${currentURL}`)
            return pages
        }
        // console.log(await resp.text())
        const htmlBody = await resp.text();
        const nextURLs = getURLsFromHTML(htmlBody, baseURL)

        for(const url of nextURLs) {
            pages = await crawlPage(baseURL, url, pages)
        }
    } catch(err) {
        console.log(`Error in fetch: ${err.message}, on page ${currentURL}`)
    }

    return pages
}

const getURLsFromHTML = (htmlBody, baseURL) => {
    const urls = []
    const dom = new JSDOM(htmlBody)
    const linksEl = dom.window.document.querySelectorAll('a')
    linksEl.forEach(el => {
        if(el.href.slice(0, 1) === '/') {
            try {
                const urlObj = new URL(`${baseURL}${el.href}`)
                urls.push(urlObj.href)
            } catch(err) {
                console.log('error with relative url: ' + err.message)
            }
        } else {
            try {
              const urlObj = new URL(el.href);
              urls.push(urlObj.href);
            } catch (err) {
              console.log('error with absolute url: ' + err.message);
            }
        }
    })
    return urls
}

function normalizeURL(urlString) {
    const urlObj = new URL(urlString)
    const hostPath = `${urlObj.hostname}${urlObj.pathname}`
    if(hostPath.length > 0 && hostPath.slice(-1) === '/' ) return hostPath.slice(0, -1)
    return hostPath
}

module.exports = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage
}