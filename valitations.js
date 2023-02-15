import { body } from "express-validator";

export const registerValidation = [
  body("fullName", "Имя должен быть минимум 3 символов").isLength({ min: 3 }),
  body("email", "Неверный формат почты").isEmail(),
  body("password", "Пароль должен быт между 5 и 25 символов").isLength({
    min: 5,
    max: 25,
  }),
  body("avatarUrl", "Неверная ссылка на аватарку").optional().isURL(),
];
export const loginValidation = [
  body("email", "Неверный формат почты").isEmail(),
  body("password", "Пароль должен быт между 5 и 25 символов").isLength({
    min: 5,
    max: 25,
  }),
];
export const postValidation = [
  body("title", "Заголовок должень быть мин 3 символов").isLength({ min: 3 }).isString(),
  body("text", "Текст должен быть мин 10 символов").isLength({ min: 10 }).isString(),
  body("tags", "Неверный формат тэгов (Укажите массив)").optional().isArray(),
  body("imageUrl", "Неверная ссылка на изображение").optional().isString(),
];
