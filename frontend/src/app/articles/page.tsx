"use client";

import { useEffect, useMemo, useState } from "react";
import { Article } from "@/types/Article/Article";
import Link from "next/link";
import styles from "./articles.module.css";
import { useLoginData } from "@/hooks/useLoginData";
import {
  deleteArticle as deleteArticleRequest,
  fetchArticles,
} from "@/lib/articleApi";
// import AuthGuard from "../components/AuthGuard";

type SortType = "updated_desc" | "updated_asc" | "created_desc" | "created_asc";
const PAGE_SIZE = 10;

export default function ArticlesPage() {
  // メモのリストとソート・ページングの状態を管理するための state を定義
  const [articles, setArticles] = useState<Article[]>([]);
  const [sortType, setSortType] = useState<SortType>("updated_desc");
  const [currentPage, setCurrentPage] = useState(1);
  const { loginData, isLoginDataLoaded } = useLoginData();
  const token = loginData?.token;

  // コンポーネントの初回レンダリング時にローカルストレージからソートタイプを読み込む
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

  // ソートタイプが変更されたときにローカルストレージに保存する
  useEffect(() => {
    window.localStorage.setItem("article_list_sort_type", sortType);
  }, [sortType]);

  // ログイン状態が確認できた後に記事のデータを API から取得する
  useEffect(() => {
    // ログイン状態がまだ確認できていない場合は何もしない
    if (!isLoginDataLoaded) return;
    // トークンがない場合は記事のリストを空にして終了する
    if (!token) {
      setArticles([]);
      return;
    }
    // API に GET リクエストを送信して記事のデータを取得する
    fetchArticles(token)
      .then((data) => {
        setArticles(data);
      })
      .catch((err) => console.error("Error fetching articles:", err));
    return undefined;
  }, [isLoginDataLoaded, token]);

  // メモを削除するための関数を定義
  const deleteArticle = async (id: number) => {
    if (!token) {
      alert("サインインしてください。");
      return;
    }
    // 削除の確認ダイアログを表示し、ユーザーがキャンセルした場合は処理を中断する
    if (!confirm("削除しますか？")) return;
    // API に DELETE リクエストを送信してメモを削除する
    const res = await deleteArticleRequest(token, id);
    // レスポンスが正常かどうかをチェックし、異常な場合はエラーメッセージを表示して処理を中断する
    if (!res) {
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

  const totalPages = Math.ceil(sortedArticles.length / PAGE_SIZE);

  useEffect(() => {
    setCurrentPage(1);
  }, [sortType]);

  useEffect(() => {
    if (totalPages === 0) {
      if (currentPage !== 1) setCurrentPage(1);
      return;
    }
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sortedArticles.slice(start, start + PAGE_SIZE);
  }, [currentPage, sortedArticles]);

  const pageNumbers = useMemo(
    () => Array.from({ length: totalPages }, (_, index) => index + 1),
    [totalPages],
  );

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
            {paginatedArticles.map((article) => (
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

            {sortedArticles.length > PAGE_SIZE && (
              <nav
                className={styles.pagination}
                aria-label="メモ一覧のページ送り"
              >
                <button
                  type="button"
                  className={styles.pageButton}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                >
                  前へ
                </button>

                {pageNumbers.map((page) => (
                  <button
                    key={page}
                    type="button"
                    className={`${styles.pageButton} ${
                      currentPage === page ? styles.pageButtonActive : ""
                    }`}
                    onClick={() => setCurrentPage(page)}
                    aria-current={currentPage === page ? "page" : undefined}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  className={styles.pageButton}
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  次へ
                </button>
              </nav>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
