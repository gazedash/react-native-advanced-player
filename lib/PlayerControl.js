import React, { Component } from 'react'

import Player from 'react-native-video'
import { trackToGoogleCastTrack } from './trackToGoogleCastTrack'
import MusicControl from 'react-native-music-control'
import { setupPlayerNotificationControls } from './setupPlayerNotificationControls'
import { setupPlayerNotificationControlListeners } from './setupPlayerNotificationControlListeners'
import { trackToNowPlaying } from './trackToNowPlaying'
import { throttle } from './throttle'
import { PlayerStates } from './constants'

type GetProps = () => any

type Props = {
  track: {},
  currentTime: number,
  onMount: (data, getProps: GetProps) => {},
  onLoad: (data: any, getProps: GetProps) => {},
  onEnd: (data: any, getProps: GetProps) => {},
  onBuffer: (data: any, getProps: GetProps) => {},
  onProgress: (data: any, getProps: GetProps) => {},
  onSpeedChange: (speed: number, getProps: GetProps) => {},
  onVolumeChange: (percentage: number, getProps: GetProps) => {},
  onSeek: (percentage: number, getProps: GetProps) => {},
  onRewind: (seconds: number, getProps: GetProps) => {},
  onError: (error: any, getProps: GetProps) => {},
  onVideoError: (error: any, getProps: GetProps) => {},
  onChangeStatus: (status: string, getProps: GetProps) => {},
  children: any,
  onPrevious: () => {},
  onNext: () => {},

  castInstance: {
    playCast: () => {},
    pauseCast: () => {},
    sendMediaCast: (media, cb) => {},
    seekCast: (seconds) => {},
    stopCast: () => {},
    // shouldStop is true by default
    endSessionCast: (shouldStop) => {},
  },
  sleepControlInstance: () => Object,
  playerComponentProps: {},
}

type Progress = {
  currentTime: number,
  playableDuration: number,
  seekableDuration: number,
}

const PlayerContext = React.createContext()

// Main component responsible for playback
// Also controls playback of google cast, if one is connected
// Shows player controls on lock screen / notifications
export class PlayerControlProvider extends Component<Props> {
  state = {
    speed: 1,
    volume: 1,
    muted: false,
    duration: 0.0,
    playableDuration: 0,
    seekableDuration: 0,
    currentTime: 0.0,
    paused: true,
    ignoreSilentSwitch: 'ignore',
    playInBackground: true,
    playWhenInactive: true,
    isBuffering: false,
    repeat: false,
    completedPercentage: 0,
    remainingPercentage: 0,
  }

  static defaultProps = {
    track: {},
    currentTime: 0,
    onSpeedChange: () => {},
    onVolumeChange: () => {},
    onSeek: () => {},
    onRewind: () => {},
    onEnd: () => {},
    onLoad: () => {},
    onBuffer: () => {},
    onProgress: () => {},
    onError: () => {},
    onVideoError: () => {},
    children: () => {},
    onPrevious: () => {},
    onNext: () => {},
    onChangeStatus: () => {},
    setupNotificationControls: setupPlayerNotificationControls,
    setupNotificationControlListeners: setupPlayerNotificationControlListeners,
    castInstance: () => ({
      stopCast: () => {},
      playCast: () => {},
      pauseCast: () => {},
      sendMediaCast: () => {},
      seekCast: () => {},
      endSessionCast: () => {},
      registerListeners: () => {},
    }),
    sleepControlInstance: () => ({
      stopSleepTime: () => {},
      tickSleepTime: () => {},
      addSleepTime: () => {},
    }),
    playerComponentProps: {},
  }

  // Player instance
  player = null
  loaded = false

  onLoad = (data) => {
    const newData = {
      duration: data.duration,
      canStepBackward: data.canStepBackward,
      canStepForward: data.canStepForward,
    }

    // Sends media cast if Chromecast is available
    this.props
      .castInstance()
      .sendMediaCast(trackToGoogleCastTrack(this.props.track), () => {
        this.onSpeedChange(1)
      })

    this.setNowPlaying()

    this.setState(newData)
    this.props.onLoad(newData, this.getProps)

    console.log('onLoad')
    this.loaded = true
  }

