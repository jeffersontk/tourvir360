import { ResponseUploadFile } from "@/@types/response";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
const resource = "/api/v1/spots";
export async function uploadSpotFile(
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

export async function deleteSpot(id: number) {
  try {
    const response = await fetch(`${API_URL}${resource}/${id}`, {
      method: "Delete",
      headers: {
        accept: "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to upload file");
    }
  } catch (error) {
    console.error(error);
  }
}
