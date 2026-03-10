"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../../articles.module.css";
import { useLoginData } from "@/hooks/useLoginData";
import {
  fetchArticle,
  updateArticle as updateArticleRequest,
} from "@/lib/articleApi";

export default function EditArticle({ params }: { params: { id: string } }) {
  // router.push() を使うために useRouter を呼び出す
  const router = useRouter();
  const { loginData, isLoginDataLoaded } = useLoginData();
  const token = loginData?.token;

  // フォームの入力値を管理するための state を用意
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // コンポーネントがマウントされたときにメモのデータを取得してフォームにセットする
  useEffect(() => {
    if (!isLoginDataLoaded || !token) return;

    fetchArticle(token, params.id).then((data) => {
      if (!data) return;
      setTitle(data.title);
      setContent(data.content);
    });
  }, [params.id, isLoginDataLoaded, token]);

  // 更新ボタンがクリックされたときに呼び出される関数
  const updateArticle = async () => {
    if (!token) return;

    const response = await updateArticleRequest(token, params.id, {
      title,
      content,
    });
    if (!response) return;

    // 更新が成功したらメモ一覧ページに遷移する
    router.push("/articles");
  };

  return (
    <main className={styles.page}>
      <section className={styles.panel}>
        <div className={styles.headerRow}>
          <h1 className={styles.title}>メモ編集</h1>
          <Link
            href="/articles"
            className={`${styles.button} ${styles.metaLink}`}
          >
            一覧へ戻る
          </Link>
        </div>

        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            updateArticle();
          }}
        >
          <div className={styles.field}>
            <label htmlFor="edit-title" className={styles.label}>
              タイトル
            </label>
            <input
              id="edit-title"
              className={styles.input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="edit-content" className={styles.label}>
              本文
            </label>
            <textarea
              id="edit-content"
              className={styles.textarea}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className={`${styles.button} ${styles.buttonPrimary}`}
          >
            更新
          </button>
        </form>
      </section>
    </main>
  );
}
