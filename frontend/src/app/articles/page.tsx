"use client";

import { useEffect, useMemo, useState } from "react";
import { Article } from "@/types/Article/Article";
import Link from "next/link";
import styles from "./articles.module.css";
import { useLoginData } from "@/hooks/useLoginData";
// import AuthGuard from "../components/AuthGuard";

type SortType = "updated_desc" | "updated_asc" | "created_desc" | "created_asc";

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [sortType, setSortType] = useState<SortType>("updated_desc");
  const { loginData, isLoginDataLoaded } = useLoginData();
  const token = loginData?.token;

  useEffect(() => {
    const savedSortType = window.localStorage.getItem("article_list_sort_type");
    if (
      savedSortType === "updated_desc" ||
      savedSortType === "updated_asc" ||
      savedSortType === "created_desc" ||
      savedSortType === "created_asc"
    ) {
      setSortType(savedSortType);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("article_list_sort_type", sortType);
  }, [sortType]);

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
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
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

  const sortedArticles = useMemo(() => {
    const list = [...articles];
    const parseDate = (value: string) => new Date(value).getTime();
    const compareByDate = (a: string, b: string, direction: "asc" | "desc") =>
      direction === "asc"
        ? parseDate(a) - parseDate(b)
        : parseDate(b) - parseDate(a);

    switch (sortType) {
      case "updated_asc":
        return list.sort((a, b) =>
          compareByDate(a.updated_at, b.updated_at, "asc"),
        );
      case "created_desc":
        return list.sort((a, b) =>
          compareByDate(a.created_at, b.created_at, "desc"),
        );
      case "created_asc":
        return list.sort((a, b) =>
          compareByDate(a.created_at, b.created_at, "asc"),
        );
      case "updated_desc":
      default:
        return list.sort((a, b) =>
          compareByDate(a.updated_at, b.updated_at, "desc"),
        );
    }
  }, [articles, sortType]);

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

        <div className={styles.sortRow}>
          <label htmlFor="sortType" className={styles.sortLabel}>
            並び順
          </label>
          <select
            id="sortType"
            className={styles.sortSelect}
            value={sortType}
            onChange={(e) => setSortType(e.target.value as SortType)}
          >
            <option value="updated_desc">更新日が新しい順</option>
            <option value="updated_asc">更新日が古い順</option>
            <option value="created_desc">作成日が新しい順</option>
            <option value="created_asc">作成日が古い順</option>
          </select>
        </div>

        {articles.length === 0 ? (
          <p className={styles.empty}>
            メモがありません。新規作成してください。
          </p>
        ) : (
          <div className={styles.articleList}>
            {sortedArticles.map((article) => (
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
