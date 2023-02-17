import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import config from "config";
import cors from "cors";
import { register, login, getMe } from "./controllers/UserController.js";
import {
  create,
  getAll,
  getOne,
  remove,
  update,
  getLastTags,
} from "./controllers/PostController.js";
import {
  registerValidation,
  loginValidation,
  postValidation,
} from "./valitations.js";
import { checkAuth, handleValidationError } from "./utils/index.js";
const PORT = config.get("serverPort");
const app = express();

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
  destination: (a, b, callBack) => {
    callBack(null, "uploads");
  },
  filename: (a, file, callBack) => {
    callBack(null, file.originalname);
  },
});
const upload = multer({ storage });
app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({ url: `/uploads/${req.file.originalname}` });
});

app.post("/register", registerValidation, handleValidationError, register);
app.post("/login", loginValidation, handleValidationError, login);
app.get("/getMe", checkAuth, getMe);

app.get("/posts", getAll);
app.get("/posts/:id", getOne);
app.post("/posts", checkAuth, postValidation, create);
app.patch("/posts/:id", checkAuth, postValidation, update);
app.delete("/posts/:id", checkAuth, remove);

app.get("/tags", getLastTags);

const start = async () => {
  try {
    await mongoose
      .connect(config.get("dbUrl"))
      .then(() => console.log("DB is OK"));
    app.listen(PORT, () => {
      console.log("Server is running");
    });
  } catch (e) {
    console.log(e);
  }
};
start();
