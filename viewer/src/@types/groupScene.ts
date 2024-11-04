import { Scene, Media } from "@/@types/scene";

export type GroupScene = {
    id: number;
    name: string;
    order: number;
    createdAt: string;
    updatedAt: string;
    scenes: Scene[];
    media: Media;
  };
  
  export type ResponseGroupScene = {
    success: boolean;
    data: GroupScene;
  };
  
  export type ResponseGroupsScene = {
    success: boolean;
    data: GroupScene[];
  };