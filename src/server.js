const express = require('express');
const routes = require('./routes');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const socketio = require('socket.io');
const http = require('http');

const app = express();
const server = http.Server(app);
const io = socketio(server);

mongoose.connect(
  'mongodb://localhost:27017/omnistack9',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  function(err) {
    if (err) console.log('### error while conecting to database');
  }
);

const connectedUsers = {};

io.on('connection', socket => {
  console.log('Usuário conectado', socket.id);

  const { userid } = socket.handshake.query;
  console.log('userid:::', userid);
  connectedUsers[userid] = socket.id;
  console.log(connectedUsers);
});

app.use((req, res, next) => {
  req.io = io;
  req.connectedUsers = connectedUsers;
  return next();
});

app.use(cors());
app.use(express.json());
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')));
app.use(routes);

server.listen(3333);
