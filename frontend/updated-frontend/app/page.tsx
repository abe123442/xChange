import NavBar from "@/components/navbar/NavBar";
import { BACKEND_URL } from "@/lib/utils";

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
