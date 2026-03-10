import AuthService from '../../services/auth/AuthService.js';
import UserService from '../../services/users/UserService.js';
import express from 'express';

const router = express.Router();
const userService = new UserService();
const authService = new AuthService();

/**
 * サインイン
 */
router.post('/signin', async (req, res) => {
  try {
    // リクエストパラメーター
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'email and password are required' });
    }

    // ユーザー存在チェックを行う
    const resSearchUser = await userService.searchUser({ email, password });

    // パラメータ存在しない場合は認証エラーを返却する
    if (!resSearchUser.length) {
      return res.status(401).json({ message: 'invalid credentials' });
    }

    const signedInUser = resSearchUser[0];

    // トークンを発行する
    const resCreateToken = await authService.createToken(
      signedInUser.id,
      signedInUser.email,
    );

    // 返却用データを生成
    const body = {
      email: signedInUser.email,
      token: resCreateToken,
    };

    res.status(200).json(body);
  } catch (error) {
    console.error(error);
    res.status(500).json({});
  }
});

export default router;
