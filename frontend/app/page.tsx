import NavBar from "@/components/navbar/NavBar";
import { BACKEND_URL } from "@/lib/utils";
import Link from "next/link";
import ClientOnly from "@/components/ClientOnly";
import Search from "@/components/Search";

export default async function Home() {
  const response = await fetch(BACKEND_URL + "/home");
  const profiles = await response.json();
  // console.log(profiles);

  return (
    <>
      <div className="my-24">
        <ClientOnly>
          <Search />
        </ClientOnly>
      </div>
    </>
  );
}
