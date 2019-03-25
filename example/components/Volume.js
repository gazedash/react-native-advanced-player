import React from 'react'
import { View, Text, Slider } from 'react-native'
import { VolumeControl } from 'react-native-advanced-player'

export const Volume = () => (
  <VolumeControl.Consumer>
    {(volumeProps) => (
      <View>
        <Text>Volume</Text>
        <Text>{volumeProps.volume}</Text>
        <Slider
          value={volumeProps.volume}
          maximumValue={volumeProps.maxVolume}
          onSlidingComplete={volumeProps.onSetVolume}
        />
      </View>
    )}
  </VolumeControl.Consumer>
)
