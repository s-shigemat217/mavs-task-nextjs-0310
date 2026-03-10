import UserService from "../../services/users/UserService.js";
import express from "express";

const router = express.Router();
const userService = new UserService();

/**
 * ユーザー新規登録
 */
router.post("/", async (req, res) => {
  try {
    // リクエストボディからユーザー情報を取得する
    const { name, email, password } = req.body;

    // 必須項目の入力チェック
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "name, email, password are required" });
    }

    // メールアドレスの重複チェック
    const resSearchUser = await userService.searchUser("", "", email, "");
    if (resSearchUser.length > 0) {
      return res.status(409).json({ message: "email already exists" });
    }

    // ユーザー情報を登録する
    const createdUser = await userService.createUser(name, email, password);
    res.status(201).json(createdUser);
  } catch (error) {
    console.error(error);
    // メールアドレスの重複エラーの場合は409を返却する
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ message: "email already exists" });
    }
    res.status(500).json({});
  }
});

export default router;
