require("dotenv").config()
const Octokit = require("@octokit/rest")

const octokit = Octokit({ auth: process.env.GITHUB_API_TOKEN })

const fs = require("fs")

module.exports = async file => {
  console.log("file", file)
  const owner = "johnlindquist"
  const repo = "fieldofmemes"

  const message = "This is the latest meme"

  const blob = await octokit.git.createBlob({
    owner,
    repo,
    content: fs.readFileSync(`/tmp/${file}`, "base64"),
    encoding: "base64"
  })

  const blobSha = blob.data.sha

  const tree = [
    {
      path: `static/images/${
        process.env.stage
      }-${new Date().getTime()}-${file}`,
      sha: blobSha,
      mode: "100644"
    }
  ]

  const commits = await octokit.repos.listCommits({
    owner,
    repo,
    sha: "master"
  })

  const latestCommitSha = commits.data[0].sha
  const base_tree = commits.data[0].commit.tree.sha

  const treeResponse = await octokit.git.createTree({
    owner,
    repo,
    base_tree,
    tree
  })

  const treeSha = treeResponse.data.sha

  const commit = await octokit.git.createCommit({
    owner,
    repo,
    message,
    tree: treeSha,
    parents: [latestCommitSha]
  })

  const commitSha = commit.data.sha

  const updatedRef = await octokit.git.updateRef({
    owner,
    repo,
    sha: commitSha,
    ref: "heads/master"
  })
}
