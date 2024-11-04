'use client'
import { useAppStateContext } from '@/context/AppStateContext'
import { createSpotFromScene } from '@/lib/data/group-scenes'
import { uploadSpotFile } from '@/lib/data/spot'
import { Drawer, Option, Select, Textarea } from '@material-tailwind/react'
import Image from 'next/image'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

export default function SpotForm() {
  const [preview, setPreview] = useState(null)
  const { scenes, handleCloseDrawerSpot, currentSceneOpen, temporaryMarker, openDrawerSpot, setOpenDrawerSpot, setCurrentSceneOpen, setScenes, setTemporaryMarker, groupSceneId, groupScene, setGroupScene } = useAppStateContext()
  const [isLoading, setIsLoading] = useState(false)

  const poiForm = useForm({
    defaultValues: { poiType: 'image/*' | 'text/html' | 'video/mp4', poiDescription: '', poiFile: null },
    mode: 'onBlur',
  })

  const poiType = poiForm.watch("poiType")

  const onSubmitSpot = async(data) => {
    setIsLoading(true)
      let payload = {
        name: data.poiDescription, 
        description: data.poiDescription,
        spotFile: data.poiFile,
        position_x: temporaryMarker.x, 
        position_y: temporaryMarker.y, position_z: temporaryMarker.z
      }

      try{
        const createdSpot = await createSpotFromScene(groupSceneId,currentSceneOpen.id, payload);
        
        if(!createdSpot.success){
          console.error('Failed to create spot:', createdSpot.message);
          return
        }
        if(data.poiFile) {
          const uploadResponse = await uploadSpotFile(data.poiFile, createdSpot.data.id);
          payload.spotFile = uploadResponse.data.path
          payload.spotType= data.poiType
          payload.id = createdSpot.data.id
        }

        payload.spotType= data.poiType
        payload.id = createdSpot.data.id

        const updatedScene = {
          ...currentSceneOpen,
          spots: [...currentSceneOpen.spots, payload],
        }

        setScenes(scenes.map(scene =>
          scene.id === updatedScene.id ? updatedScene : scene
        ))
  
        setCurrentSceneOpen(updatedScene)
        setTemporaryMarker(null)
        poiForm.reset()
        setPreview(null)
        if(currentSceneOpen && groupScene.data){
          const {scenes} = groupScene.data
          const {spots} = currentSceneOpen
          const selectedScene = scenes.find(scene => scene.id = currentSceneOpen.id)
          const newArraySpots = [...spots]
          newArraySpots.push(payload)
          selectedScene.spots = newArraySpots
          setGroupScene(groupScene)
        }
        setIsLoading(false)
        setOpenDrawerSpot(false)
      }catch (error){
        setIsLoading(false)
        console.error('Failed to submit spot:', error);
      }
  }
  
  return (
    <div>
      <Drawer
        placement="right"
        open={openDrawerSpot}
        onClose={handleCloseDrawerSpot}
        className="p-4 z-[999999]"
        size={500}
      >
        <div className="flex flex-col gap-8 h-full">
          <h2 className="text-2xl font-bold">Detalhes do Ponto de Interesse</h2>
          <form onSubmit={poiForm.handleSubmit(onSubmitSpot)} className="h-full flex flex-col items-center justify-between gap-8">
            <div className="flex flex-col gap-4 w-full">
              <Controller
                name="poiType"
                control={poiForm.control}
                rules={{ required: "Tipo do ponto de interesse é obrigatório" }}
                render={({ field }) => (
                  <Select {...field} label="Tipo do ponto" className="input-drawer">
                    <Option value="text/html">Texto</Option>
                    <Option value="image/jpeg">Imagem</Option>
                    <Option value="video/mp4">Vídeo</Option>
                  </Select>
                )}
              />
              {poiForm.formState.errors.poiType && (
                <span className="text-red-500 text-sm">{poiForm.formState.errors.poiType.message}</span>
              )}

  
              <Textarea label="Descrição" {...poiForm.register("poiDescription", {
                required: "Descrição é obrigatória para o tipo Texto"
              })} />
              {poiForm.formState.errors.poiDescription && (
                <span className="text-red-500 text-sm">{poiForm.formState.errors.poiDescription.message}</span>
              )}
              {(poiType === 'image/jpeg' || poiType === 'video/mp4') && (
                <>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="poiFile" className="bg-blackNissan text-white rounded-full flex items-center justify-center py-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#fff" viewBox="0 0 256 256">
                        <path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34Zm-56,67.32a8,8,0,0,1-11.32,0L136,139.31V184a8,8,0,0,1-16,0V139.31l-10.34,10.35a8,8,0,0,1-11.32-11.32l24-24a8,8,0,0,1,11.32,0l24,24A8,8,0,0,1,157.66,149.66ZM152,88V44l44,44Z"></path>
                      </svg>
                      Adicionar arquivo
                    </label>
                    <input
                      type="file"
                      id="poiFile"
                      {...poiForm.register("poiFile", {
                        validate: value => {
                          if ((poiType === 'image/*' || poiType === 'video/mp4') && !preview) {
                            return "Arquivo é obrigatório para o tipo Imagem ou Vídeo"
                          }
                          return true
                        }
                      })}
                      className="hidden"
                      accept={poiType === 'image/*' ? 'image/*' : 'video/*'}
                      onChange={(e) => {
                        const file = e.target.files[0]
                        poiForm.setValue('poiFile', file)
                        if (file) {
                          setPreview(URL.createObjectURL(file))
                        } else {
                          setPreview(null)
                        }
                      }}
                    />
                    {poiForm.formState.errors.poiFile && (
                      <span className="text-red-500 text-sm">{poiForm.formState.errors.poiFile.message}</span>
                    )}
                  </div>
                  {preview && (
                    <>
                      {poiType === 'image/jpeg' ? (
                        <div className="mt-4 w-full h-40">
                          <Image src={preview} alt="Pré-visualização da Imagem" fill className='max-h-40 !relative' />
                        </div>
                      ) : (
                        <div className="mt-4">
                          <video width="500" controls>
                            <source src={preview} type="video/mp4" />
                            Seu navegador não suporta a tag de vídeo.
                          </video>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
            <div className="flex flex-col gap-4 w-full">
              <button type="submit" disabled={isLoading} className="bg-black text-white py-4 rounded-full text-xl">
              {
                isLoading ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#454545" viewBox="0 0 256 256" className='animate-spin'><path d="M136,32V64a8,8,0,0,1-16,0V32a8,8,0,0,1,16,0Zm88,88H192a8,8,0,0,0,0,16h32a8,8,0,0,0,0-16Zm-45.09,47.6a8,8,0,0,0-11.31,11.31l22.62,22.63a8,8,0,0,0,11.32-11.32ZM128,184a8,8,0,0,0-8,8v32a8,8,0,0,0,16,0V192A8,8,0,0,0,128,184ZM77.09,167.6,54.46,190.22a8,8,0,0,0,11.32,11.32L88.4,178.91A8,8,0,0,0,77.09,167.6ZM72,128a8,8,0,0,0-8-8H32a8,8,0,0,0,0,16H64A8,8,0,0,0,72,128ZM65.78,54.46A8,8,0,0,0,54.46,65.78L77.09,88.4A8,8,0,0,0,88.4,77.09Z"></path></svg>
                ) : (
                  <span>Salvar</span>
                )
              }
              </button>
              <button type="button" onClick={handleCloseDrawerSpot} className="border-red-500 border text-red-500 py-4 rounded-full text-xl">Cancelar</button>
            </div>
          </form>
        </div>
      </Drawer>
    </div>
  )
}
