const server = require('http').createServer(app)
const io = require('socket.io')(ioServer);

const socket = io.connect()

const rooms = ["first room", "second room", "third room","fourth room"]

let room = Math.floor(Math.random() * rooms.length)


