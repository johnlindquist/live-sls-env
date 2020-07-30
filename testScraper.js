const scraper = require("./scraper")

;(async () => {
  const url = await scraper()
  console.log(url)

  const parts = url.split("/")
  const imageName = parts[parts.length - 1].split("?")[0]
  console.log(imageName)
})()
