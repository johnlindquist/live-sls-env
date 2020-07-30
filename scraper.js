const puppeteer = require("puppeteer")
const { getChrome } = require("./chrome-script")

module.exports = async () => {
  let chrome
  try {
    chrome = await getChrome()

    const browser = await puppeteer.connect({
      browserWSEndpoint: chrome.endpoint
    })
    console.log("after browser")
    const page = await browser.newPage()

    await page.setViewport({
      width: 800,
      height: 600,
      deviceScaleFactor: 1
    })

    await page.goto("https://www.reddit.com/r/wholesomememes/top/")

    const url = await page.evaluate(async () => {
      return document.querySelector("img[alt='Post image']").src
    })

    await browser.close()

    return url
  } catch (error) {
    readLogs(chrome.instance)
  }
}
