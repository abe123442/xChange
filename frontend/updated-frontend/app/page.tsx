import Image from "next/image";
import styles from "./page.module.css";
import NavBar from "@/components/navbar/NavBar";
import Link from "next/link";

const BACKEND_URL = "http://localhost:5000";

export default async function Home() {
  const response = await fetch(BACKEND_URL + "/home");
  const profiles = await response.json();
  // console.log(profiles);

  return (
    <>
      <NavBar />
    </>
  );
}
