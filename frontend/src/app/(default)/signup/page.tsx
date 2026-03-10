import Link from "next/link";
import SignupForm from "../../components/SignupForm";
import styles from "./signup.module.css";

export default function Signup() {
  return (
    <main className="page-shell">
      <section className="basic-card">
        <h2 className="page-title">サインアップ</h2>
        <div className={styles.helperRow}>
          登録済みの方は{" "}
          <Link href="/signin" className={styles.helperLink}>
            サインインへ進む
          </Link>
        </div>
        <SignupForm />
      </section>
    </main>
  );
}
