'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Switch } from '@material-tailwind/react';
import { Scene } from '@/@types/scene';
import { SceneList } from '@/components/sceneList';

interface Props {
  name: string;
  id: string;
  scenes: Scene[];
}

export const PageContent: React.FC<Props> = ({ name, id, scenes }) => {
  const [isDragDisabled, setIsDragDisabled] = useState(true);

  return (
    <main className='flex min-h-screen w-screen flex-col gap-16 items-center bg-gradient-to-t to-redNissan via-blackNissan from-blackNissan py-8'>
      <header className="flex justify-between w-full max-w-[1280px] px-8">
        <div className='flex flex-col gap-2'>
          <h1 className='text-white text-4xl font-bold'>Editor Tour Virtual</h1>
          <Image src="/assets/Nissan-Brand-Wordmark-W.png" alt="logo nissan" width="200" height="27"/>
        </div>
        <Link href="/" className='bg-white px-8 h-12 flex gap-4 items-center justify-center rounded-full text-2xl'>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#1A1A1A" viewBox="0 0 256 256">
            <path d="M232,200a8,8,0,0,1-16,0,88.1,88.1,0,0,0-88-88H51.31l34.35,34.34a8,8,0,0,1-11.32,11.32l-48-48a8,8,0,0,1,0-11.32l48-48A8,8,0,0,1,85.66,61.66L51.31,96H128A104.11,104.11,0,0,1,232,200Z"></path>
          </svg>
          Voltar
        </Link>
      </header>
      <section className='flex w-full max-w-[1280px] px-8 max-h-[700px]'>
        <div className='w-full bg-white rounded-md p-8  flex flex-col gap-8'>
          <header className='flex items-center justify-between'>
            <h2 className='text-blackNissan text-3xl'>{name.toUpperCase()}</h2>
            <div className='flex gap-4'>
              <div className='flex gap-4 items-center'>
                <Switch
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                  crossOrigin={undefined}
                  onChange={() => setIsDragDisabled(!isDragDisabled)}
                />
                Reordena cenas
              </div>
              <Link href={`/environment/edit/${id}`} className='text-white bg-blackNissan px-8 h-12 flex gap-4 items-center justify-center rounded-full text-xl'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
                Editar Ambiente
              </Link>
            </div>
          </header>
          {scenes.length === 0 ? (
            <div className='flex flex-col gap-4 text-center py-16'>
              <h3>Nenhuma cena encontrada.</h3>
              <Link href={`/environment/edit/${id}`}>
                <button className='bg-blackNissan text-white hover:bg-whiteNissan text-whiteNissan px-8 py-4 rounded-md'>Adicionar Cena</button>
              </Link>
            </div>
          ) : (
            <SceneList page="environment" scenes={scenes} isDragDisabled={isDragDisabled} />
          )}
        </div>
      </section>
    </main>
  );
};