  onProgress = (data: Progress) => {
    const currentTimePercentage = this.getCurrentProgress(data.currentTime)

    const completedPercentage = currentTimePercentage * 100
    const remainingPercentage = (1 - currentTimePercentage) * 100

    const nextState = {
      currentTime: data.currentTime,
      playableDuration: data.playableDuration,
      seekableDuration: data.seekableDuration,
      completedPercentage,
      remainingPercentage,
    }

    // Update progress in Notification controls
    MusicControl.updatePlayback({
      state: MusicControl.STATE_PLAYING,
      elapsedTime: data.currentTime,
    })

    this.setState(nextState)

    const duration = this.state.duration
    this.props.onProgress({ ...nextState, duration }, this.getProps)
  }

  onBuffer = (data: { isBuffering: boolean }) => {
    this.setState({ isBuffering: data.isBuffering })
    this.props.onBuffer(data, this.getProps)
  }

  /**
   * @param {number} currentTime elapsed seconds of currently played track
   *
   * @returns {number} progress from 0 to 1
   */
  getCurrentProgress = (currentTime: number): number => {
    if (currentTime > 0) {
      return parseFloat(currentTime) / parseFloat(this.state.duration)
    } else {
      return 0
    }
  }

  /**
   * @param {number} seconds Seconds to add to the current time (e.g. +15 or -15)
   */
  onRewind = (seconds: number) => {
    const timeToSeek = this.state.currentTime + seconds
    this.props.castInstance().seekCast(timeToSeek)
    this.player && this.player.seek(timeToSeek)
    this.props.onRewind(seconds, this.getProps)
  }

  seekInterval = null
  /**
   * Seeking method to do an initial seek.
   * Used due to the fact that audio file may not be loaded yet at the time of seeking call
   * @param {number} value Percentage of the track duration to progress to
   */
  onInitialSeek = (value: number) => {
    if (!this.loaded) {
      this.seekInterval = setInterval(() => {
        if (!this.loaded) {
          return
        } else {
          this.onSeek(value)
          console.log('onSeek')
          clearInterval(this.seekInterval)
        }
      }, 200)
    } else {
      this.onSeek(value)
    }
  }

  /**
   * @param {number} value Percentage of the track duration to progress to
   */
  onSeek = (value: number) => {
    const seconds = (value / 100) * this.state.duration
    this.props.castInstance().seekCast(seconds)
    this.player && this.player.seek(seconds)
    this.props.onSeek(value, this.getProps)
  }

  /**
   *
   * @param {number} volume From 0 to 100
   */
  onVolumeChange = (volumePercentage: number) => {
    this.setState({ volume: volumePercentage / 100 })
    this.props.onVolumeChange(volumePercentage, this.getProps)
  }

  onSpeedChange = (speed) => {
    this.setState({ speed: speed })
    this.props.onSpeedChange(speed, this.getProps)
  }

  onTogglePlayback = (force = false) => {
    if (force || this.state.paused) {
      this.onPlay()
    } else {
      this.onPause()
    }
  }

  setNowPlaying = () => {
    const { track } = this.props
    MusicControl.setNowPlaying(
      trackToNowPlaying({ ...track, duration: this.state.duration })
    )
  }

  updateNowPlaying = (playbackState) => {
    const { track } = this.props
    MusicControl.updatePlayback(
      trackToNowPlaying({
        ...track,
        playbackState,
        duration: this.state.duration,
      })
    )
  }

  /**
   * Stops playback, casting, resets now playing Notification control
   * and seeks track to 0 seconds (start)
   */
  onStop = () => {
    this.props.castInstance().stopCast()
    MusicControl.resetNowPlaying()
    this.setState(
      {
        paused: true,
      },
      () => {
        this.onSeek(0)
      }
    )

    this.onChangeStatus(PlayerStates.STATE_STOPPED)
  }

  componentDidMount() {
    const {
      setupNotificationControls,
      setupNotificationControlListeners,
    } = this.props
    this.props.castInstance().registerListeners()
    setupNotificationControls()
    setupNotificationControlListeners({
      onPlay: this.onPlay,
      onPause: this.onPause,
      onSeek: (seconds: number) => {
        const progressPercentage = (seconds / this.state.duration) * 100
        this.onSeek(progressPercentage)
      },
      onRewind: this.onRewind,
      onPrevious: this.props.onPrevious,
      onNext: this.props.onNext,
    })

    this.props.onMount(undefined, this.getProps)
  }

