import Image from "next/image";
import styles from "./page.module.css";
import NavBar from "@/components/navbar";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <NavBar />
      <div className={styles.page}>
        <main className={styles.main}>
          <Image
            className={styles.logo}
            src="https://nextjs.org/icons/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />
          <ol>
            <li>
              Get started by editing <code>app/page.tsx</code>.
            </li>
            <li>Save and see your changes instantly.</li>
          </ol>

          <div className={styles.ctas}>
            <Link
              className={styles.primary}
              href="/profile/100"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                className={styles.logo}
                src="https://nextjs.org/icons/vercel.svg"
                alt="Vercel logomark"
                width={20}
                height={20}
              />
              Deploy now
            </Link>
            <a
              href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.secondary}
            >
              Read our docs
            </a>
          </div>
        </main>
        <footer className={styles.footer}>
          Footer here.
        </footer>
      </div>
    </>
  );
}
