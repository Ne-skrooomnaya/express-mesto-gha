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

mongoose.connect("mongodb://localhost:27017/mestodb", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

app.use(express.json());

app.use(UserRoutes);
app.use(CardRoutes);

app.use((req, res) => {
  res.status(ErrorNot).send({ message: "Произошла ошибка" });
});

    app.use(express.static(path.join(__dirname, "public")));
    app.listen(PORT, () => {
    console.log(`Сервер запущен на ${PORT} порту`);
  });


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
