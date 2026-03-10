"use client";
import Link from "next/link";
import { useLoginData } from "../hooks/useLoginData";

export default function Home() {
  const { loginData, isLoginDataLoaded, setLoginData } = useLoginData();
  const isSignedIn = Boolean(loginData?.token);

  if (!isLoginDataLoaded) {
    return (
      <main className="page-shell">
        <section className="basic-card">
          <h2 className="page-title">ToDo Notes</h2>
          <p className="page-description">ログイン状態を確認しています。</p>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <section className="basic-card">
        {isSignedIn ? (
          <div className="page-title-row">
            <h2 className="page-title">Memo App</h2>
            <button
              type="button"
              className="quick-link"
              onClick={() => setLoginData(undefined)}
            >
              ログアウト
            </button>
          </div>
        ) : (
          <h2 className="page-title">Memo App</h2>
        )}
        {isSignedIn ? (
          <>
            <p className="page-description">
              日々のメモやタスクを記録して、必要なときに見返せます。
            </p>
            <div className="quick-links">
              <Link href="/articles" className="quick-link">
                メモ一覧を見る
              </Link>
              <Link href="/articles/new" className="quick-link">
                新しく作成する
              </Link>
            </div>
          </>
        ) : (
          <>
            <p className="page-description">
              メモ機能を使うにはサインインしてください。
            </p>
            <div className="quick-links">
              <Link href="/signin" className="quick-link">
                サインイン画面へ
              </Link>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
