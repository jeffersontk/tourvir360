// components/GroupSceneItem.tsx
'use client'

import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { GroupScene } from '@/@types/groupScene';
import Image from 'next/image';

interface Props {
  group: GroupScene;
  index: number;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
}

const GroupSceneItem: React.FC<Props> = ({ group, index, moveCard }) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const [, drop] = useDrop({
    accept: 'ITEM',
    hover(item: { type: string; index: number }) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      moveCard(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'ITEM',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div ref={ref} className="flex flex-col w-full h-52 md:h-52 lg:h-52 mb-4" style={{ opacity: isDragging ? 0.5 : 1 }}>
      <Image src={group.media.path} alt={group.name} width={320} height={200} className="object-cover w-full min-h-[200px] max-h-[200px]" />
      <div className="flex items-center justify-between bg-blackNissan px-4 py-2">
        <span className="scene-name text-white">{group.name}</span>
        <span className="text-white">Cenas cadastradas {group.scenes?.length}</span>
      </div>
    </div>
  );
}

export default GroupSceneItem;
