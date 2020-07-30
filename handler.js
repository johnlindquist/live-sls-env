"use strict"

debugger

require("dotenv").config()
const scraper = require("./scraper")
const debug = require("./debugHtml")
const downloader = require("image-downloader")
const push = require("./github-push")

module.exports.hello = async event => {
  const url = await scraper()
  console.log(url)

  const parts = url.split("/")
  const imageName = parts[parts.length - 1].split("?")[0]
  console.log(imageName)

  const filename = process.env.stage + "-" + imageName

  await downloader.image({
    url,
    dest: `/tmp/${filename}`
  })
  await push(filename)

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "done"
        // input: event
      },
      null,
      2
    )
  }
}
