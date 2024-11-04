'use client'
import { useAppStateContext } from '@/context/AppStateContext';
import { createGroupScene, updateFileGroupScene, updateGroupScene, uploadFile } from '@/lib/data/group-scenes';
import { Button } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
const resource = "/api/v1/group-scenes";

interface GroupSceneFormProps {
  nextStep: () => void;
  isEditor?: boolean;
}

type Inputs = {
  envName: string
  thumbnail: File[]
}

export function GroupSceneForm({ nextStep , isEditor = false}: GroupSceneFormProps) {
  const { setGroupSceneId, groupScene, setGroupScene} = useAppStateContext()
  const router = useRouter()
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [createGroupSceneLoading, setCreateGroupSceneLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<Inputs>()

  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setCreateGroupSceneLoading(true)
    if(isEditor) {
      if(!groupScene) return console.log('No group scene')
      
      const response = await updateGroupScene(groupScene.data.id, data.envName)
      
      if (!response.success ||!response.data) {
        throw new Error('Failed to update group scene')
      }
      setValue('envName', data.envName)
      if(data.thumbnail.length !== 0) {
        const updateFileResponse = await updateFileGroupScene(groupScene.data.id, groupScene.data.media.id, data.thumbnail[0])
        
        console.log('updateFileResponse', updateFileResponse)

        if(!updateFileResponse)
          throw new Error("Cannot upload image")

        setGroupScene({...groupScene, data: {...groupScene.data, name: data.envName, media: updateFileResponse.data.media}})
      }
      
      setGroupScene({...groupScene, data: {...groupScene.data, name: data.envName}})
      setCreateGroupSceneLoading(false)
      nextStep()
    } else {
      try {
        const response = await createGroupScene(data.envName)
        
        if (!response.success ||!response.data) {
          throw new Error('Failed to create group scene')
        }
  
        const groupSceneId = response.data.id
        setGroupSceneId(groupSceneId)
        const uploadResponse = await uploadFile(data.thumbnail[0], groupSceneId)
  
        if(!uploadResponse)
          throw new Error("Cannot upload image")
        
        console.log(uploadResponse)
        setCreateGroupSceneLoading(false)
        nextStep()
      } catch (error) {
        console.error('Failed to create group scene:', error)
        setCreateGroupSceneLoading(false)
      }
    }
    
  }

  const thumbnailFile = watch("thumbnail");
  const envName = watch("envName"); // Watch the environment name field

  // Check if the fields are filled
  const isFormValid = envName?.trim() !== '' && (isEditor || (thumbnailFile && thumbnailFile.length > 0));


  useEffect(() => {
    if (thumbnailFile && thumbnailFile.length > 0) {
      const file = thumbnailFile[0];
      const previewUrl = URL.createObjectURL(file);
      setThumbnailPreview(previewUrl);

      return () => URL.revokeObjectURL(previewUrl);
    } else if(groupScene && groupScene.data) {
      console.log('groupScene', groupScene)
      setThumbnailPreview(groupScene.data.media.path)
      setValue('envName',groupScene.data.name)
    }
  }, [thumbnailFile, groupScene]);

  const handleDelete = async () => {
    setDeleteLoading(true)
    try {
      if(!groupScene) throw new Error("Group scene not found");
      
      await fetch(`${API_URL}${resource}/${groupScene.data.id}`, {
        method: "DELETE"
      });
      setDeleteLoading(false)
      router.push(`/`)
    } catch (error) {
      setDeleteLoading(false)
      console.error(error);
    }
  }

  return (
    <div className="flex flex-col gap-8 bg-white rounded-md p-8">
      <h1 className='text-2xl font-medium text-blackNissan'>Informações de Ambiente</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 h-full">
        <div className="flex flex-col h-full max-h-[600px] gap-8 justify-between">
          <div className="flex flex-col gap-4">
            <div className="w-full flex flex-col gap-2">
              <label htmlFor="environment-name" className="text-blackNissan text-xl">Nome</label>
              <input
                type="text"
                id="envName"
                {...register("envName", {
                  required: "Nome do Ambiente é obrigatório",
                })}
                className="py-2 pl-4 rounded-md h-14 border border-blackNissan"
              />
              {errors.envName && (
                <span className="text-red-500 text-sm">{errors.envName.message}</span>
              )}
            </div>

            <div className="flex flex-col w-full">
              <label htmlFor="thumbnail" className="w-full h-14 flex items-center justify-center border border-blackNissan rounded-md py-4 px-4 text-blackNissan text-md cursor-pointer" id="scene-file-upload-label">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#fff" viewBox="0 0 256 256">
                  <path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34Zm-56,67.32a8,8,0,0,1-11.32,0L136,139.31V184a8,8,0,0,1-16,0V139.31l-10.34,10.35a8,8,0,0,1-11.32-11.32l24-24a8,8,0,0,1,11.32,0l24,24A8,8,0,0,1,157.66,149.66ZM152,88V44l44,44Z"></path>
                </svg>
                Capa do Ambiente
              </label>
              <input
                {...register("thumbnail", {
                  required: isEditor ? "": "A capa do Ambiente é obrigatorio"
                })}
                className='hidden'
                type="file"
                id="thumbnail"
                name="thumbnail"
                accept="image/*"
              />
              {errors.thumbnail && (
                <span className="text-red-500 text-sm">{errors.thumbnail.message}</span>
              )}

              {thumbnailPreview && (
                <div className="mt-4">
                 <Image 
                 src={thumbnailPreview} 
                 alt="Pré-visualização da Imagem" sizes="100vw"
                  style={{
                    width: '100%',
                    height: 'auto',
                  }}
                  width={500}
                  height={150}
                  className='max-h-80 object-contain'
                />
                </div>
              )}
            </div>
          </div>
          <div className={`w-full flex ${isEditor ? 'justify-between' : 'justify-end'}`}>
            {
              isEditor && 
                <Button onClick={handleDelete} disabled={deleteLoading} variant="outlined" color="red" className="rounded-full text-lg font-medium px-16" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                  {
                    deleteLoading? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#454545" viewBox="0 0 256 256" className='animate-spin'><path d="M136,32V64a8,8,0,0,1-16,0V32a8,8,0,0,1,16,0Zm88,88H192a8,8,0,0,0,0,16h32a8,8,0,0,0,0-16Zm-45.09,47.6a8,8,0,0,0-11.31,11.31l22.62,22.63a8,8,0,0,0,11.32-11.32ZM128,184a8,8,0,0,0-8,8v32a8,8,0,0,0,16,0V192A8,8,0,0,0,128,184ZM77.09,167.6,54.46,190.22a8,8,0,0,0,11.32,11.32L88.4,178.91A8,8,0,0,0,77.09,167.6ZM72,128a8,8,0,0,0-8-8H32a8,8,0,0,0,0,16H64A8,8,0,0,0,72,128ZM65.78,54.46A8,8,0,0,0,54.46,65.78L77.09,88.4A8,8,0,0,0,88.4,77.09Z"></path></svg>
                    ) : (
                      <span>Deletar</span>
                    )
                  }
                </Button>
            }
            <Button type="submit"  disabled={!isFormValid || createGroupSceneLoading} className="text-white bg-blackNissan rounded-full text-lg font-medium px-16" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              {
                createGroupSceneLoading ? 
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#f7f7f7" viewBox="0 0 256 256" className='animate-spin'><path d="M136,32V64a8,8,0,0,1-16,0V32a8,8,0,0,1,16,0Zm88,88H192a8,8,0,0,0,0,16h32a8,8,0,0,0,0-16Zm-45.09,47.6a8,8,0,0,0-11.31,11.31l22.62,22.63a8,8,0,0,0,11.32-11.32ZM128,184a8,8,0,0,0-8,8v32a8,8,0,0,0,16,0V192A8,8,0,0,0,128,184ZM77.09,167.6,54.46,190.22a8,8,0,0,0,11.32,11.32L88.4,178.91A8,8,0,0,0,77.09,167.6ZM72,128a8,8,0,0,0-8-8H32a8,8,0,0,0,0,16H64A8,8,0,0,0,72,128ZM65.78,54.46A8,8,0,0,0,54.46,65.78L77.09,88.4A8,8,0,0,0,88.4,77.09Z"></path></svg>
                :
                  <span>Continuar</span>
              }
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
