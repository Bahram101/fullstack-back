import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "config";
import User from "../models/User.js";

export const register = async (req, res) => {
  try {
    const { fullName, email, avatarUrl } = req.body;
    const pswrd = req.body.password;
    const user = await User.findOne({ email });

    if (user) {
      return res
        .status(400)
        .json({ message: `User with email ${email} already exist` });
    }

    const salt = await bcrypt.genSalt(15);
    const hash = await bcrypt.hash(pswrd, salt);
    const doc = new User({
      fullName,
      email,
      password: hash,
      avatarUrl,
    });

    const newUser = await doc.save();

    const token = jwt.sign(
      {
        id: newUser._id,
      },
      config.get("secretKey"),
      {
        expiresIn: "24h",
      }
    );

    const { password, ...userData } = newUser._doc;

    res.json({ ...userData, token });
  } catch (err) {
    res.status(500).json({
      message: "Не удаслоь зарегистрироваться!",
    });
  }
};

export const login = async (req, res) => {
  try {
    const email = req.body.email;
    const pswrd = req.body.password;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ mes: "Пользователь не найден" });
    }
    const isValidPass = await bcrypt.compare(pswrd, user.password);
    if (!isValidPass) {
      return res.status(400).json({ mes: "Неверный логин или пароль!" });
    }
    const token = jwt.sign({ id: user._id }, config.get("secretKey"), {
      expiresIn: "24h",
    });
    const { password, ...userData } = user._doc;
    res.json({ ...userData, token });
  } catch (err) {
    res.status(500).json({ mes: "Не удалось авторизоваться!" });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }
    const { password, ...userData } = user._doc;
    return res.json(userData);
  } catch (err) {
    res.status(403).json({ message: "Нет доступа" });
  }
};
