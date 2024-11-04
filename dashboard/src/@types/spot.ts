import { GroupScene } from "./groupScene";
import { Media, Scene } from "./scene";

export interface Spot {
    id: string;
    name: string;
    position_x: number;
    position_y: number;
    position_z: number;
    description: string;
    createdAt: string;
    updatedAt: string;
    sceneId: number;
    media: Media;
    // poiType: string;
    // poiDescription: string;
    // spotFile: string | null;
    // spotType: string;
  }

  export type ResponseSpot = {
    success: boolean;
    data: {
      createdAt: string;
      description: string;
      groupScene: GroupScene;
      id: number;
      name: string;
      position_x: number;
      position_y: number;
      position_z: number;
      scene: Scene;
      sceneId: number;
      updatedAt: string;
    };
  };
  