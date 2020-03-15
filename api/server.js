const express = require('express')
const postRouter = require('../router/postRouter')
const server = express()

server.use(express.json())
server.use('/api/posts', postRouter)

server.get('/', (req, res) => {
	res.send(`
      <h2>Kara's Project</h>
      <p>Node 2 API Project</p>
    `)
})

module.exports = server
