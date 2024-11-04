import { fetchGroupScene, fetchGroupSceneById } from "@/data/GroupScene";
import {SceneScreen} from "@/components/sceneScreen"

export default async function Scene({ params }: { params: { id: string } }) {
  const response =  await fetchGroupSceneById(params.id);
  const responseGroupScene =  await fetchGroupScene();
  const { data } = response;

  const { data: GroupScene } = responseGroupScene;

  return (
    <div className="">
      <SceneScreen
        groupScene={data}
        listGroupScene={GroupScene}
       />
    </div>
  );
}
