const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const BodyParser = require('body-parser');
const Mongoose = require('mongoose');

const port = process.env.PORT || 8000;
const postUsers = require('./controller/controller');

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/html/index.html`);
});

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});

app.use(BodyParser.json());

app.post('/users', postUsers.postUser);
(async () => {
  await Mongoose.connect('mongodb+srv://admin:admin@cluster0.cgc8h.mongodb.net/Cluster0?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });

  http.listen(port, () => {
    console.log(`running with port:${port}/`);
  });
})();

// db.User.find({User: /<What they input>/}).forEach(printjson)
// $regex: ?????
