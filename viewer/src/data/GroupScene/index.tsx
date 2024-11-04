import { ResponseGroupScene, ResponseGroupsScene } from "@/@types/groupScene";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
const resource = "/api/v1/group-scenes";

export async function fetchGroupScene(): Promise<ResponseGroupsScene> {
  try {
    const response = await fetch(`${API_URL}${resource}`);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const groupScenes: ResponseGroupsScene = await response.json();
    return groupScenes;
  } catch (error) {
    console.error("Failed to fetch groups scene:", error);
    throw error;
  }
}
export async function fetchGroupSceneById(id: string): Promise<ResponseGroupScene> {
  try {
    const response = await fetch(`${API_URL}${resource}/${id}`);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const groupScenes: ResponseGroupScene = await response.json();
    return groupScenes;
  } catch (error) {
    console.error("Failed to fetch groups scene:", error);
    throw error;
  }
}