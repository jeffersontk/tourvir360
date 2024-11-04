'use client'
import useSWR from 'swr'
import Gallery from "@/components/gallery"
import Image from "next/image"
import Link from "next/link"
import { ResponseGroupsScene } from '@/@types/groupScene'
import { Button } from '@material-tailwind/react'
const API_URL = process.env.NEXT_PUBLIC_API_URL || ""

const fetcher = (url: string) => fetch(url).then(res => res.json())

type ErrorType = {
  message: string
}

export default function Home() {
  // Fetch data using SWR
  const { data, error, isLoading } = useSWR<ResponseGroupsScene, ErrorType>(`${API_URL}/api/v1/group-scenes`, fetcher)
  const groupScenes = data?.data ?? []
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <main className="flex min-h-screen w-screen flex-col gap-16 items-center bg-gradient-to-t to-redNissan via-blackNissan from-blackNissan py-8">
      <header className="flex justify-between w-full max-w-[1280px] px-8">
        <div className="flex flex-col gap-1 text-white font-regular">
          <Image src="/assets/Nissan-Brand-Wordmark-W.png" alt="Nissan logo" width={240} height={40} />
          <h3 className="text-2xl">Tour Nissan</h3>
        </div>
        <Link href="/add" className="px-12 py-1 max-h-12 bg-white hover:bg-opacity-95 text-black flex items-center justify-center rounded-full text-xl">
          Novo Ambiente
        </Link>
      </header>

      <section className="w-full max-w-[1280px] px-8 relative overflow-hidden flex flex-col gap-8 items-center">
        <Image src="/assets/newKicks.png" alt="New Nissan Kicks" width={750} height={411} />
        <div className="w-full flex flex-col gap-4">
          <div className='w-full flex justify-between items-center'>
            <h2 className="text-4xl text-white">Ambientes</h2>
            <Link 
              href="/ordination"
             className="px-12 py-2 max-h-12 bg-white hover:bg-opacity-95 text-black flex items-center justify-center rounded-full text-xl"
            >
              Ordenar Ambientes
            </Link>
          </div>
          <Gallery  envs={groupScenes}/>
        </div>
      </section>
    </main>
  )
}
