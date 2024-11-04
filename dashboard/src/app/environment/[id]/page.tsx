import React from 'react';
import { fetchGroupSceneById } from '@/lib/data/group-scenes';
import { PageContent } from '../Content';


export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  let groupScene;

  try {
    groupScene = await fetchGroupSceneById(id);
  } catch (error) {
    return <div>Ops, não foi encontrado ambiente</div>;
  }

  if (!groupScene) {
    return <div>Ops, não foi encontrado ambiente</div>;
  }
  console.log('groupScene', groupScene)
  const { name, scenes } = groupScene.data;

  return (
    <PageContent name={name} id={id} scenes={scenes} />
  );
}
