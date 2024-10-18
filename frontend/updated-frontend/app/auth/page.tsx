import styles from "./page.module.css";
import { UserAuthForm } from "../../components/auth/user-auth-form"

export default function AuthenticationPage() {
  return (
    <>
      <div className={styles.page}>
        <main className={styles.main}>
          <div className={styles.form}>
            <UserAuthForm />
          </div>
        </main>
        <footer className={styles.footer}>

        </footer>
      </div>
    </>
  )
}