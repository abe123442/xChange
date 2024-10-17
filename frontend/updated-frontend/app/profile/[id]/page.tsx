import Image from "next/image";
import styles from "./page.module.css";
import NavBar from "@/components/navbar";

export default function Home() {
  return (
    <>
      <NavBar />
      <div className={styles.page}>
        <main className={styles.main}>

        </main>
        <footer className={styles.footer}>

        </footer>
      </div>
    </>
  );
}
