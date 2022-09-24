const express = require("express");

const mongoose = require("mongoose");

const path = require("path");



const { PORT = 3000 } = process.env;

const { UserRoutes } = require("./routes/users");
const { CardRoutes } = require("./routes/cards");

const {
  ErrorNot,
  ErrorServer,
  ErrorBad,
} = require('./utils/errors')

const app = express();




app.use(express.static(path.join(__dirname, "public")));

app.use("/", (req, res, next) => {
  console.log(req.method, req.url);
  next();
});




app.use((req, res, next) => {
  req.user = {
    _id: '632e377e65f557201977c91e' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

//   app.use((req, res, next) => {
//     req.card = {
//       _id: ' ' // вставьте сюда _id созданного в предыдущем пункте пользователя
//     };

//   next();
// });

app.use(UserRoutes);
app.use(CardRoutes);

async function main() {
  try {
    mongoose.connect("mongodb://localhost:27017/mestodb", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true,
      // useFindAndModify: true,
    });
  } catch (e) {
    return res.status(ErrorServer).send({ message: "Произошла ошибка" });
  }

  app.listen(PORT);
  console.log(`Сервер запущен на ${PORT} порту`);
}

main();
