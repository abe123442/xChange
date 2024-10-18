import styles from "./page.module.css";
import NavBar from "@/components/navbar";
import { Profile } from '@/components/profile/profile';
import { Comment } from '@/components/profile/comment';

const BACKEND_URL = 'http://localhost:5000';

export default async function Page({ params }: { params: { id: string }}) {
  const { id } = params;
  const profileData = await fetch(BACKEND_URL + `/profile/${id}`);
  const profile = await profileData.json();

  const commentData = await fetch(BACKEND_URL + `/profile/${id}/comments`);
  const comments = await commentData.json();
  console.log(comments);
  return (
    <>
      <NavBar />
      <div className={styles.page}>
        <main className={styles.main}>
          <Profile profile = { profile.profile } />
          <Comment comments = { comments.comments } />
        </main>
        <footer className={styles.footer}>

        </footer>
      </div>
    </>
  );
}