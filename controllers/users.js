const User = require("../models/User");
const { ErrorServer, ErrorNot } = require("../utils/errors");


const getUsers = async (req, res) => {
  const users = await User.find({});
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch(err) {
    res.status(ErrorServer).send({ message: 'Произошла ошибка', ...err });
  }
};


const getUserId = async (req, res) => {
  const { id } = req.params;
try {
  const user = await User.findById(id);

  if(!user) {
    res.status(ErrorNot).send({ message: 'Такого пользователя не существует'});
  }
  res.status(200).send(user);
} catch(err) {
  res.status(ErrorServer).send({ message: 'Произошла ошибка c id', ...err });
}
};


const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then(user => res.send({ data: user }))
    .catch(err => res.status(ErrorBad).send({ message: 'Переданы некорректные данные при создании пользователя.', ...err }));
};


const updateUserInfo = async(req, res, next) => {
  const { name, about } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
    req.user._id,
    {name, about},
    { new: true, runValidators: true },
    );
    if (!user) {
      return res.status(ErrorNot).send({ message: 'Такого пользователя не существует'});
    }
    res.status(200).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return  res.status(ErrorBad).send({ message: 'Переданы некорректные данные при создании пользователя.', ...err });
    }
    res.status(ErrorServer).send({ message: 'Произошла ошибка', ...err });
  }
};


const updateUserAvatar = async(req, res, next) => {
  const { avatar } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
    req.user._id,
    {avatar},
    { new: true, runValidators: true },
    );
    if (!user) {
      return res.status(ErrorNot).send({ message: 'Такого пользователя не существует'});
    }
    res.status(200).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return  res.status(ErrorBad).send({ message: 'Переданы некорректные данные при создании пользователя.', ...err });
    }
    res.status(ErrorServer).send({ message: 'Произошла ошибка', ...err });
  }
};


module.exports = {
  createUser,
  getUsers,
  getUserId,
  updateUserInfo,
  updateUserAvatar,
}




//function searchResultHandler(res, user) {
  //   if (!user) {
  //     res.status(ErrorNot).send({ message: 'Такого пользователя не существует'});
  //     res.status(ErrorBad).send({ message: 'Переданы некорректные данные при создании пользователя.', ...err });
  //     res.status(ErrorServer).send({ message: 'Произошла ошибка c id', ...err });
  //   } else {
  //     res.status(200).send(user);
  //   }
  // }

  // function updateUser(req, res, next, id, data) {

  //     .then((user) => searchResultHandler(res, user))
  //     .catch(next);
  // }

// (req, res, next) => {
//   const { name, about } = req.body;
//   updateUser(req, res, next, req.user._id, { name, about });
// };
