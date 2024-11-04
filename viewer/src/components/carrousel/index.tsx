'use client';
import { GroupScene } from '@/@types/groupScene';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

interface Props {
  groupScene: GroupScene[];
}

export function Carrousel({ groupScene }: Props) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const router = useRouter();

  const handlePrev = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? groupScene.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === groupScene.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleNavigate = () => {
    router.push(`/scene/${groupScene[activeIndex].id}`);
  };



  return (
    <div className="flex flex-col items-center">
      <div className="relative flex items-center justify-center w-full h-96">
        {groupScene.map((item, index) => {
          // Calculate relative position to the active index
          const offset = index - activeIndex;
          const scale = 1 - Math.abs(offset) * 0.1; // Scale down based on distance from the center
          const zIndex = 5 - Math.abs(offset); // Higher z-index for closer items
          const translateX = offset * 30; // Control horizontal spacing

          return (
            <div
              key={item.id}
              className={"absolute transition-all duration-500 ease-in-out border-white rounded-md shadow-xl"}
              style={{
                transform: `translateX(${translateX}%) scale(${scale})`,
                zIndex,
                borderWidth:  index === activeIndex ? '4px' :'2px',
              }}
            >
              <Image
                src={item.media.path}
                alt={item.name}
                className="w-72 h-96 object-cover min-w-72 rounded-md"
                width={288}
                height={367}
              />
              <div className="absolute z-20 w-72 h-96  top-0 flex items-end justify-end">
                <p className="text-center mt-2 text-white z-40 font-bold p-4">{item.name}</p>
               {/*  <div className="bg-black absolute z-10 w-72 h-96 left-0 top-0 opacity-35 rounded-md" /> */}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex space-x-4">
        <button
          onClick={handlePrev}
          className="p-2 rounded-full hover:scale-110 transition-all"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-12 h-12 text-white"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>
        <button
          onClick={handleNext}
          className="p-2 rounded-full hover:scale-110 transition-all"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-12 h-12 text-white"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
      <button
        onClick={handleNavigate}
        className="mt-6 border-2 border-white text-white font-semibold py-2 px-16 rounded-full hover:opacity-90"
      >
        Iniciar Visita
      </button>
    </div>
  );
}
