const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const BodyParser = require('body-parser');
const Mongoose = require('mongoose');

const Name = require('./database/user');

const port = process.env.PORT || 8000;
const postUsers = require('./controller/controller');
const tryAction = require('./middleware/failValidation');

// const findUser = Name.find({ name: /asd/ });

const db = Mongoose.connection;

app.use(BodyParser.json());

// db.user.find({ User: /<What they input>/ }).forEach(printjson);
app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/html/index.html`);
});

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    new Name({ name: msg }).save();
  });
});

io.on('connection', (socket) => {
  socket.on('auto complete', (msg) => {
    io.emit('auto complete', msg);
  });
});

// create another io.on('connection'
// print db.user.find({ User: /<What they input>/ }).forEach(printjson);
// then ur done
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
