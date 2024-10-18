import styles from "./page.module.css";
import { UserLoginForm } from "../../../components/auth/user-login-form"

export default function AuthenticationPage() {
  return (
    <>
      <div className={styles.page}>
        <main className={styles.main}>
          <div className={styles.form}>
            <UserLoginForm />
          </div>
        </main>
        <footer className={styles.footer}>

        </footer>
      </div>
    </>
  )
}