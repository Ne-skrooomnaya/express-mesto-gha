

// const порт = 3000;
// const server = http.createServer ((req, res) => {
//   res.statusCode = 200;
//   res.setHeader ('Content-Type', 'text / plain');
// res.end ('Hello World');
// }) ;
// server.listen (порт, имя хоста, () => {
//   console.log (`Сервер работает по адресу http: // $ {hostname}: $ {port} /`);
// });

const express = require("express");
const mongoose = require("mongoose");
const hostname = "127.0.0.1";
const http = require ('http');


const { PORT = 3000 } = process.env;
// const PORT = 3000
const { UserRoutes } = require("./routes/users");
const { CardRoutes } = require("./routes/cards");

const { ErrorNot, ErrorServer, ErrorBad } = require("./utils/errors");

const app = express();

const server = http.createServer ((req, res) => {
    res.statusCode = 200;
    res.setHeader ('Content-Type', 'text / plain');
    res.end('hello')
  }) ;


app.use((req, res, next) => {
  req.user = {
    _id: "632e377e65f557201977c91e",
  };

  next();
});

app.use(express.json());
app.use(UserRoutes);
app.use(CardRoutes);

app.use((req, res, next) => {
  res.status(ErrorNot).send({ message: "Страница не найдена" });
});

async function main() {
  try {
    mongoose.connect("mongodb://localhost:27017/mestodb", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    server.listen(PORT, hostname, () => {
      console.log(`Сервер работает по адресу http: // ${hostname}: ${PORT} /`);
    });
  } catch (err) {
    console.log(err);
  }
}

main();

// function main() {
//   try {
//     await
//     await
//   } catch (err) {
//     console.log(err);
//   }
// }

// main();

// useCreateIndex: true,
// useFindAndModify: true,

//

//   app.use((req, res, next) => {
//     req.card = {
//       _id: ' ' // вставьте сюда _id созданного в предыдущем пункте пользователя
//     };

//   next();
// });

// app.use((req, res) => {
//   res.status(ErrorNot).send({ message: "Произошла ошибка" });
// });

// mongoose.connect("mongodb://localhost:27017/mestodb", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
