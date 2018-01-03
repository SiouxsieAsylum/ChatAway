// EXPRESS DEPENDANCIES
const express = require('express');
const logger = require('morgan');
const parser = require('body-parser');
const path = require('path')

const app = express();

// SOCKET DEPENDENCIES
const ioServer = require('http').createServer(app)
const socket = require('socket.io')(ioServer);

const usernames = [];

// EXPRESS MIDDLEWARE
app.use(logger('dev'))
app.use(parser.json())
app.use(parser.urlencoded({extended: false}))


socket.on('connection',function(connection){
  console.log('new connection from: ' + connection.id);
  usernames.push({username: "", connection });
  console.log('You have ' + usernames.length + ' users connected.')

  connection.on('send', function(e){
    console.log(e + 'just happened!')
    connection.emit('message', e)
  })

  connection.on('typing', function(e){
    connection.broadcast.emit('typing', e)
  })

  connection.on('disconnect', function(e){
    console.log(connection.id + " disconnected.")
    let index = usernames.indexOf(connection.id)
    usernames.splice(index, 1);
    console.log(usernames.length + ' users connected.')
  })
})

app.use(express.static(__dirname + '/public'))

// APP PORTS AND ROUTING
ioServer.listen(3000);
app.get("/", (req,res,next)=>{
  res.render(path.join(__dirname, '/public', 'index.ejs'))
})


