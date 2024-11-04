import { Spot } from '@/@types/spot';
import Image from 'next/image';
import React from 'react';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectSpot: Spot
}

function renderMedia(selectedSpot: Spot) {
  console.log(selectedSpot)
  if(selectedSpot.media && selectedSpot.media.type && selectedSpot.media.type.includes('image')){
    return (
    <div className='p-4 bg-white'>
      <Image src={selectedSpot.media.path} alt="POI Image" width={572} height={200} className='w-full object-cover' />
    </div>

    )
  }
  else if(selectedSpot.media && selectedSpot.media.type && selectedSpot.media.type.includes('video')){
    return <div className='p-4 bg-white'>
    <video width="500" controls className='w-full object-cover'>
      <source src={selectedSpot.media.path} type="video/mp4" />
      Seu navegador não suporta a tag de vídeo.
    </video>
  </div>
  }else {
    return null
  }
}

const Dialog: React.FC<DialogProps> = ({ isOpen, onClose, selectSpot }) => {
  if (!isOpen) return null;

  if(!selectSpot.media){

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/3">
        <div className='bg-blackNissan text-white flex justify-between items-center p-4 rounded-t-md'>
          <h2>
            Detalhes do ponto de interesse
          </h2>
          <button onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#ffffff" viewBox="0 0 256 256"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg>
          </button>
        </div>
        <div className="p-4">
          {selectSpot.description}
        </div>
      </div>
    </div>
  );
  }
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center rounded-t-md">
      <div className="rounded-lg shadow-lg w-11/12 md:w-1/3 flex">
        
        {renderMedia(selectSpot)}
        <div className='bg-blackNissan text-white flex flex-col items-center p-4 '>
          <button onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#ffffff" viewBox="0 0 256 256"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg>
          </button>
          <div className="p-4">
            {selectSpot.description}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dialog;
