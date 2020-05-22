const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)

const port:number = 3010;

io.on('connection', (socket) => {
    const group_id = socket.handshake.query.group_id;
    console.log("GROUP: ", group_id);
    socket.join(group_id);

    socket.on('new message', (data) => {
        console.log('MSG: ', data)
        io.to(group_id).emit('new message', { message: data })
    })

    socket.on('disconnect', () => {
        console.log(`${socket.username} has disconnected`)
    })
})

http.listen(port, () => {
    console.log(`listening on *:${port}`)
})
