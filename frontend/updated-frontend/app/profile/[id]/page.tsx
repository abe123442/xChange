import styles from "./page.module.css";
import NavBar from "@/components/navbar";
import { Profile } from '@/components/profile/profile';
import { Comment } from '@/components/profile/comment';

const BACKEND_URL = 'http://localhost:5000';

export default async function Page({ params }: { params: { id: string }}) {
  const { id } = params;
  const data = await fetch(BACKEND_URL + `/profile/${id}`);
  const profile = await data.json();
  console.log(profile);
  return (
    <>
      <NavBar />
      <div className={styles.page}>
        <main className={styles.main}>
          <Profile profile = { profile.profile } />
          <Comment profile = { profile.profile } />
        </main>
        <footer className={styles.footer}>

        </footer>
      </div>
    </>
  );
}