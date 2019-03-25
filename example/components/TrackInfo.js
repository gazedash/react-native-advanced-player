import React from 'react'
import { View, Text } from 'react-native'

export const TrackInfo = (props) => (
  <View>
    <Text>{props.track.title}</Text>
    <Text>
      {'   '}Track url {props.track.url} {'    '}
    </Text>

    <Text>Сurrent Time {props.currentTime}</Text>
    <Text>Сompleted Percentage {props.completedPercentage}</Text>
    <Text>Duration {props.duration}</Text>
  </View>
)
