const express = require("express")
const socketio = require("socket.io")
const http = require("http")
var cors = require('cors')

const PORT = process.env.PORT || 5000

const router = require("./router")

const { addUser, removeUser, getUser } = require("./helpers")

const app = express()

const server = http.createServer(app)
const io = socketio(server, {
    // cors: {
    //     origin: "*",
    //     // credentials: true
    // },
    // transports: ['polling'],
})

io.on('connection', (socket) => {
    console.log("connection!")
    socket.on('join', ({ name }, callback) => {
        console.log("join!")
        const res = addUser({ id: socket.id, name })
        console.log("res= ", res)
        if (res.error) return callback(res)
        socket.broadcast.emit('message', { user: 'admin', text: `${res.name} has joined!` })
    })

    socket.on('sendMsg', (message) => {
        const user = getUser(socket.id)
        console.log("user= ", user)
        io.emit('message', { user: user.name, text: message })
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if (user) {
            socket.broadcast.emit('message', { user: 'admin', text: `${user.name} has left!` })
        }
        console.log('user disconected!!!')
    })
})


app.use(router)
app.use(cors())

server.listen(process.env.PORT || 5000, () => {
    console.log("Server started on port " + PORT)
})

