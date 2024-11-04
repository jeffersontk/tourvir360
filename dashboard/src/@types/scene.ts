import { GroupScene } from "./groupScene";
import { Spot } from "./spot";

export interface Scene {
  id: number;
  name: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  groupSceneId: number;
  spots: Spot[];
  media: Media;
}

export type Media = {
  id: number;
  name: string;
  type: "image/*" | "text/html" | "video/mp4";
  contentLength: number;
  path: string;
  createdAt: string;
  updatedAt: string;
};

export type ResponseScenes = {
  success: boolean;
  data: {
    createdAt: string;
    groupScene: GroupScene;
    groupSceneId: number;
    id: number;
    name: string;
    order: number;
    updatedAt: string;
  }[];
};

export type ResponseScene = {
  success: boolean;
  data: {
    createdAt: string;
    groupScene: GroupScene;
    groupSceneId: number;
    id: number;
    name: string;
    order: number;
    updatedAt: string;
  };
};

