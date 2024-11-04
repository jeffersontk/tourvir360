'use client'
import { Button, Menu, MenuHandler, MenuList, MenuItem } from '@material-tailwind/react'
import React, { useState } from 'react'
import Scene from '../scene'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
/* import { Scene as SceneType } from '@/@types/scene' */
import { GroupScene } from '@/@types/groupScene'
import { Vector3 } from 'three'
import { Spot } from '@/@types/spot'
import Dialog from '../Dialog'

interface props {
  groupScene: GroupScene
  listGroupScene: GroupScene[]
}

export function SceneScreen({listGroupScene, groupScene}:props) {
  const router = useRouter();
  const params = useParams()

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | number>(String(params.id)); 
  const [currentSceneOpen, setCurrentSceneOpen] = useState(0)
  const [selectSpot, setSelectSpot] = useState<Spot>()
  const [open, setOpen] = React.useState(false);
  
  const handleOpenSpotDialog = () => setOpen(!open);
  const handleOpenMenu = () => setIsMenuOpen(true);
  const handleCloseMenu = () => setIsMenuOpen(false);
 
  const handleSelectItem = (item: string | number ) => {
    setSelectedItem(item);
  };

  const navigateToShop = () => {
    if (selectedItem) {
      handleCloseMenu()
      router.push(`/scene/${selectedItem}`);
    } else {
      alert("Por favor, selecione uma etapa antes de ir para o shop.");
    }
  };

  const handleBack = () => {
    setCurrentSceneOpen((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : 0
    );
  }

  const handleNext = () => {
    setCurrentSceneOpen((prevIndex) =>
      prevIndex < groupScene.scenes.length - 1 ? prevIndex + 1 : prevIndex
    );
  }

  function handleSelectSpot(position:Vector3) {
    console.log(position);
    if(groupScene.scenes[currentSceneOpen]) {
      const spot = groupScene.scenes[currentSceneOpen].spots.find((item) => item.position_x === position.x);
      console.log('spot', spot)
      setSelectSpot(spot);
      handleOpenSpotDialog()
    }
    return null
  }

  return (
    <main className='relative'>
      <header className='absolute z-50 right-32 flex items-end justify-end py-16'>
      <Menu  
        dismiss={{
        itemPress: false,
      }}
      placement="left-start"
      open={isMenuOpen} 
      handler={setIsMenuOpen}>
      <MenuHandler>
        <Button 
          onClick={handleOpenMenu} 
          className="bg-white p-2 rounded-full" 
          placeholder={undefined} 
          onPointerEnterCapture={undefined} 
          onPointerLeaveCapture={undefined} 
        >
         { !isMenuOpen ? 
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#1A1A1A" viewBox="0 0 256 256">
            <path d="M76,60A16,16,0,1,1,60,44,16,16,0,0,1,76,60Zm52-16a16,16,0,1,0,16,16A16,16,0,0,0,128,44Zm68,32a16,16,0,1,0-16-16A16,16,0,0,0,196,76ZM60,112a16,16,0,1,0,16,16A16,16,0,0,0,60,112Zm68,0a16,16,0,1,0,16,16A16,16,0,0,0,128,112Zm68,0a16,16,0,1,0,16,16A16,16,0,0,0,196,112ZM60,180a16,16,0,1,0,16,16A16,16,0,0,0,60,180Zm68,0a16,16,0,1,0,16,16A16,16,0,0,0,128,180Zm68,0a16,16,0,1,0,16,16A16,16,0,0,0,196,180Z"></path>
          </svg>
            :
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-16 text-blackNissan">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
            }
        </Button>
         
      </MenuHandler>

      <MenuList className="p-8 flex flex-col gap-4 bg-gradient-to-t to-redNissan via-blackNissan from-blackNissan text-white" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        <Image src="/logo.png" alt="Nissan brand wordmark" width={250} height={56} />
        <Button
          onClick={() => router.push('/')}
          className="w-full border border-white text-white rounded-full flex items-center justify-center gap-2 px-8 py-2" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
         Menu Inicial
        </Button>

        {
          listGroupScene.map(item => (
            <MenuItem
              key={item.id}
              className={`flex items-center gap-4 cursor-pointer outline-none my-2`}
              onClick={() => handleSelectItem(item.id)}
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}>
              <div className="w-6 h-6 border border-white flex items-center justify-center rounded-full">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
              <div className={`${selectedItem === item.id ? 'border border-white p-1  rounded-full text-blackNissan' : ''}`}>
                <div className={`${selectedItem === item.id ? 'bg-white text-blackNissan rounded-full px-8 py-1' : ''}`}>
                  {item.name}
                </div>
              </div>
            </MenuItem>
          ))
        }
        <Button
          onClick={navigateToShop}
          className="w-full bg-white text-blackNissan rounded-full flex items-center justify-center gap-2 px-8 py-2" 
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          Ir para shop
        </Button>
      </MenuList>
    </Menu>
      </header>
      <section className='relative'>
        <Scene 
          currentSceneOpen={groupScene.scenes[currentSceneOpen]}
          handleSelectSpot={handleSelectSpot}
        />
        {
          selectSpot && 
          <Dialog 
            isOpen={open}
            onClose={handleOpenSpotDialog}
            selectSpot={selectSpot}
          />
        }
      </section>
      <footer className='absolute z-50 bottom-16 w-full flex items-center justify-center'>
          <div className='flex gap-8'>
          <Button 
            onClick={handleBack}
            disabled={currentSceneOpen === 0}
            className={`bg-white text-blackNissan rounded-full flex items-center justify-center gap-2 pr-8 pl-4 py-2 ${currentSceneOpen === 0 ? 'opacity-50 cursor-not-allowed' : ''}`} 
            placeholder={undefined} 
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            Voltar
          </Button>

          <Button 
            onClick={handleNext}
            disabled={currentSceneOpen === groupScene.scenes.length - 1}
            className={`bg-white text-blackNissan rounded-full flex items-center justify-center gap-2 pl-8 pr-4 py-2 ${currentSceneOpen === groupScene.scenes.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`} 
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}>
            Avançar
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </Button>
          </div>
      </footer>


    </main>
  )
}
