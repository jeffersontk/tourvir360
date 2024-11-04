'use client'
import React, {useState} from 'react'; // Ensure useState is imported
import { useAppStateContext } from '@/context/AppStateContext';
import {
  Drawer,
  Typography,
  Input,
} from "@material-tailwind/react";
import { Controller, useForm } from 'react-hook-form';
import { createSceneFromGroupScene } from '@/lib/data/group-scenes';
import { uploadSceneFile } from '@/lib/data/scene';
import SceneScreen from '@/components/sceneScreen';
import SpotForm from '@/components/spotForm';
import { useRouter } from 'next/navigation';
import { SceneList } from '@/components/sceneList';

export function SceneForm({lastStep}) {
  const [isLoading, setIsLoading] = useState(false)

  const {groupScene ,handleOpenSceneDrawer, openSceneDrawer, handleCloseSceneDrawer, groupSceneId, setGroupScene, openScene, openDrawerSpot} = useAppStateContext();
  const router = useRouter()
  const {
    register,
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmitScene = async (data) => {
    setIsLoading(true)
    try {
      if (!data.sceneImage || !data.sceneImage[0]) {
        console.error('Image is required');
        return;
      }

      const createdScene = await createSceneFromGroupScene(data.sceneName, groupSceneId);

      if(!createdScene.success){
        console.error('Failed to create scene:');
        return;
      }

      const uploadResponse = await uploadSceneFile(data.sceneImage[0], createdScene.data.id);

      if(uploadResponse){        
        setGroupScene(uploadResponse)
        if(!uploadResponse)
          throw new Error("Cannot upload image")

        if(createdScene && createdScene.data && uploadResponse.data){
          const {id, name, groupSceneId, order} = createdScene.data
          const {path, type, name: nameImage} = uploadResponse.data
          const newScene = {
            id,
            name,
            groupSceneId,
            media: {
              name: nameImage,
              path,
              type
            },
            order,
            spots: [],
          };

          if(groupScene && groupScene.data){
            const {scenes} = groupScene.data
            const newArrayScenes = [...scenes, newScene]
            groupScene.data.scenes = newArrayScenes
            setGroupScene(groupScene)
          }
          handleCloseSceneDrawer();
        }  
        reset({sceneImage: [], sceneName: ''})
        setIsLoading(false)
      }
    } catch (error) {
      setIsLoading(false)
      console.error('Failed to submit scene:', error);
    }
  };
  
  const handleFinish = () => {
    router.push('/')
  }
  
  console.log('groupScene.data', groupScene.data)

  return (
    <div className="flex flex-col gap-4 bg-white rounded-md p-8">
      <header className='w-full flex justify-between'>
        <h1 className='text-2xl font-medium text-blackNissan'>Informações de Cena</h1>
        <button onClick={handleOpenSceneDrawer} className='border border-blackNissan rounded-full px-8 py-2'>
          Adicionar Cena
        </button>
      </header>
      <section>
        <h2>Cenas Adicionadas</h2>
        <div className='w-full h-[1px] bg-gray-300 my-4' />
        <SceneList  page="edit" scenes={groupScene.data.scenes} />
      </section>
      <footer className='w-full flex justify-between'>
        <button onClick={lastStep} className="border border-blackNissan rounded-full px-16 py-2 text-xl">
          Voltar
        </button>
        <button type="button" onClick={handleFinish} className="bg-blackNissan text-white py-2 px-16 rounded-full text-xl font-bold">
          Finalizar
        </button>
      </footer>
      <Drawer
        placement="right"
        open={openSceneDrawer}
        onClose={handleCloseSceneDrawer}
        className="p-4"
        size={500}
        >
          <form onSubmit={handleSubmit(onSubmitScene)} className="flex flex-col justify-between items-center w-full h-full p-4">
          <div className='flex flex-col gap-4 w-full'>
            <Typography variant="h6" color="blue-gray" className="uppercase text-2xl">
            <p>Adicionar CENA</p>
            </Typography>
            <Controller
              name="sceneName"
              control={control}
              rules={{ required: "Nome da Cena é obrigatório" }}
              render={({ field }) => <Input onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined} label="Nome da cena" {...field} />} />
            {errors.sceneName && errors.sceneName.message && (
              <span className="text-red-500 text-sm">{errors.sceneName.message}</span>
            )}
            <div className="flex flex-col gap-2">
              <label htmlFor="sceneImage" className="bg-blackNissan text-white rounded-full flex items-center justify-center py-2" id="scene-file-upload-label">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#fff" viewBox="0 0 256 256">
                  <path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34Zm-56,67.32a8,8,0,0,1-11.32,0L136,139.31V184a8,8,0,0,1-16,0V139.31l-10.34,10.35a8,8,0,0,1-11.32-11.32l24-24a8,8,0,0,1,11.32,0l24,24A8,8,0,0,1,157.66,149.66ZM152,88V44l44,44Z"></path>
                </svg>
                Imagem 360
              </label>
              <input
                {...register("sceneImage", {
                  required: "Imagem da Cena é obrigatória"
                })}
                className='hidden'
                type="file"
                id="sceneImage"
                name="sceneImage" />
              {errors.sceneImage && (
                <span className="text-red-500 text-sm">{errors.sceneImage.message}</span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-4 w-full">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blackNissan text-white py-4 rounded-full text-xl flex items-center justify-center"
            >
              {
                isLoading ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#f7f7f7" viewBox="0 0 256 256" className='animate-spin'><path d="M136,32V64a8,8,0,0,1-16,0V32a8,8,0,0,1,16,0Zm88,88H192a8,8,0,0,0,0,16h32a8,8,0,0,0,0-16Zm-45.09,47.6a8,8,0,0,0-11.31,11.31l22.62,22.63a8,8,0,0,0,11.32-11.32ZM128,184a8,8,0,0,0-8,8v32a8,8,0,0,0,16,0V192A8,8,0,0,0,128,184ZM77.09,167.6,54.46,190.22a8,8,0,0,0,11.32,11.32L88.4,178.91A8,8,0,0,0,77.09,167.6ZM72,128a8,8,0,0,0-8-8H32a8,8,0,0,0,0,16H64A8,8,0,0,0,72,128ZM65.78,54.46A8,8,0,0,0,54.46,65.78L77.09,88.4A8,8,0,0,0,88.4,77.09Z"></path></svg>
                ) : (
                <span>Salvar</span>
                )
              }
            </button>
            <button
              type="button"
              onClick={handleCloseSceneDrawer}
              className="border-red-500 border text-red-500 py-4 rounded-full text-xl"
            >
              Cancelar
            </button>
          </div>
        </form>
        </Drawer>
      {openScene && <SceneScreen />}
      {openDrawerSpot && <SpotForm />}
    </div>
  );
}