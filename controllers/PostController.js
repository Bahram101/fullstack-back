import Post from "../models/Post.js";
import { validationResult } from "express-validator";

export const create = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }
    const { title, text, tags, imageUrl } = req.body;
    const doc = new Post({ title, text, tags, imageUrl, user: req.userId });
    const post = await doc.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({
      message: "Не удалось создать статью",
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const posts = await Post.find().populate("user").exec();
    return res.json(posts);
  } catch (err) {
    res.status(500).json({
      message: "Не удалось получить статьи",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;
    Post.findOneAndUpdate(
      { _id: postId },
      { $inc: { views: 1 } },
      { returnDocument: "after" },
      (err, doc) => {
        if (err) {
          return res.status(500).json({
            message: "Не удалось получить статью",
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: "Статья не найдена",
          });
        }

        res.json(doc);
      }
    ).populate("user");
  } catch (err) {
    res.status(500).json({
      message: "Не удалось получить одну статью",
    });
  }
};

export const update = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }
    const postId = req.params.id;
    const { title, text, tags, imageUrl } = req.body;

    await Post.updateOne(
      { _id: postId },
      { title, text, tags, imageUrl, user: req.userId }
    );
    res.json({message: "Успешно обнгавлена"});
  } catch (err) {
    res.status(500).json({
      message: "Не удалось изменить статью",
    });
  }
};

export const remove = (req, res) => {
  try {
    const postId = req.params.id;
    Post.findOneAndDelete({ _id: postId }, (err, doc) => {
      if (err) {
        return res.status(500).json({ message: "Статья не удалена!" });
      }
      if (!doc) {
        return res.status(404).json({ message: "Статья не найдена" });
      }
      return res.json({ message: "Статья успешно удалена" });
    });
  } catch (err) {
    res.status(500).json({
      message: "Не удалось удалить статью",
    });
  }
};
