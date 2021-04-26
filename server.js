const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const BodyParser = require('body-parser');
const Mongoose = require('mongoose');

const Name = require('./database/user');
const doActionFail = require('./middleware/failValidation');

const port = process.env.PORT || 8000;

// const findUser = Name.find({ name: /asd/ });

app.use(BodyParser.urlencoded({ extended: true }));
app.use(BodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/html/index.html`);
});

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    new Name({ name: msg }).save();
  });
});
async function f1() {
  const test = await Name.find({ name: /^Jacob/ }).select('-_id -__v');
  console.log(test);
}

io.on('connection', (socket) => {
  socket.on('auto complete', (msg) => {
    f1();
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
