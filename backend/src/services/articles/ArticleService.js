import db from "../../models/index.js";

const { Articles } = db;

// クラス
class ArticleService {
  /**
   * 記事一覧取得
   * @param user_id
   * @return ランダム値
   */
  async getArticleList(user_id) {
    const articleList = await Articles.findAll({
      where: {
        author_id: user_id,
      },
      order: [["updated_at", "DESC"]],
    });
    return articleList;
  }
  /**
   * 記事情報取得
   * @param user_id
   * @return ランダム値
   */
  async getArticle(user_id, article_id) {
    const article = await Articles.findOne({
      where: {
        id: article_id,
        author_id: user_id,
      },
    });
    return article;
  }

  // 記事新規作成
  async createArticle(user_id, title, content) {
    const article = await Articles.create({
      title: title,
      content: content,
      author_id: user_id,
    });
    return article;
  }

  // 記事更新
  async updateArticle(user_id, article_id, title, content) {
    await Articles.update(
      {
        title: title,
        content: content,
      },
      {
        where: {
          id: article_id,
          author_id: user_id,
        },
      },
    );
    // 更新後の情報を取得して返す
    return await Articles.findOne({
      where: {
        id: article_id,
        author_id: user_id,
      },
    });
  }

  // 記事削除
  async deleteArticle(user_id, article_id) {
    await Articles.destroy({
      where: {
        id: article_id,
        author_id: user_id,
      },
    });
  }
}

export default ArticleService;
