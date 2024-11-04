// SortableItem.tsx
'use client'

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GroupScene } from '@/@types/groupScene';
import Image from 'next/image';

interface Props {
  id: number;
  group: GroupScene;
}

export const SortableItem: React.FC<Props> = ({ id, group }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="flex flex-col w-full h-52 md:h-52 lg:h-52 mb-4">
      <Image
        src={group.media.path}
        alt={group.name}
        width={320}
        height={200}
        className="object-cover w-full min-h-[200px] max-h-[200px]"
      />
      <div className="flex items-center justify-between bg-blackNissan px-4 py-2">
        <span className="scene-name text-white">{group.name}</span>
        <span className="text-white">Cenas cadastradas {group.scenes?.length}</span>
      </div>
    </div>
  );
};
