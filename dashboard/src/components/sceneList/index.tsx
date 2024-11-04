'use client'

import React, { useState } from 'react';
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { Scene } from '@/@types/scene';
import { SceneItem } from '../sceneItem';
import { reorderScenes } from '@/lib/data/scene';
import { revalidateTag } from 'next/cache';
import { useAppStateContext } from '@/context/AppStateContext';

interface Props {
  page: 'environment' | 'edit' | 'add';
  scenes: Scene[];
  isDragDisabled?: boolean;
}

export function SceneList({ page, scenes, isDragDisabled = true }: Props) {
  console.log('scenes', scenes)
  const {setGroupScene, groupScene} = useAppStateContext()

  const sensors = useSensors(useSensor(PointerSensor));

  if (!groupScene || !groupScene.success) {
    return <div>Ops não foi encontrado ambiente</div>;
  }

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = groupScene.data.scenes.findIndex((item) => item.id === active.id);
      const newIndex = groupScene.data.scenes.findIndex((item) => item.id === over.id);

      const newItems = arrayMove(groupScene.data.scenes, oldIndex, newIndex).map((item, index) => ({ ...item, order: index, }));
      
           
      const newScenesOrder = newItems.map((item) => ({
        id: item.id,
        order: item.order,
      }));
      try {
        const response = await reorderScenes({ newScenesOrder });
        
        if (response.success) {
          console.log('Group scene reordered successfully:', response.data);
          const updatedGroupScene = { ...groupScene, data: { ...groupScene.data, scenes: newItems, }, }; 
          setGroupScene(updatedGroupScene);
        } else {
          console.error('Failed to reorder group scene:', response.error);
        }
      } catch (error) {
        console.error('Failed to reorder group scene:', error);
        // Revert the changes in the UI if backend update fails
        const revertedItems = arrayMove(newItems, newIndex, oldIndex); const revertedGroupScene = { ...groupScene, data: { ...groupScene.data, scenes: revertedItems, }, }; setGroupScene(revertedGroupScene);
      }
    }
  };

  const renderSceneItem = () => {
    if (page === 'environment' && groupScene.data.scenes.length > 0) {
      return (
        <section className='w-full grid grid-cols-2 gap-8 overflow-auto pr-4'>
          {groupScene.data.scenes
          .sort((a, b) => a.order - b.order)
          .map((scene, index: number) => (
            <SceneItem key={scene.id} scene={scene} index={index} />
          ))}
        </section>
      );
    } else if (page === 'edit' && groupScene.data.scenes.length > 0) {
      return (
        <section className='w-full grid grid-cols-2 gap-8 overflow-auto pr-4'>
          {groupScene.data.scenes
          .sort((a, b) => a.order - b.order)
          .map((scene, index: number) => (
            <SceneItem key={scene.id} scene={scene} index={index} isDragDisabled={isDragDisabled} />
          ))}
        </section>
      );
    } else {
      return (
        <div className='flex items-center justify-center text-center'>
          <p className='text-blackNissan'>
            Não há cenas cadastradas neste ambiente. <br />
            Clique em Adicionar cena
          </p>
        </div>
      );
    }
  };

  return (
    <div className='flex justify-center items-center w-full'>
      <section className="w-full max-w-[1280px] max-h-[50vh] bg-white flex flex-col gap-8 overflow-auto">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext disabled={isDragDisabled} items={groupScene.data.scenes.map((item) => item.id)}>
            <article className="overflow-auto pr-4">
              {renderSceneItem()}
            </article>
          </SortableContext>
        </DndContext>
      </section>
    </div>
  );
}
