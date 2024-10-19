import { BACKEND_URL } from "@/lib/utils";
import ClientOnly from "@/components/ClientOnly";
import Search from "@/components/Search";

export default async function Home() {
  return (
    <>
      <ClientOnly>
        <Search />
      </ClientOnly>
    </>
  );
}
