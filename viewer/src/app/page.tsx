import { Carrousel } from "@/components/carrousel";
import { fetchGroupScene } from "@/data/GroupScene";
import Image from "next/image";
export default async function Home() {
  const response =  await fetchGroupScene();
  const { data } = response;

  return (
    <main className="w-screen h-screen bg-gradient-to-t to-redNissan via-blackNissan from-blackNissan">
      <section className="w-full h-full flex flex-col justify-center items-center gap-8">
        <div className="flex flex-col gap-2">
          <Image
            src="/logo.png"
            alt="Nissan brand wordmark"
            width={250}
            height={56} 
          />
        </div>
        <div className="flex gap-8 w-full items-center justify-center max-w-[1280px] py-8 rounded-md px-8">
          <Carrousel  groupScene={data}/>
        </div>
        
      </section>
    </main>
  );
}
