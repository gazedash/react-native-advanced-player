import React from 'react'
import { Platform } from 'react-native'
import { AirPlayListener, AirPlay } from 'react-native-airplay-ios'

type Props = {
  children: any,
}

const AirPlayContext = React.createContext()

class AirPlayProvider extends React.Component<Props> {
  state = {
    devices: [],
  }

  componentDidMount() {
    AirPlay.startScan()
    this.deviceConnected = AirPlayListener.addListener(
      'deviceConnected',
      ({ devices }) => {
        // console.log(devices)
        this.setState({
          devices,
        })
      }
    )
  }

  componentWillUnmount() {
    this.deviceConnected.remove()
  }

  render() {
    return (
      <AirPlayContext.Provider value={this.state}>
        {this.props.children}
      </AirPlayContext.Provider>
    )
  }
}

export const AirPlayControl = Platform.select({
  ios: {
    Provider: AirPlayProvider,
    Consumer: AirPlayContext.Consumer,
  },
  android: {
    Provider: ({ children }) => children,
    Consumer: ({ children }) => children({ devices: [] }),
  },
})
