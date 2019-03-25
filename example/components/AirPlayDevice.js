import React from 'react'
import { View, Text } from 'react-native'
import { AirPlayControl } from 'react-native-advanced-player'

type Device = {
  deviceName: string,
  portName: string,
}

type Props = {
  devices: Device[],
}

// Shows currently connected audio output devices
export const AirPlayDevice = (props) => (
  <AirPlayControl.Consumer>
    {({ devices }: Props) => (
      <View style={{ flex: 1, alignItems: 'center' }}>
        {devices.map((device) => (
          <Text>
            {device.deviceName} {device.portName}
          </Text>
        ))}
      </View>
    )}
  </AirPlayControl.Consumer>
)
