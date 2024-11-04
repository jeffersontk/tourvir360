import { ResponseUploadFile } from "@/@types/response";
import { revalidateTag } from "next/cache";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
const resource = "/api/v1/scenes";

export async function uploadSceneFile(
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

export async function deleteScene(id: number) {
  const response = await fetch(`${API_URL}${resource}/${id}`, {
    method: "DELETE",
    headers: {
      accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete scene");
  }
  return response.ok;
}

interface props {
  newScenesOrder: {
    id: number;
    order: number;
  }[];
}

// scene.ts
export async function reorderScenes({ newScenesOrder }: props) {
  const url = `${API_URL}${resource}/reorder`;
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newScenesOrder),
      next: {
        tags: ["groupScene"],
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const reorderedGroupScene = await response.json();
    if (typeof revalidateTag === "function") {
      revalidateTag("groupScene");
    } else {
      console.error("revalidateTag function is not available");
    }
    return reorderedGroupScene;
  } catch (error) {
    console.error("Failed to reorder group scene:", error);
    throw error;
  }
}
