import * as React from 'react'

const VolumeContext = React.createContext()

type Props = {
  playerInstance: Object,
  children: any,
}

class VolumeControlProvider extends React.Component<Props> {
  state = {
    volume: 0,
    maxVolume: 100,
  }

  volumeListener = null

  getSetVolume = async () => {
    const { playerInstance } = this.props
    const volume = (await playerInstance.getVolume()) * 100
    this.setState({
      volume,
    })
  }

  componentDidMount() {
    const { playerInstance } = this.props
    this.getSetVolume()
    this.volumeListener = playerInstance.addVolumeListener((data) => {
      const volume = data.value * 100
      this.setState({
        volume,
      })
    })
  }

  componentWillUnmount() {
    const { playerInstance } = this.props
    playerInstance.removeVolumeListener(this.volumeListener)
  }

  /**
   * @param {number} volume value between 0 and 100
   */
  handleSetVolume = async (volume: number) => {
    const { playerInstance } = this.props
    // change the volume
    // value from 0 to 1, config { type: music or system }
    await playerInstance.setVolume(volume / 100)
  }

  render() {
    const props = {
      volume: this.state.volume,
      maxVolume: this.state.maxVolume,
      onSetVolume: this.handleSetVolume,
    }

    return (
      <VolumeContext.Provider value={props}>
        {this.props.children}
      </VolumeContext.Provider>
    )
  }
}

export const VolumeControl = {
  Provider: VolumeControlProvider,
  Consumer: VolumeContext.Consumer,
}
