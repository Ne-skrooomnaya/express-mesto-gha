const mongoose = require("mongoose");
const express = require("express");
const path = require("path");
const { ErrorNot, ErrorServer, ErrorBad } = require("./utils/errors");
const { CardRoutes } = require("./routes/cards");
const { UserRoutes } = require("./routes/users");
const { PORT = 3000 } = process.env;

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

app.use((req, res) => {
  req.user = {
    _id: "632e377e65f557201977c91e",
  };
});

app.use(express.json());

app.use(UserRoutes);

app.use(CardRoutes);

app.use((req, res) => {
  res.status(ErrorNot).send({ message: "Произошла ошибка" });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на ${PORT} порту`);
});

