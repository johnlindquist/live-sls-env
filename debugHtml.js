const puppeteer = require("puppeteer")
const { getChrome } = require("./chrome-script")

module.exports = async () => {
  const chrome = await getChrome()

  const browser = await puppeteer.connect({
    browserWSEndpoint: chrome.endpoint
  })

  const page = await browser.newPage()

  await page.goto("https://www.reddit.com/r/wholesomememes/top/")

  await page.waitForSelector("img[alt='Post image']")
  const url = await page.evaluate(async () => {
    const url = document.querySelector("img[alt='Post image']").src
    return url.replace("preview", "i").split("?")[0]
  })

  await browser.close()

  return url
}
