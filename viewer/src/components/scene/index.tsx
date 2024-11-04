'use client'
import { Canvas, useThree, } from '@react-three/fiber';
import { Sphere, OrbitControls, useTexture } from '@react-three/drei';
import { TextureLoader, Texture, Vector2, Raycaster, Vector3 } from 'three';
import { useEffect, useState } from 'react';
import { Spot } from '@/@types/spot';
import { Scene as SceneType } from '@/@types/scene';

interface MarkersProps {
  spots: Spot[];
  handleSelectSpot: (position: Vector3) => void;
}

const Markers: React.FC<MarkersProps> = ({ spots, handleSelectSpot }) => {
  const spotImage = useTexture('/assets/spot-image.png'); 
  const spotText = useTexture('/assets/spot-text.png');
  const spotVideo = useTexture('/assets/spot-video.png');

  const getTextureByType = (spotType: string | null) => {
    if(spotType && spotType.includes('image')){
      return spotImage;
    }else if(spotType && spotType.includes('video')){
      return spotVideo;
    }else {
      return spotText;
    }
  };

  return (
    <>
      {spots && spots.length > 0 && spots.map((spot, index) => {
        const {position_x, position_y, position_z} = spot
        const position = new Vector3(position_x, position_y, position_z);
          return (
            <sprite
              key={index}
              position={[position_x, position_y, position_z]}
              scale={[0.5, 0.5, 0.5]}
              onClick={()=> handleSelectSpot(position)}
            >
              <spriteMaterial 
              attach="material" 
              map={getTextureByType(spot.media?.type)} 
              depthTest={false}
                depthWrite={false}
                sizeAttenuation={true}
              />
            </sprite>
          )
      })}
    </>
  );
};

const ClickHandler: React.FC = () => {
  const { camera, gl, scene } = useThree();
  const raycaster = new Raycaster();
  const mouse = new Vector2();

  useEffect(() => {
    const handleRightClick = (event: MouseEvent) => {
      event.preventDefault();
      const { clientX, clientY } = event;
      const { left, top, width, height } = gl.domElement.getBoundingClientRect();
      mouse.x = ((clientX - left) / width) * 2 - 1;
      mouse.y = -((clientY - top) / height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        const point = intersects[0].point.clone();
        console.log('Clicked on spot at:', point);
      }
    };

    gl.domElement.addEventListener('contextmenu', handleRightClick);

    return () => {
      gl.domElement.removeEventListener('contextmenu', handleRightClick);
    };
  }, [camera, gl, scene, mouse, raycaster]);

  return null;
};

interface props {
  currentSceneOpen: SceneType
  handleSelectSpot: (position: Vector3) => void;
}

const Scene: React.FC<props> = ({currentSceneOpen, handleSelectSpot}) => {

  const [texture, setTexture] = useState<Texture | null>(null);
  
  useEffect(() => {
    if(!currentSceneOpen) return
    
    const loader = new TextureLoader();
    loader.load(
      currentSceneOpen.media.path,
      (loadedTexture) => {
        setTexture(loadedTexture);
      },
      undefined,
      (error) => {
        console.error('Error loading texture', error);
      }
    );
  }, [currentSceneOpen]);

  if(!currentSceneOpen) return null;
  
  return (
    <div className="w-full h-screen">
      <Canvas className="w-full h-full" camera={{ position: [0, 0, 0.1] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[0, 10, 5]} intensity={1} />
        {texture && (
          <Sphere args={[5, 60, 40]} scale={[-1, 1, 1]}>
            <meshBasicMaterial map={texture} side={2} />
          </Sphere>
        )}
        <Markers
          spots={currentSceneOpen.spots} 
          handleSelectSpot={handleSelectSpot}
        />
        <OrbitControls />
        <ClickHandler />
      </Canvas>
    </div>
  );
};

export default Scene;
