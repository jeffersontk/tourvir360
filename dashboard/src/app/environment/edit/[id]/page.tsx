'use client'
import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import Forms from '@/components/Forms/edit'
import { useAppStateContext } from '@/context/AppStateContext';
import { Button } from '@material-tailwind/react';


export default function Edit({params}: {params: {id: string}}) {
  const router = useRouter()
  
  const {setGroupSceneId} = useAppStateContext()

  if(params.id){
    setGroupSceneId(+params.id)
  }

  const handleGoBack = async () => {
      router.push(`/`)
  }

  return (
    <>
       <main className="w-full h-screen flex flex-col gap-8 bg-gradient-to-t to-redNissan via-blackNissan from-blackNissan items-center">
        <header className='max-w-[1280px] w-full py-8 flex justify-between items-center'>
          <div className='flex flex-col'>
            <h1 className='text-4xl text-white font-bold'>Novo Ambiente</h1>
            <Image src="/assets/Nissan-Brand-Wordmark-W.png" alt="Nissan logo" width={180} height={40} />
          </div>
          <Button onClick={handleGoBack} className='bg-white text-lg font-medium text-red-500 px-8 py-2 rounded-full'placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
           Cancelar
          </Button>
        </header>
        <section className="max-w-[1280px] w-full h-full">
          <Forms isEditor/>
        </section>
      </main>
    </>
  )
}
