const http = require("http");
const hostname = "127.0.0.1";
const PORT = 3000;
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text / plain");
  res.end("Hello World");
});

const express = require("express");

const mongoose = require("mongoose");

// const { PORT = 3000 } = process.env;

const { UserRoutes } = require("./routes/users");
const { CardRoutes } = require("./routes/cards");

const { ErrorNot, ErrorServer, ErrorBad } = require("./utils/errors");

const app = express();

app.use((req, res, next) => {
  req.user = {
    _id: "632e377e65f557201977c91e",
  };

  next();
});

// mongoose.connect("mongodb://localhost:27017/mestodb", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

app.use(express.json());

app.use(UserRoutes);
app.use(CardRoutes);

// app.use((req, res) => {
//   res.status(ErrorNot).send({ message: "Произошла ошибка" });
// });

// app.listen(PORT, () => console.log(`Server started at port: ${PORT}`));

async function main() {
  try {
    await mongoose.connect("mongodb://localhost:27017/mestodb", {
      useNewUrlParser: true,
      useUnifiedTopology: false,
    });
    await server.listen(PORT, () => {
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
