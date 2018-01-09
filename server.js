// EXPRESS DEPENDANCIES
const express = require('express');
const logger = require('morgan');
const parser = require('body-parser');
const path = require('path')
const gcm = require('node-gcm')

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
    connection.broadcast.emit('message',e)
    connection.emit('message', e)

  })

  connection.on('usernameChosen', function(e){
    console.log(e + 'received from choosing username');
    connection.broadcast.emit('usernameChosen', e);
    connection.emit('usernameChosen', e);
  })

  connection.on('typing', function(e){
    console.log('recieving ', e)
    connection.broadcast.emit('typing', e)
    console.log('broadcasting ', e)
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

app.get("/", (req,res,next)=>{
  res.render(path.join(__dirname, '/public', 'index.ejs'))
})

app.get('*', (req,res,err)=>{
  if (err){
    console.log(err)
    res.send(err)
  }
})

ioServer.listen(3000);

