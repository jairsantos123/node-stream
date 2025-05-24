import http from 'node:http'

const users = []
let nextId = 1

const server = http.createServer(async (req, res) => {
    const { method, url } = req

    const buffers = []

    for await (const chunk of req) {
        buffers.push(chunk)
    }

    try {
        req.body = JSON.parse(Buffer.concat(buffers).toString())
    } catch {
        req.body = null
    }

    if (method === "GET" && url === '/users') {
        return res
            .setHeader('Content-Type', 'application/json')
            .end(JSON.stringify(users))
    }

    if (method === "POST" && url === '/users') {
        const { name, email, endereco } = req.body

        users.push({
            id: nextId++,
            name,
            email,
            endereco,
        })

        return res.writeHead(201).end()
    }

    return res.writeHead(404).end()
})

server.listen(3333)