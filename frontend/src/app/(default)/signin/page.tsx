import LoginForm from "../../components/LoginForm";

export default function Signin() {
  return (
    <main className="page-shell">
      <section className="basic-card">
        <h2 className="page-title">サインイン</h2>
        <p className="page-description">
          メールアドレスとパスワードを入力してください。
        </p>
        <LoginForm />
      </section>
    </main>
  );
}
