import React from 'react'
import { Button } from 'react-native'

export const Speed = (props) => (
  <Button
    title={`Speed: ${props.speed}`}
    onPress={() => props.onSpeedChange(props.speed === 1 ? 2 : 1)}
  />
)
