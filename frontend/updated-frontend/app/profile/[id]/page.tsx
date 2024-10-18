import styles from "./page.module.css";
import { Profile } from '@/components/profile/profile';
import { Comment } from '@/components/profile/comment';
import { BACKEND_URL } from '@/lib/utils';
import { CommentForm } from '@/components/profile/commentForm';

export const revalidate = 0;

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  // Fetch profile data
  const profileData = await fetch(`${BACKEND_URL}/profile/${id}`);
  const profile = await profileData.json();

  // Fetch comments for this profile
  const commentData = await fetch(`${BACKEND_URL}/profile/${id}/comments`);
  const comments = await commentData.json();

  return (
    <>
      <div className={styles.page}>
        <main className={styles.main}>
          {/* Render Comments with profileId */}
          <div className="flex">
            <div>
              <Profile profile={profile.profile} />
              <div className={styles.form}>
                <CommentForm profileId={profile.profile.id.toString()} />
              </div>
            </div>
            <div className={styles.frame}>
              <Comment comments={comments.comments} profileid={profile.profile.id} />
            </div>
          </div>
        </main>
        <footer className={styles.footer}>
        </footer>
      </div>
    </>
  );
}
