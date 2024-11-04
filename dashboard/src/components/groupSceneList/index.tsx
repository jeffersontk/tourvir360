// GroupSceneList.tsx
'use client'

import React, { useState } from 'react';
import { DndContext, useSensor, useSensors, PointerSensor, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { GroupScene } from '@/@types/groupScene';
import {SortableItem} from '../SortableItem';
import { reorderGroupScene } from '@/lib/data/group-scenes';

interface Props {
  groupScenes: GroupScene[];
}

export default function GroupSceneList({ groupScenes }: Props) {
  const [items, setItems] = useState<GroupScene[]>(groupScenes);

  const sensors = useSensors(
    useSensor(PointerSensor)
  );

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
  
    if (active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      // Atualizar a ordem dos itens
      const newItems = arrayMove(items, oldIndex, newIndex);
      newItems.forEach((item, index) => {
        item.order = index;
      });
      setItems(newItems);
  
      // Preparar a nova ordem para a chamada da API
      const newGroupSceneOrder = newItems.map((item) => ({
        id: item.id,
        order: item.order,
      }));
  
      try {
        const response = await reorderGroupScene({ newGroupSceneOrder });
        if (response.ok) {
          console.log('Group scene order updated successfully');
        } else {
          console.error('Failed to update group scene order');
        }
      } catch (error) {
        console.error('Failed to reorder group scene:', error);
        // Revert the changes in the UI if backend update fails
        setItems(arrayMove(newItems, newIndex, oldIndex));
      }
    }
  };
  

  return (
    <section className="w-full max-h-[650px]">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((item) => item.id)}>
          <article className='grid grid-cols-3 gap-8'>
            {items.sort((a, b) => a.order - b.order).map((sc) => (
              <SortableItem key={sc.id} id={sc.id} group={sc} />
            ))}
          </article>
        </SortableContext>
      </DndContext>
    </section>
  );
}
