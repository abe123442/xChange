import styles from "./page.module.css";
import NavBar from "@/components/navbar";
import { Profile } from '@/components/profile/profile';
import { Comment } from '@/components/profile/comment';
import { CommentForm } from "@/components/profile/commentForm";

const BACKEND_URL = 'http://localhost:5001';
export const revalidate = 0;

export default async function Page({ params }: { params: { id: string }}) {
  const { id } = params;
  const profileData = await fetch(BACKEND_URL + `/profile/${id}`);
  const profile = await profileData.json();

  const commentData = await fetch(BACKEND_URL + `/profile/${id}/comments`);
  const comments = await commentData.json();

  return (
    <>
      <NavBar />
      <div className={styles.page}>
        <main className={styles.main}>
          <Profile profile={profile.profile} />
          <Comment comments={comments.comments} profileid={profile.profile.id} />
        </main>
        <footer className={styles.footer}>

        </footer>
      </div>
    </>
  );
}