  defaultPlaybackState = {
    currentTime: 0,
    duration: 100,
    seekableDuration: 100,
    completedPercentage: 0,
    remainingPercentage: 100,
  }

  componentDidUpdate(prevProps) {
    const { track } = this.props
    if (track.url !== prevProps.track.url) {
      this.setState({
        ...this.defaultPlaybackState,
      })
      this.loaded = false
    }
  }

  componentWillUnmount() {
    // Reset now playing Notification controls if this hoc is unmounted
    this.props.castInstance().endSessionCast()
    this.props.castInstance().stopCast()
    MusicControl.resetNowPlaying()
  }

  onPlay = ({ reset = false } = {}) => {
    if (reset) {
      this.setState({
        ...this.defaultPlaybackState,
      })
    }
    this.props.castInstance().playCast()

    this.updateNowPlaying(MusicControl.STATE_PLAYING)

    this.setState({
      paused: false,
    })

    this.onChangeStatus(PlayerStates.STATE_PLAYING)
  }

  onPause = () => {
    this.onChangeStatus(PlayerStates.STATE_PAUSED)
    this.props.castInstance().pauseCast()

    MusicControl.updatePlayback({
      state: MusicControl.STATE_PAUSED,
      elapsedTime: this.state.currentTime,
    })

    this.setState({
      paused: true,
    })
  }

  onChangeStatus = (status) => {
    this.props.onChangeStatus(status, this.getProps)
  }

  setInternalState = (state) => {
    this.setState({
      ...this.state,
      state,
    })
  }

  onThrottledProgress = throttle(this.onProgress, 1000)

  getProps = () => {
    const { sleepControlInstance } = this.props
    const props = {
      track: this.props.track,
      speed: this.state.speed,
      paused: this.state.paused,
      playing: !this.state.paused,
      volume: this.state.volume,
      muted: this.state.muted,
      duration: this.state.duration,
      currentTime: this.state.currentTime,
      maxSeekValue: 100,
      playableDuration: this.state.playableDuration,
      seekableDuration: this.state.seekableDuration,
      completedPercentage: this.state.completedPercentage,
      remainingPercentage: this.state.remainingPercentage,
      onRewind: this.onRewind,
      onSeek: this.onSeek,
      onInitialSeek: this.onInitialSeek,
      onNext: this.props.onNext,
      onPrevious: this.props.onPrevious,
      onStop: this.onStop,
      onTogglePlayback: this.onTogglePlayback,
      onPlay: this.onPlay,
      onPause: this.onPause,
      onSpeedChange: this.onSpeedChange,
      onVolumeChange: this.onVolumeChange,
      setState: this.setInternalState,
      loaded: this.loaded,
      ...sleepControlInstance(),
    }

    return { ...props }
  }

  onError = (...args) => {
    this.props.onError(args, this.getProps)
  }

  onVideoError = (...args) => {
    this.props.onVideoError(args, this.getProps)
  }

  onEnd = (...args) => {
    this.props.onEnd(args, this.getProps)
  }

  render() {
    const props = this.getProps()

    const source = { uri: this.props.track.url, type: this.props.track.type }

    return (
      <>
        {source.uri ? (
          <Player
            ref={(player) => {
              this.player = player
            }}
            audioOnly={true}
            source={source}
            rate={this.state.speed}
            paused={this.state.paused}
            volume={this.state.volume}
            muted={this.state.muted}
            ignoreSilentSwitch={this.state.ignoreSilentSwitch}
            playInBackground={this.state.playInBackground}
            playWhenInactive={this.state.playWhenInactive}
            hideShutterView={true}
            onLoad={this.onLoad}
            onBuffer={this.onBuffer}
            onProgress={this.onThrottledProgress}
            onVideoError={this.onVideoError}
            onError={this.onError}
            onEnd={this.onEnd}
            {...this.props.playerComponentProps}
          />
        ) : null}
        <PlayerContext.Provider value={props}>
          {this.props.children}
        </PlayerContext.Provider>
      </>
    )
  }
}

export const PlayerControl = {
  Provider: PlayerControlProvider,
  Consumer: PlayerContext.Consumer,
}
