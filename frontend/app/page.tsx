import { BACKEND_URL } from "@/lib/utils";
import ClientOnly from "@/components/ClientOnly";
import Search from "@/components/Search";

export default async function Home() {
  const response = await fetch(BACKEND_URL + "/home");

  return (
    <>
      <ClientOnly>
        <Search />
      </ClientOnly>
    </>
  );
}
