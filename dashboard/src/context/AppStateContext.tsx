'use client'
import { ResponseGroupScene } from '@/@types/groupScene';
import { Scene } from '@/@types/scene';
import { Spot } from '@/@types/spot';
import { deleteScene } from '@/lib/data/scene';
import { useParams } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import useSWR, { BareFetcher, SWRConfiguration, SWRResponse } from 'swr';
import { Vector3 } from 'three';

interface AppStateContextType {
  openSceneDrawer: boolean;
  setOpenSceneDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  openDrawerSpot: boolean;
  setOpenDrawerSpot: React.Dispatch<React.SetStateAction<boolean>>;
  openScene: boolean;
  setOpenScene: React.Dispatch<React.SetStateAction<boolean>>;
  scenes: Scene[]; 
  setScenes: React.Dispatch<React.SetStateAction<Scene[]>>;
  scenesState: Scene[]; 
  setScenesState: React.Dispatch<React.SetStateAction<Scene[]>>;
  currentSceneStateOpen: Scene | undefined;
  setCurrentSceneStateOpen: React.Dispatch<React.SetStateAction<Scene | undefined>>;
  currentSceneOpen: Scene | undefined;
  setCurrentSceneOpen: React.Dispatch<React.SetStateAction<Scene | undefined>>;
  currentSpotPosition: Vector3 | undefined; 
  setCurrentSpotPosition: React.Dispatch<React.SetStateAction<Vector3 | undefined>>;
  temporaryMarker: Vector3 | undefined; 
  setTemporaryMarker: React.Dispatch<React.SetStateAction<Vector3 | undefined>>;
  selectedSpot: Spot | undefined;
  setSelectedSpot: React.Dispatch<React.SetStateAction<Spot | undefined>>;
  handleOpenSceneDrawer: () => void;
  handleDeleteSceneList: (id: number) => Promise<void>;
  handleCloseSceneDrawer: () => void;
  handleCloseSceneDialog: () => void;
  handleOpenSceneDialog: (scene: Scene) => void; 
  handleMarkerClick: (marker: Vector3) => void; 
  handleOpenDrawerSpot: (positionSpot: Vector3) => void;
  handleCloseDrawerSpot: () => void;
  handleOpenScene: (scene: Scene) => void; 
  handleOpenSceneState: (scene: Scene) => void; 
  handleCloseScene: () => void;
  handleCloseSpotDialog: () => void;
  setGroupSceneId: React.Dispatch<React.SetStateAction<number | undefined>>;
  groupSceneId: number | undefined;
  groupScene: ResponseGroupScene | undefined;
  setGroupScene: React.Dispatch<React.SetStateAction<ResponseGroupScene  | undefined>>;
  isLoadingGroupScene: boolean;
  openSendToApi: boolean;
  handleCloseSendToApi: () => void;
  setOpenSendToApi: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveStep: React.Dispatch<React.SetStateAction<number | undefined>>;
  activeStep: Number | undefined;
  useGroupSceneById: (id: string) => SWRResponse<ResponseGroupScene, ErrorType, SWRConfiguration<ResponseGroupScene, ErrorType, BareFetcher<ResponseGroupScene>> | undefined>
  deleteSceneLoading: boolean;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

interface AppStateProviderProps {
  children: ReactNode;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || ""
const fetcher = (url: string) => fetch(url).then(res => res.json())

type ErrorType = {
  message: string
}

export const AppStateProvider: React.FC<AppStateProviderProps> = ({ children }) => {
  const [openSceneDrawer, setOpenSceneDrawer] = useState<boolean>(false);
  const [openDrawerSpot, setOpenDrawerSpot] = useState<boolean>(false);
  const [openScene, setOpenScene] = useState<boolean>(false);
  const [openSendToApi, setOpenSendToApi] = useState<boolean>(false);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [scenesState, setScenesState] = useState<Scene[]>([]);
  const [currentSceneStateOpen, setCurrentSceneStateOpen] = useState<Scene | undefined>();
  const [currentSceneOpen, setCurrentSceneOpen] = useState<Scene | undefined>();
  const [temporaryMarker, setTemporaryMarker] = useState<Vector3 | undefined>();
  const [selectedSpot, setSelectedSpot] = useState<Spot | undefined>(); 
  const [currentSpotPosition, setCurrentSpotPosition] = useState<Vector3 | undefined>(); 
  const [groupSceneId, setGroupSceneId] = useState<number>(); 
  const [groupScene, setGroupScene] = useState<ResponseGroupScene | undefined>(); 
  const [activeStep,setActiveStep] = useState<number | undefined>();
  const [deleteSceneLoading, setDeleteSceneLoading] = useState(false)

  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id; 

  const useGroupSceneById = () => {
    return useSWR<ResponseGroupScene, ErrorType>(
      `${API_URL}/api/v1/group-scenes/${groupSceneId ?? id}`, 
      fetcher,
      {
        revalidateOnFocus: false,
      }
    );
  }

  const { data: groupSceneData, isLoading: isLoadingGroupScene } = useGroupSceneById();

  useEffect(() => {
    if (groupSceneData) {
      setGroupScene(groupSceneData);
    }
  }, [groupSceneData]);

  const handleOpenSceneDrawer = () => setOpenSceneDrawer(true);
  const handleCloseSceneDrawer = () => setOpenSceneDrawer(false);

  const handleCloseSceneDialog = () => {
    setOpenScene(false);
  };

  const handleCloseSendToApi = () => setOpenSendToApi(false);

  const handleOpenSceneState = (scene: Scene) => {
    setCurrentSceneStateOpen(scene);
    setOpenScene(true);
  };
  
  const handleOpenScene = (scene: Scene) => {
    setCurrentSceneOpen(scene);
    setOpenScene(true);
  };

  const handleCloseScene = () => {
    setOpenScene(false);
  };

  const handleOpenSceneDialog = (scene: any) => {
    setCurrentSceneOpen(scene);
    setOpenScene(true);
  };

  const handleDeleteSceneList = async (id: number) => {
    setDeleteSceneLoading(true);
    try {
      const hasDelete = await deleteScene(id);
      if (hasDelete) {
        if(groupScene && groupScene.data){
            const {scenes} = groupScene.data
            const newArray = scenes.filter(scene => scene.id !== id)
            groupScene.data.scenes = newArray
            setGroupScene(groupScene)
        }
        setDeleteSceneLoading(false);
      }
    } catch (error) {
      console.error('Error deleting scene', error);
      setDeleteSceneLoading(false);
    }

  };

  const handleMarkerClick = (marker: any) => {
    if(currentSceneStateOpen) {
      const spot = currentSceneStateOpen.spots.find((item) => item.position_x === marker.x); 
      setSelectedSpot(spot);
      
    } else if(currentSceneOpen) {
      const spot = currentSceneOpen.spots.find((item) => item.position_x === marker.x); 
      setSelectedSpot(spot);
    }
    return null
  };

  const handleOpenDrawerSpot = (positionSpot: any) => {
    setCurrentSpotPosition(positionSpot);
    setTemporaryMarker(positionSpot);
    setOpenDrawerSpot(true);
  };

  const handleCloseDrawerSpot = () => {
    setTemporaryMarker(undefined);
    setOpenDrawerSpot(false);
  };

  const handleCloseSpotDialog = () => {
    setSelectedSpot(undefined);
  };

  return (
    <AppStateContext.Provider
      value={{
        openSceneDrawer,
        setOpenSceneDrawer,
        openDrawerSpot,
        setOpenDrawerSpot,
        openScene,
        setOpenScene,
        scenes,
        setScenes,
        scenesState,
        setScenesState,
        currentSceneOpen,
        currentSceneStateOpen,
        setCurrentSceneStateOpen,
        setCurrentSceneOpen,
        currentSpotPosition,
        setCurrentSpotPosition,
        temporaryMarker,
        setTemporaryMarker,
        selectedSpot,
        setSelectedSpot,
        handleOpenSceneDrawer,
        handleDeleteSceneList,
        handleCloseSceneDrawer,
        handleCloseSceneDialog,
        handleOpenSceneDialog,
        handleMarkerClick,
        handleOpenDrawerSpot,
        handleCloseDrawerSpot,
        handleOpenScene,
        handleOpenSceneState,
        handleCloseScene,
        handleCloseSpotDialog,
        setGroupSceneId,
        groupSceneId,
        groupScene,
        setGroupScene,
        isLoadingGroupScene,
        openSendToApi,
        setOpenSendToApi,
        handleCloseSendToApi,
        activeStep,
        setActiveStep,
        useGroupSceneById,
        deleteSceneLoading
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppStateContext = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppStateContext must be used within an AddPageProvider');
  }
  return context;
};
