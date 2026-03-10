// import nanoid from 'nanoid';
import db from "../../models/index.js";
import AuthService from "../auth/AuthService.js";

const authService = new AuthService();
const toUserResponse = (row) => {
  const { id, name, email } = row.get({ plain: true });
  return { id, name, email };
};

// クラス
class UserService {
  /**
   * ユーザー情報取得
   * @param ユーザーID
   * @return ユーザー情報
   */
  async getUser(user_id) {
    // ユーザーIDをキーにユーザー情報を取得する
    const row = await db.Users.findOne({ where: { id: user_id } });
    if (!row) {
      return null;
    }
    // 取得したデータを返却形式に整形して返却する
    return toUserResponse(row);
  }
  /**
   * ユーザー情報検索
   * @param 検索条件
   * @return ユーザー情報リスト
   */
  async searchUser({ id, name, email, password } = {}) {
    const where = {};
    // IDが指定されている場合はIDを条件へ追加する
    if (id) {
      where.id = id;
    }
    // 名前が指定されている場合は名前を条件へ追加する
    if (name) {
      where.name = name;
    }
    // メールアドレスが指定されている場合はメールアドレスを条件へ追加する
    if (email) {
      where.email = email;
    }
    // パスワードが指定されている場合はパスワードを条件へ追加する
    if (password) {
      const hash_password = authService.hashSha256(password);
      where.password = hash_password;
    }

    // 検索実行
    const rows = await db.Users.findAll({ where });

    // 取得したデータを返却形式に整形して格納し返却する
    return rows.map(toUserResponse);
  }

  /**
   * ユーザー新規作成
   * @param {string} name
   * @param {string} email
   * @param {string} password
   * @return {{id:number,name:string,email:string}}
   */
  async createUser(name, email, password) {
    // パスワードをハッシュ化する
    const hash_password = authService.hashSha256(password);
    // ユーザー情報を登録する
    const row = await db.Users.create({
      name,
      email,
      password: hash_password,
    });
    // 取得したデータを返却形式に整形して格納し返却する
    return toUserResponse(row);
  }
}

export default UserService;
