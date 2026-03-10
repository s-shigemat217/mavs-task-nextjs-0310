"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginProvider } from "../contexts/login";
import { useLoginData } from "../hooks/useLoginData";

function ArticlesAuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { loginData, isLoginDataLoaded } = useLoginData();

  useEffect(() => {
    if (!isLoginDataLoaded) return;
    if (!loginData?.token) {
      router.replace("/signin");
    }
  }, [isLoginDataLoaded, loginData?.token, router]);

  if (!isLoginDataLoaded || !loginData?.token) {
    return null;
  }

  return <>{children}</>;
}

export default function ArticlesLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <LoginProvider>
      <ArticlesAuthGuard>{children}</ArticlesAuthGuard>
    </LoginProvider>
  );
}
