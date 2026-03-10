import Link from "next/link";
import LoginForm from "../../components/LoginForm";
import styles from "./signin.module.css";

export default function Signin() {
  return (
    <main className="page-shell">
      <section className="basic-card">
        <h2 className="page-title">サインイン</h2>
        <p className="page-description">
          メールアドレスとパスワードを入力してください。
        </p>
        <div className={styles.helperRow}>
          はじめての方は{" "}
          <Link href="/signup" className={styles.helperLink}>
            サインアップ
          </Link>
        </div>
        <LoginForm />
      </section>
    </main>
  );
}
