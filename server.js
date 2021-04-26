const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const BodyParser = require('body-parser');
const Mongoose = require('mongoose');

const Name = require('./database/user');

const port = process.env.PORT || 8000;

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
async function f1(query) {
  const test = await Name.find({ name: { $regex: `^${query}` } }).select('-_id -__v');
  const arrayOfStrings = test.map((entry) => entry.name);
  return arrayOfStrings;
}

io.on('connection', (socket) => {
  socket.on('auto complete', (msg) => {
    const test = f1(msg);
    // console.log(test);
    test.then((result) => {
      result.sort();

      const uniqueChars = result.filter((c, index) => result.indexOf(c) === index);
      console.log(uniqueChars);
      for (let i = 0; i < uniqueChars.length; i += 1) {
        if (!(uniqueChars[i] === '')) {
          io.emit('auto complete', uniqueChars[i]);
        }
      }
    });
  });
});

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
