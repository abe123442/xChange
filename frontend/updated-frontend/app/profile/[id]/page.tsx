import styles from "./page.module.css";
import NavBar from "@/components/navbar";

const BACKEND_URL = 'https://localhost:5000';

export default async function Profile({ params }: { params: { id: string }}) {
  const { id } = params;
  const data = await fetch(BACKEND_URL + `/profile/${id}`);
  const profile = await data.json();
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
