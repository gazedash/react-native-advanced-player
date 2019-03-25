import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { Player } from './components'
import SystemSetting from 'react-native-system-setting'
import { VolumeControl, AirPlayControl } from 'react-native-advanced-player'

type Props = {}

export default class App extends Component<Props> {
  render() {
    return (
      <View style={styles.container}>
        <AirPlayControl.Provider>
          <VolumeControl.Provider playerInstance={SystemSetting}>
            <Player />
          </VolumeControl.Provider>
        </AirPlayControl.Provider>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 40,
  },
})
