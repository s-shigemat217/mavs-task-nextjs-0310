"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "@/articles/articles.module.css";

export default function NewArticle() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const createArticle = async (nextTitle: string, nextContent: string) => {
    await fetch("http://localhost:3001/articles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: nextTitle, content: nextContent }),
    });
    router.push("/articles");
  };

  return (
    <main className={styles.page}>
      <section className={styles.panel}>
        <div className={styles.headerRow}>
          <h1 className={styles.title}>メモ作成</h1>
          <Link
            href="/articles"
            className={`${styles.button} ${styles.buttonPrimary}`}
          >
            一覧へ戻る
          </Link>
        </div>
        <form
          className={styles.form}
          onSubmit={async (e) => {
            e.preventDefault();
            const trimmedTitle = title.trim();
            const trimmedContent = content.trim();

            if (!trimmedTitle || !trimmedContent) {
              setError("タイトルと本文は必須です。");
              return;
            }

            setError("");
            await createArticle(trimmedTitle, trimmedContent);
          }}
        >
          <div className={styles.field}>
            <label htmlFor="new-title" className={styles.label}>
              タイトル
            </label>
            <input
              id="new-title"
              className={styles.input}
              placeholder="タイトルを入力"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="new-content" className={styles.label}>
              本文
            </label>
            <textarea
              id="new-content"
              className={styles.textarea}
              placeholder="本文を入力"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className={`${styles.button} ${styles.buttonPrimary}`}
          >
            保存
          </button>
        </form>
      </section>
    </main>
  );
}
