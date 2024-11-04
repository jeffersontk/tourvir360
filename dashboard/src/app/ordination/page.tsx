import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { fetchGroupsScene } from '@/lib/data/group-scenes';
import GroupSceneList from '@/components/groupSceneList';

export default async function Page() {
  const groupScenes = await fetchGroupsScene()

  return (
    <main className='flex min-h-screen w-screen flex-col gap-16 items-center bg-gradient-to-t to-redNissan via-blackNissan from-blackNissan py-8'>
      <header className="flex justify-between w-full max-w-[1280px] px-8">
        <div className='flex flex-col gap-2'>
          <h1 className='text-white text-4xl font-bold'>Editor Tour Virtual</h1>
          <Image src="/assets/Nissan-Brand-Wordmark-W.png" alt="logo nissan" width="200" height="27"/>
        </div>
        <Link href="/" className='bg-white px-8 h-12 flex gap-4 items-center justify-center rounded-full text-2xl'>
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#1A1A1A" viewBox="0 0 256 256"><path d="M232,200a8,8,0,0,1-16,0,88.1,88.1,0,0,0-88-88H51.31l34.35,34.34a8,8,0,0,1-11.32,11.32l-48-48a8,8,0,0,1,0-11.32l48-48A8,8,0,0,1,85.66,61.66L51.31,96H128A104.11,104.11,0,0,1,232,200Z"></path></svg>
          Voltar
        </Link>
      </header>
      <section className='flex w-full max-w-[1280px] px-8 max-h-[700px]'>
        <div className='w-full bg-white rounded-md p-8  flex flex-col gap-8'>
          <header className='flex items-center justify-between text-blackNissan'>
            <h1 className='text-2xl'>Reordenar Ambientes</h1>
            <p className='text-sm cursor-pointer' title="Arraste ate a posição que deseja que o ambiente fique.">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8 text-gray-700">
              <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clip-rule="evenodd" />
              </svg>
            </p>
          </header>
           <GroupSceneList groupScenes={groupScenes.data}/>
        </div>
      </section>
    </main>
  );
}
