import React from 'react'
import { View, Text, Image } from 'react-native'
import { withEvent } from 'react-native-advanced-player'

export const Event = withEvent(
  (eventProps) =>
    eventProps.isEventShown && (
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Text>{eventProps.event.content}</Text>
        <Image
          source={{ uri: eventProps.event.img }}
          style={{ width: 300, height: 300 }}
        />
      </View>
    )
)
