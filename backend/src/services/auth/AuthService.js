import jwt from 'jsonwebtoken';
import config from '../../config/jwt-config.js';
import crypto from 'crypto';

// AuthServiceクラス
class AuthService {
  /**
   * パスワードをSHA-256でハッシュ化する
   * @param params
   */
  hashSha256(string) {
    const hash = crypto.createHash('sha256');
    hash.update(string);
    return hash.digest('hex');
  }

  /**
   * jwtトークン発行
   * @param params
   */
  createToken(user_id, email) {
    const payload = {
      id: user_id,
      user_id: user_id,
      email: email,
    };
    const token = jwt.sign(payload, config.jwt.secret, config.jwt.options);
    return token;
  }

  /**
   * jwtトークンチェック
   * @param params
   */
  checkToken(token) {
    const decoded = jwt.verify(token, config.jwt.secret);
    return decoded;
  }
}

export default AuthService;
