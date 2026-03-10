"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { LoginRequest } from "@/types/Login/LoginReqest";
import { LoginResponse } from "@/types/Login/LoginResponse";
import { useLoginData } from "@/hooks/useLoginData";
import { useRouter } from "next/navigation";
import styles from "@/articles/articles.module.css";

export default function LoginForm() {
  const router = useRouter();
  const { setLoginData } = useLoginData();
  const [authError, setAuthError] = useState("");
  const {
    register,
    handleSubmit,
    reset,
  } = useForm<LoginRequest>();
  const onSubmit = handleSubmit(async (request: LoginRequest) => {
    setAuthError("");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/signin`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: request.email,
          password: request.password,
        }),
      },
    );
    const data: LoginResponse = await response.json();
    if (data.token) {
      // トークンの保持
      setLoginData(data);
      router.push("/");
    } else {
      setAuthError("メールアドレスまたはパスワードが正しくありません。");
      reset();
    }
  });
  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <div className={styles.field}>
        <label htmlFor="signin-email" className={styles.label}>
          メールアドレス
        </label>
        <input
          id="signin-email"
          className={styles.input}
          {...register("email")}
          type="email"
          placeholder="you@example.com"
          required
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="signin-password" className={styles.label}>
          パスワード
        </label>
        <input
          id="signin-password"
          className={styles.input}
          {...register("password")}
          type="password"
          required
        />
      </div>
      {authError && (
        <p className={styles.error} role="alert">
          {authError}
        </p>
      )}
      <button
        type="submit"
        className={`${styles.button} ${styles.buttonPrimary}`}
      >
        サインイン
      </button>
    </form>
  );
}
