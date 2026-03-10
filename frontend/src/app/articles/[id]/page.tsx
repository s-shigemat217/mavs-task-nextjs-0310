"use client";
import { useEffect, useState } from "react";
import { Article } from "@/types/Article/Article";
import Link from "next/link";
import styles from "@/articles/articles.module.css";
import { useLoginData } from "@/hooks/useLoginData";
import { fetchArticle } from "@/lib/articleApi";

export default function ArticleDetail({ params }: { params: { id: string } }) {
  const [article, setArticle] = useState<Article | null>(null);
  const { loginData, isLoginDataLoaded } = useLoginData();
  const token = loginData?.token;

  useEffect(() => {
    if (!isLoginDataLoaded) return;
    if (!token) {
      setArticle(null);
      return;
    }

    fetchArticle(token, params.id)
      .then((data) => {
        setArticle(data);
      })
      .catch((err) => console.error("Error fetching article:", err));
  }, [params.id, isLoginDataLoaded, token]);

  if (!article) {
    return (
      <main className={styles.page}>
        <section className={styles.panel}>
          <p className={styles.empty}>メモが見つかりませんでした。</p>
        </section>
      </main>
    );
  }

  const hasUpdatedAtDiff =
    new Date(article.updated_at).getTime() !==
    new Date(article.created_at).getTime();

  return (
    <main className={styles.page}>
      <section className={styles.panel}>
        <div className={styles.headerRow}>
          <h1 className={styles.title}>{article.title}</h1>
        </div>

        <p className={styles.content}>{article.content}</p>
        <p className={styles.meta}>
          {hasUpdatedAtDiff
            ? `更新日時: ${new Date(article.updated_at).toLocaleString()}`
            : `作成日時: ${new Date(article.created_at).toLocaleString()}`}
        </p>
        <div className={styles.actions}>
          <Link
            href={`/articles/${article.id}/edit`}
            className={`${styles.button} ${styles.buttonPrimary}`}
          >
            編集
          </Link>
          <Link href="/articles" className={styles.button}>
            一覧に戻る
          </Link>
        </div>
      </section>
    </main>
  );
}
