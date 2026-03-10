import express from "express";
import ArticleService from "../../services/articles/ArticleService.js";
import authenticate from "../../middleware/authenticate.js";

const router = express.Router();
const articleService = new ArticleService();
router.use(authenticate);

// 記事一覧取得
router.get("/", async (req, res) => {
  try {
    const user_id = req.user.id;
    const articleList = await articleService.getArticleList(user_id);
    res.status(200).json(articleList);
  } catch (error) {
    console.error(error);
    res.status(500).json({});
  }
});

// 記事情報取得
router.get("/:id", async (req, res) => {
  try {
    const user_id = req.user.id;
    const article_id = req.params.id;
    const article = await articleService.getArticle(user_id, article_id);

    res.json(article);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server error" });
  }
});

// メモ新規登録
router.post("/", async (req, res) => {
  try {
    const user_id = req.user.id;
    const { title, content } = req.body;

    const article = await articleService.createArticle(user_id, title, content);

    res.status(200).json(article);
  } catch (error) {
    console.error(error);
    res.status(500).json({});
  }
});

// メモ更新
router.put("/:id", async (req, res) => {
  try {
    const user_id = req.user.id;
    const article_id = req.params.id;
    const { title, content } = req.body;

    const article = await articleService.updateArticle(
      user_id,
      article_id,
      title,
      content,
    );

    res.status(200).json(article);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server error" });
  }
});

// メモ削除
router.delete("/:id", async (req, res) => {
  try {
    const user_id = req.user.id;
    const article_id = req.params.id;

    await articleService.deleteArticle(user_id, article_id);

    res.status(200).json({ message: "deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server error" });
  }
});

export default router;
