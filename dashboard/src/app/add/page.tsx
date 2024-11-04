'use client'
import React from 'react'
import Image from 'next/image';
import Forms from '@/components/Forms';
import { useRouter } from 'next/navigation';
import { useAppStateContext } from '@/context/AppStateContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
const resource = "/api/v1/group-scenes";

export default function Add() {
  const router = useRouter()
  const {groupSceneId} = useAppStateContext()

  const handleCancel = async () => {
    if(!groupSceneId) router.push(`/`)
    try {
      await fetch(`${API_URL}${resource}/${groupSceneId}`, {
        method: "DELETE"
      });
      router.push(`/`)
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <main className="w-full h-screen flex flex-col gap-8 bg-gradient-to-t to-redNissan via-blackNissan from-blackNissan items-center">
        <header className='max-w-[1280px] w-full py-8 flex justify-between items-center'>
          <div className='flex flex-col'>
            <h1 className='text-4xl text-white font-bold'>Novo Ambiente</h1>
            <Image src="/assets/Nissan-Brand-Wordmark-W.png" alt="Nissan logo" width={180} height={40} />
          </div>
          <button onClick={handleCancel} className='bg-white text-xl text-redNissan px-8 py-2 rounded-full'>
            Cancelar
          </button>
        </header>
        <section className="max-w-[1280px] w-full h-full pb-8">
          <Forms />
        </section>
      </main>
    </>
  )
}
