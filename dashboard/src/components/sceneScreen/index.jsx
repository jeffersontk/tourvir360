'use client'
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Typography } from '@material-tailwind/react'
import Image from 'next/image'
import React, { useState } from 'react'
import Scene from '../scene'
import { useAppStateContext } from '@/context/AppStateContext'

const API_URL = process.env.NEXT_PUBLIC_API_URL || ""
const resource = "/api/v1/spots";

function renderMedia(selectedSpot) {
    if(selectedSpot.media.type && selectedSpot.media.type.includes('image')){
      return (
      <div>
        <Image src={selectedSpot.media.path} alt="POI Image" width={572} height={200} className='w-full object-cover' />
      </div>

      )
    }
    else if(selectedSpot.media.type && selectedSpot.media.type.includes('video')){
      return <div>
      <video width="500" controls className='w-full object-cover'>
        <source src={selectedSpot.media.path} type="video/mp4" />
        Seu navegador não suporta a tag de vídeo.
      </video>
    </div>
    }else {
      return null
    }
}

export default function SceneScreen() {
  const {openScene, handleCloseScene, selectedSpot, handleCloseSpotDialog, currentSceneStateOpen, groupScene, setGroupScene} = useAppStateContext()
  const [openDialogInformative, setOpenDialogInformative] = useState(false);
  
  const handleOpenDialogInformative = () => setOpenDialogInformative(!open);
  
  const handleRemoveSpot = async () => {
    try {
      await fetch(`${API_URL}${resource}/${selectedSpot.id}`, {
        method: "DELETE"
      });
          
      if(groupScene && groupScene.data){
        const {scenes} = groupScene.data
        const selectedScene = scenes.find(scene => scene.id == currentSceneStateOpen.id)
        const updatedSpots = currentSceneStateOpen.spots.filter(spot => spot.id !== selectedSpot.id);
        const newArraySpots = [...updatedSpots]
        selectedScene.spots = newArraySpots
        setGroupScene({data: {scenes: scenes}, success: true})
      }
      handleCloseSpotDialog();
  
    } catch (error) {
      console.log('error: ', error);
    }
  };

  return (
    <>
      <Dialog size='xxl' open={openScene}>
      <DialogHeader className='bg-redNissan justify-between flex px-16'>
          <button onClick={handleCloseScene} className="flex items-center gap-4 text-white text-2xl">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="#ffffff" viewBox="0 0 256 256"><path d="M232,200a8,8,0,0,1-16,0,88.1,88.1,0,0,0-88-88H51.31l34.35,34.34a8,8,0,0,1-11.32,11.32l-48-48a8,8,0,0,1,0-11.32l48-48A8,8,0,0,1,85.66,61.66L51.31,96H128A104.11,104.11,0,0,1,232,200Z"></path></svg>
          Voltar
        </button>
        <div className="flex flex-col gap-2 items-center justify-center">
          <Image src="/assets/Nissan-Brand-Wordmark-W.png" alt="NISSAN" width={240} height={40} srcset="" className="w-48" />
          <h1 className="text-white text-xl">Tour Virtual</h1>
        </div>
        <button id="informative" onClick={()=> setOpenDialogInformative(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="#ffffff" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z"></path></svg>
        </button>
      </DialogHeader>
      <DialogBody className='p-0'>
        <Scene />
      </DialogBody>
      </Dialog>
      {selectedSpot && (
        <Dialog 
          size='md' 
          open={Boolean(selectedSpot)} 
          onClose={handleCloseSpotDialog} 
        >
          <DialogHeader className='bg-blackNissan text-white flex justify-between items-center'>
            <h2>
              Detalhes do ponto de interesse
            </h2>
            <button onClick={handleCloseSpotDialog}>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#ffffff" viewBox="0 0 256 256"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg>
            </button>
          </DialogHeader>
          <DialogBody className='flex flex-col gap-4'>
            {renderMedia(selectedSpot)}
            <div className=''>
              <p>{selectedSpot.description}</p>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button onClick={handleRemoveSpot} color="red">Remover Ponto de interesse</Button>
          </DialogFooter>
        </Dialog>
      )}
      <Dialog
        size='md' 
        open={openDialogInformative} 
        handler={handleOpenDialogInformative}
      >
        <DialogHeader  className='bg-blackNissan text-white flex justify-between items-center'>
          <Typography variant='h4'>Como Marcar Pontos de Interesse</Typography>

          <button onClick={()=> setOpenDialogInformative(false)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#ffffff" viewBox="0 0 256 256"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg>
          </button>
        </DialogHeader>
        <DialogBody>
          <Typography variant="lead">
            Para adicionar um ponto de interesse, clique com o botão direito do mouse no local desejado.
          </Typography>
        </DialogBody>
      </Dialog>
    </>
  )
}
