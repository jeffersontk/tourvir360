import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface props {
  title: string
  url: string
  id:number
}

export default function Card({title, url, id}: props) {
  return (
    <Link href={`/environment/${id}`} className="w-80 relative">
    <div className="relative w-80">
      <Image src={url} alt={title} width={320} height={170} className="w-80 h-40 object-cover" />
      <div className="overlay bg-black bg-opacity-75 absolute inset-0 z-10 flex items-center justify-center">
        <h2 className="text-white text-2xl z-20">{title}</h2>
      </div>
    </div>
  </Link>
  )
}
