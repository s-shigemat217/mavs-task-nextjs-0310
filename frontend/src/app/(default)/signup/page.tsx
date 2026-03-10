import SignupForm from "../../components/SignupForm";

export default function Signup() {
	return (
		<main className="page-shell">
			<section className="basic-card">
				<h2 className="page-title">サインアップ</h2>
				<p className="page-description">
					ユーザー名、メールアドレス、パスワードを入力してください。
				</p>
				<SignupForm />
			</section>
		</main>
	);
}
