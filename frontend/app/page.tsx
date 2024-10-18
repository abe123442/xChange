import { BACKEND_URL } from "@/lib/utils";
import ClientOnly from "@/components/ClientOnly";
import Search from "@/components/Search";

export default async function Home() {
  const response = await fetch(BACKEND_URL + "/home");

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
