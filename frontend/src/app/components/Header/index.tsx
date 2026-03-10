"use client";
import { useRouter } from "next/navigation";
import styles from "./header.module.css";
import { useLoginData } from "@/hooks/useLoginData";

export default function Header() {
  const router = useRouter();
  const { loginData, setLoginData } = useLoginData();

  const logout = () => {
    setLoginData(undefined);
    router.push("/");
  };
  return <div className={styles.header}></div>;
}
