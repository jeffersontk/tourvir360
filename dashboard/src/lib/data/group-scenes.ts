import { ResponseGroupsScene, ResponseGroupScene } from "@/@types/groupScene";
import { ResponseUploadFile } from "@/@types/response";
import { ResponseScene } from "@/@types/scene";
import { ResponseSpot } from "@/@types/spot";
import { revalidateTag } from "next/cache";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
const resource = "/api/v1/group-scenes";

export async function fetchGroupsScene(): Promise<ResponseGroupsScene> {
  try {
    const response = await fetch(`${API_URL}${resource}`, {
      next: {
        tags: ["groupsScene"],
      },
    });

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

export async function fetchGroupSceneById(
  id: string | number
): Promise<ResponseGroupScene> {
  try {
    const response = await fetch(`${API_URL}${resource}/${id}`, {
      cache: "no-cache",
    });

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

export async function createGroupScene(
  name: string
): Promise<ResponseGroupScene> {
  try {
    const response = await fetch(`${API_URL}${resource}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
      }),
      next: {
        tags: ["groupsScene"],
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const groupScenes: ResponseGroupScene = await response.json();
    return groupScenes;
  } catch (error) {
    console.error("Failed to create group scene:", error);
    throw error;
  }
}

export async function uploadFile(
  file: File,
  id: number
): Promise<ResponseUploadFile> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}${resource}/${id}/files`, {
    method: "POST",
    headers: {
      accept: "application/json",
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload file");
  }
  const uploadFile = await response.json();

  return uploadFile;
}

export async function createSceneFromGroupScene(
  name: string,
  id: number
): Promise<ResponseScene> {
  try {
    const response = await fetch(`${API_URL}${resource}/${id}/scenes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
      }),
      next: {
        tags: ["groupScene"],
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const scene: ResponseScene = await response.json();
    return scene;
  } catch (error) {
    console.error("Failed to create scene:", error);
    throw error;
  }
}

export async function createSpotFromScene(
  groupSceneId: number,
  sceneId: number,
  payload: {
    name: string;
    position_x: number;
    position_y: number;
    position_z: number;
    description: string;
  }
): Promise<ResponseSpot> {
  try {
    const response = await fetch(
      `${API_URL}${resource}/${groupSceneId}/scenes/${sceneId}/spot`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const spot: ResponseSpot = await response.json();
    return spot;
  } catch (error) {
    console.error("Failed to create scene:", error);
    throw error;
  }
}

export async function updateGroupScene(groupSceneId: number, name: string) {
  try {
    const response = await fetch(`${API_URL}${resource}/${groupSceneId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
      }),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const groupScenes: ResponseGroupScene = await response.json();
    return groupScenes;
  } catch (error) {
    console.error("Failed to create group scene:", error);
    throw error;
  }
}

export async function updateFileGroupScene(
  groupSceneId: number,
  currentFileId: number,
  newFile: File
) {
  try {
    const deleteCurrentFile = await fetch(
      `${API_URL}/api/v1/files/${currentFileId}`,
      {
        method: "DELETE",
      }
    );
    if (!deleteCurrentFile) {
      throw new Error("Network response was not ok");
    }

    const formData = new FormData();
    formData.append("file", newFile);
    const response = await fetch(
      `${API_URL}${resource}/${groupSceneId}/files`,
      {
        method: "POST",
        headers: {
          accept: "application/json",
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to upload file");
    }
    const uploadFile = await response.json();

    return uploadFile;
  } catch (error) {}
}

interface props {
  newGroupSceneOrder: {
    id: number;
    order: number;
  }[];
}

export async function reorderGroupScene({ newGroupSceneOrder }: props) {
  const url = `${API_URL}${resource}/reorder`;

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newGroupSceneOrder),
      next: {
        tags: ["groupsScene"],
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const reorderedGroupScene = await response.json();
    revalidateTag("groupScene");
    return reorderedGroupScene;
  } catch (error) {
    console.error("Failed to reorder group scene:", error);
    throw error;
  }
}
