'use client'
import { Canvas, useThree } from '@react-three/fiber';
import { Sphere, OrbitControls, useTexture } from '@react-three/drei';
import { TextureLoader, Texture, Vector3, Vector2, Raycaster } from 'three';
import { useEffect, useState } from 'react';
import { useAppStateContext } from '@/context/AppStateContext';
import { Spot } from '@/@types/spot';

interface MarkersProps {
  spots: Spot[];
  temporaryMarker?: Vector3 | undefined;
  onMarkerClick: (marker: Vector3) => void;
}

interface ClickHandlerProps {
  openDrawerSpot: (postion: Vector3) => void;
  setTemporaryMarker: React.Dispatch<React.SetStateAction<Vector3 | undefined>>;
}

const Markers: React.FC<MarkersProps> = ({ spots, temporaryMarker, onMarkerClick }) => {
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
      {spots.map((spot, index) => {
        const {position_x, position_y, position_z, media} = spot
        const position = new Vector3(position_x, position_y, position_z);
          return (
            <sprite
              key={index}
              position={[position_x, position_y, position_z]}
              scale={[0.5, 0.5, 0.5]}
              onClick={() => onMarkerClick(position)}
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
      {temporaryMarker && (
        <Sphere args={[0.1, 32, 32]} position={temporaryMarker}>
          <meshBasicMaterial color="yellow" />
        </Sphere>
      )}
    </>
  );
};

const ClickHandler: React.FC<ClickHandlerProps> = ({openDrawerSpot, setTemporaryMarker}) => {
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
        setTemporaryMarker(point)
        openDrawerSpot(point)
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
  textureURL: string;
  openDrawerPOI: () => void
  initialMarkers: Vector3[];
  temporaryMarker: Vector3;
  setTemporaryMarker: React.Dispatch<React.SetStateAction<Vector3 | null>>;
  onMarkerClick: (marker: Vector3) => void;
}

const Scene: React.FC<props> = () => {
  const {currentSceneStateOpen, temporaryMarker, setTemporaryMarker, handleMarkerClick, handleOpenDrawerSpot} = useAppStateContext()

  const [texture, setTexture] = useState<Texture | null>(null);
  
  useEffect(() => {
    if(!currentSceneStateOpen) return
    
    const loader = new TextureLoader();
    loader.load(
      currentSceneStateOpen.media.path,
      (loadedTexture) => {
        
        setTexture(loadedTexture);
      },
      undefined,
      (error) => {
        console.error('Error loading texture', error);
      }
    );
  }, [currentSceneStateOpen]);

  if(!currentSceneStateOpen) return null;

  return (
    <div className="w-full h-[90vh] relative">
      <Canvas className="w-full h-full" camera={{ position: [0, 0, 0.1] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[0, 10, 5]} intensity={1} />
        {texture && (
          <Sphere args={[5, 60, 40]} scale={[-1, 1, 1]}>
            <meshBasicMaterial map={texture} side={2} />
          </Sphere>
        )}
        <Markers spots={currentSceneStateOpen.spots} temporaryMarker={temporaryMarker} onMarkerClick={handleMarkerClick}/>
        <OrbitControls />
        <ClickHandler openDrawerSpot={handleOpenDrawerSpot} setTemporaryMarker={setTemporaryMarker}/>
      </Canvas>
    </div>
  );
};

export default Scene;
