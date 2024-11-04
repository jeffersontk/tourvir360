'use client'
import React, { useState } from 'react'
import { GroupSceneForm } from '../groupSceneForm'
import { SceneForm } from '@/components/sceneForm'

interface props {
  isEditor?: boolean;
}

export default function Forms({isEditor = false}:props) {
  const [nextStep, setNextStep] = useState(0)

  function handleNextStep() {
    setNextStep(nextStep + 1)
  }

  function handleLastStep() {
    setNextStep(nextStep - 1)
  }

  switch (nextStep) {
    case 0:
      return <GroupSceneForm nextStep={handleNextStep} isEditor={isEditor}/>
    case 1:
      return <SceneForm lastStep={handleLastStep} />
  }
}
