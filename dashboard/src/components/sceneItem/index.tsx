'use client'
import { useAppStateContext } from '@/context/AppStateContext'
import { Tooltip } from '@material-tailwind/react'
import Image from 'next/image'
import React from 'react'
import { Scene } from '@/@types/scene'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities';

interface props {
  scene: Scene
  index: number
  isDragDisabled?: boolean
}

export function SceneItem({scene, index, isDragDisabled = false}:props) {
  const { handleDeleteSceneList, handleOpenSceneState, deleteSceneLoading} = useAppStateContext()
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: scene.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if(isDragDisabled && scene){
    return (
          <div
            ref={setNodeRef} style={style} {...attributes} {...listeners}
            className="flex flex-col w-full h-52 md:h-52 lg:h-52 mb-4"
          >
            <div className="relative w-full h-full">
              <Image
                src={scene.media.path}
                alt={scene.name}
                fill
                className="object-cover"
              />
              <button 
                className="absolute top-2 right-2 p-1 z-40 bg-white rounded-full shadow hover:bg-red-100"
                aria-label="Remover cena"
                onClick={() => handleDeleteSceneList(scene.id)}
              >
                 {
                  deleteSceneLoading ? 
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#454545" viewBox="0 0 256 256" className='animate-spin'><path d="M136,32V64a8,8,0,0,1-16,0V32a8,8,0,0,1,16,0Zm88,88H192a8,8,0,0,0,0,16h32a8,8,0,0,0,0-16Zm-45.09,47.6a8,8,0,0,0-11.31,11.31l22.62,22.63a8,8,0,0,0,11.32-11.32ZM128,184a8,8,0,0,0-8,8v32a8,8,0,0,0,16,0V192A8,8,0,0,0,128,184ZM77.09,167.6,54.46,190.22a8,8,0,0,0,11.32,11.32L88.4,178.91A8,8,0,0,0,77.09,167.6ZM72,128a8,8,0,0,0-8-8H32a8,8,0,0,0,0,16H64A8,8,0,0,0,72,128ZM65.78,54.46A8,8,0,0,0,54.46,65.78L77.09,88.4A8,8,0,0,0,88.4,77.09Z"></path></svg>
                  :
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#C3002F" viewBox="0 0 256 256">
                      <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM112,168a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm0-120H96V40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8Z"></path>
                    </svg>
                  </span>
                }
              </button>
  
              <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50">
                <Tooltip className="bg-white text-blackNissan" content="Adicionar ponto de interesse">
                  <button onClick={()=> handleOpenSceneState(scene)} className="bg-white rounded-full p-4 shadow-lg hover:bg-gray-100" aria-label="Adicionar ponto de interesse">
                    <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" fill="#C3002F" viewBox="0 0 256 256">
                      <path d="M128,16a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.3,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm32,96H136v24a8,8,0,0,1-16,0V112H96a8,8,0,0,1,0-16h24V72a8,8,0,0,1,16,0V96h24a8,8,0,0,1,0,16Z"></path>
                    </svg>
                  </button>
                </Tooltip>
              </div>
            </div>
            <div className="scene-info w-full px-4 py-2 bg-black flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-lg text-white font-semibold">Cena:</span>
                <span className="scene-name text-white">{scene.name}</span>
              </div>
              <span className="text-white">Pontos de interesse {scene.spots.length}</span>
            </div>
          </div>
  )}
  if(scene) {
    return (
    <div
      ref={setNodeRef} style={style} {...attributes} {...listeners}
      className="flex flex-col w-full h-52 md:h-52 lg:h-52 mb-4"
    >
      <div className="relative w-full h-full">
        <Image
          src={scene.media.path}
          alt={scene.media.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="scene-info w-full px-4 py-2 bg-black flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-lg text-white font-semibold">Cena:</span>
          <span className="scene-name text-white">{scene.name}</span>
        </div>
        <span className="text-white">Pontos de interesse {scene.spots?.length}</span>
      </div>
    </div>
  )}
  return null
}
