"use client";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { SignupRequest } from "@/types/Signup/SignupRequest";
import { SignupResponse } from "@/types/Signup/SignupResponse";
import styles from "@/articles/articles.module.css";

export default function SignupForm() {
	const [signupError, setSignupError] = useState("");
	const [signedUpUser, setSignedUpUser] = useState<SignupResponse | undefined>(
		undefined,
	);
	const { register, handleSubmit, reset } = useForm<SignupRequest>();

	const onSubmit = handleSubmit(async (request: SignupRequest) => {
		setSignupError("");
		setSignedUpUser(undefined);

		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: request.name,
					email: request.email,
					password: request.password,
				}),
			});

			if (response.status === 201) {
				const data: SignupResponse = await response.json();
				setSignedUpUser(data);
				reset();
				return;
			}

			if (response.status === 409) {
				setSignupError("このメールアドレスは既に登録されています。");
				return;
			}

			if (response.status === 400) {
				setSignupError("入力内容を確認してください。");
				return;
			}

			setSignupError("登録に失敗しました。時間をおいて再度お試しください。");
		} catch {
			setSignupError("通信エラーが発生しました。時間をおいて再度お試しください。");
		}
	});

	if (signedUpUser) {
		return (
			<div>
				<p className="page-description">
					ユーザー登録が完了しました（{signedUpUser.email}）。
				</p>
				<div className="quick-links">
					<Link href="/signin" className="quick-link">
						サインインへ進む
					</Link>
				</div>
			</div>
		);
	}

	return (
		<>
			<p className="page-description">
				ユーザー名、メールアドレス、パスワードを入力してください。
			</p>
			<form className={styles.form} onSubmit={onSubmit}>
				<div className={styles.field}>
					<label htmlFor="signup-name" className={styles.label}>
						ユーザー名
					</label>
					<input
						id="signup-name"
						className={styles.input}
						{...register("name")}
						type="text"
						placeholder="your name"
						required
					/>
				</div>
				<div className={styles.field}>
					<label htmlFor="signup-email" className={styles.label}>
						メールアドレス
					</label>
					<input
						id="signup-email"
						className={styles.input}
						{...register("email")}
						type="email"
						placeholder="you@example.com"
						required
					/>
				</div>
				<div className={styles.field}>
					<label htmlFor="signup-password" className={styles.label}>
						パスワード
					</label>
					<input
						id="signup-password"
						className={styles.input}
						{...register("password")}
						type="password"
						required
					/>
				</div>
				{signupError && (
					<p className={styles.error} role="alert">
						{signupError}
					</p>
				)}
				<button
					type="submit"
					className={`${styles.button} ${styles.buttonPrimary}`}
				>
					サインアップ
				</button>
			</form>
		</>
	);
}
