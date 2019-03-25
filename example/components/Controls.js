import React from 'react'
import { View, Button, StyleSheet } from 'react-native'

export const Controls = (props) => (
  <View style={styles.control}>
    <Button title={'PREV'} onPress={() => props.onPrevious()} />
    <Button title={'-15'} onPress={() => props.onRewind(-15)} />
    <Button
      title={props.paused ? 'Play' : 'Pause'}
      onPress={props.onTogglePlayback}
    />
    <Button title={'STOP'} onPress={props.onStop} />
    <Button title={'+15'} onPress={() => props.onRewind(15)} />
    <Button title={'NEXT'} onPress={() => props.onNext()} />
  </View>
)

const styles = StyleSheet.create({
  control: {
    // flex: 1,
    marginTop: 10,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
})
