"use client";

import { useEffect, useState } from "react";
import { Article } from "@/types/Article/Article";
import Link from "next/link";
import styles from "./articles.module.css";
import { useLoginData } from "@/hooks/useLoginData";
// import AuthGuard from "../components/AuthGuard";

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const { loginData, isLoginDataLoaded } = useLoginData();
  const token = loginData?.token;

  useEffect(() => {
    if (!isLoginDataLoaded) return;
    if (!token) {
      setArticles([]);
      return;
    }
    fetch("http://localhost:3001/articles", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) =>
        res.json().then((data) => ({ ok: res.ok, data })),
      )
      .then(({ ok, data }) => {
        if (!ok) {
          setArticles([]);
          return;
        }
        setArticles(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error("Error fetching articles:", err));
    return undefined;
  }, [isLoginDataLoaded, token]);

  const deleteArticle = async (id: number) => {
    if (!token) {
      alert("サインインしてください。");
      return;
    }
    // 削除の確認ダイアログを表示し、ユーザーがキャンセルした場合は処理を中断する
    if (!confirm("削除しますか？")) return;
    // API に DELETE リクエストを送信してメモを削除する
    const res = await fetch(`http://localhost:3001/articles/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // レスポンスが正常かどうかをチェックし、異常な場合はエラーメッセージを表示して処理を中断する
    if (!res.ok) {
      alert("メモの削除に失敗しました。");
      return;
    }
    // 削除が成功したらメモ一覧を更新する
    setArticles((prev) => prev.filter((article) => article.id !== id));
  };

  return (
    <main className={styles.page}>
      <section className={styles.panel}>
        <div className={styles.headerRow}>
          <h1 className={styles.title}>メモ一覧</h1>
          <Link
            href="/articles/new"
            className={`${styles.button} ${styles.buttonPrimary}`}
          >
            新規作成
          </Link>
        </div>

        {articles.length === 0 ? (
          <p className={styles.empty}>
            メモがありません。新規作成してください。
          </p>
        ) : (
          <div className={styles.articleList}>
            {articles.map((article) => (
              <article key={article.id} className={styles.articleItem}>
                <Link
                  href={`/articles/${article.id}`}
                  className={styles.articleLink}
                >
                  {article.title}
                </Link>
                <div className={styles.actions}>
                  <Link
                    href={`/articles/${article.id}/edit`}
                    className={styles.button}
                  >
                    編集
                  </Link>
                  <button
                    type="button"
                    className={`${styles.button} ${styles.buttonDanger}`}
                    onClick={() => deleteArticle(article.id)}
                  >
                    削除
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
