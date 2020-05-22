const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)

const port:number = 3010;

io.on('connection', client => {
    let addedUser = false

    client.on('new user', username => {
        if (addedUser) return

        client.username = username
        addedUser = true
        console.log(`${client.username} joined`)
        client.broadcast.emit('user join', { username: client.username })
    })

    client.on('new message', data => {
        console.log('MSG: ', data)
        io.emit('new message', { message: data })
    })

    client.on('disconnect', () => {
        console.log(`${client.username} has disconnected`)
    })
})

http.listen(port, () => {
    console.log(`listening on *:${port}`)
})
