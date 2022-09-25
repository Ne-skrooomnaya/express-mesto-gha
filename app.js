const express = require("express");

const mongoose = require("mongoose");

const path = require("path");

const { PORT = 3000 } = process.env;

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

app.use(express.json());

app.use(UserRoutes);
app.use(CardRoutes);

app.use((req, res) => {
  res.status(ErrorNot).send({ message: "Произошла ошибка" });
});

async function main() {
  try {
    await mongoose.connect("mongodb://localhost:27017/mestodb", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await app.listen(PORT);
    console.log(`Сервер запущен на ${PORT} порту`);
  } catch (err) {
    console.log(err);
  }
}

main();

// useCreateIndex: true,
// useFindAndModify: true,

// app.use(express.static(path.join(__dirname, "public")));

//   app.use((req, res, next) => {
//     req.card = {
//       _id: ' ' // вставьте сюда _id созданного в предыдущем пункте пользователя
//     };

//   next();
// });
