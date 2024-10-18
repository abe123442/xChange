"use client"

import styles from "./page.module.css";
import NavBar from "@/components/navbar/NavBar";
import { Profile } from '@/components/profile/profile';
import { Comment } from '@/components/profile/comment';
import { BACKEND_URL } from '@/lib/utils';
import { CommentForm } from '@/components/profile/commentForm';
import { useLocalStorage } from "usehooks-ts";

export default async function Page({ params }: { params: { id: string } }) {
  const [token, setToken, removeToken] = useLocalStorage('token', '');
  const { id } = params;

  // Fetch profile data
  const profileData = await fetch(`${BACKEND_URL}/profile/${id}`);
  const profile = await profileData.json();

  // Fetch comments for this profile
  const commentData = await fetch(`${BACKEND_URL}/profile/${id}/comments`);
  const comments = await commentData.json();

  return (
    <>
      <NavBar />
      <div className={styles.page}>
        <main className={styles.main}>
          {/* Render Comments with profileId */}
          <div className="flex">
            <div>
              <Profile profile={profile.profile} />
              <br></br>
              <div className={styles.form}>
                <CommentForm profileId={profile.profile.id.toString()} />
              </div>
            </div>
            <div className={styles.frame}>
              <div className={styles.title}>
                Comments
              </div>
              <div className="sticky max-h-[calc(100vh-4rem)] overflow-y-scroll scrollbar-none">
                <Comment comments={comments.comments} />
              </div>
            </div>
          </div>
        </main>
        <footer className={styles.footer}></footer>
      </div>
    </>
  );
}
