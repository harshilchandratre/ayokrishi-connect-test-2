const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: '*' } });

const users = {};

// Serve static files from the 'public' directory
app.use(express.static('public'));

app.set('view engine', 'ejs')
app.get('/', (req, res) => {
  res.render('index')
})

io.on('connection', (socket) => {
  socket.on('new-user-joined', (name) => {
    console.log('New user joined:', name);
    users[socket.id] = name;
    socket.broadcast.emit('user-joined', name);
  });

  socket.on('send-message', (message) => {
    socket.broadcast.emit('receive-message', { message: message, name: users[socket.id] });
  });

  socket.on('disconnect', () => {
    if (users[socket.id]) {
      const userName = users[socket.id];
      delete users[socket.id];
      socket.broadcast.emit('user-left', userName);
      console.log('User disconnected:', userName);
    }
  });
});

const PORT = process.env.PORT || 3001; // Use 3001 as the default port
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});