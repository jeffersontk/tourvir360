'use client'
import React, { useRef } from 'react'
import Card from '../card'
import { GroupScene } from '@/@types/groupScene'

type Props = {
  envs: GroupScene[]
}

export default function Gallery({envs = []}:Props) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -200 : 200,
        behavior: 'smooth',
      })
    }
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (scrollContainerRef.current) {
      scrollContainerRef.current.dataset.dragging = 'true'
      scrollContainerRef.current.dataset.startX = (e.pageX - scrollContainerRef.current.offsetLeft).toString()
      scrollContainerRef.current.dataset.scrollLeftStart = scrollContainerRef.current.scrollLeft.toString()
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current || scrollContainerRef.current.dataset.dragging !== 'true') return

    const startX = Number(scrollContainerRef.current.dataset.startX)
    const scrollLeftStart = Number(scrollContainerRef.current.dataset.scrollLeftStart)
    const x = e.pageX - scrollContainerRef.current.offsetLeft
    const walk = (x - startX) * 2 // Ajuste o fator de rolagem conforme necessário
    scrollContainerRef.current.scrollLeft = scrollLeftStart - walk
  }

  const handleMouseUp = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.dataset.dragging = 'false'
    }
  }

  return (
    <div className="w-full flex gap-4">
      <button onClick={() => scroll('left')} className="text-white text-8xl">‹</button>
      <div
        ref={scrollContainerRef}
        className="overflow-x-scroll flex gap-4 scrollbar-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {envs
        .sort((a, b) => a.order - b.order)
        .map((env, index) => (
          <Card key={index} title={env.name} url={env.media.path} id={env.id}/>
        ))}
      </div>

      <button onClick={() => scroll('right')} id="scrollRightButton" className="text-white text-8xl">›</button>
    </div>
  )
}
