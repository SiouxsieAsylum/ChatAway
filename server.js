const express = require('express');
const socket = require('socket.io');
const logger = require('morgan');
const parser = require('body-parser');

const app = express();

app.use(logger('dev'))

app.use(parser.json())
app.use(parser.urlencoded({extended: false}))

app.listen(3000);

app.get("/", (req,res,next)=>{
  res.send('hi')
})


