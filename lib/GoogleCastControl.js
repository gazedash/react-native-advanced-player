import React from 'react'
import GoogleCast from 'react-native-google-cast'

export const EVENTS = [
  'SESSION_STARTING',
  'SESSION_STARTED',
  'SESSION_START_FAILED',
  'SESSION_SUSPENDED',
  'SESSION_RESUMING',
  'SESSION_RESUMED',
  'SESSION_ENDING',
  'SESSION_ENDED',
  'MEDIA_STATUS_UPDATED',
  'MEDIA_PLAYBACK_STARTED',
  'MEDIA_PLAYBACK_ENDED',
  'MEDIA_PROGRESS_UPDATED',
]

const NotConnectedEvents = [
  '',
  'SESSION_START_FAILED',
  'SESSION_SUSPENDED',
  'SESSION_ENDING',
  'SESSION_ENDED',
]

const ConnectedEvents = [
  'SESSION_STARTING',
  'SESSION_STARTED',
  'SESSION_RESUMING',
  'SESSION_RESUMED',
  'MEDIA_STATUS_UPDATED',
  'MEDIA_PLAYBACK_STARTED',
  'MEDIA_PLAYBACK_ENDED',
  'MEDIA_PROGRESS_UPDATED',
]

const StartEvents = [
  'SESSION_STARTING',
  'SESSION_STARTED',
  'SESSION_RESUMING',
  'SESSION_RESUMED',
]

// This class provides methods for handling Google Cast session
// e.g. receiving events, controlling playback, casting media

// Make sure to registerListeners first
// And endSession when you need to
class _GoogleCastControl {
  state = {
    castState: 'NotConnected',
    eventName: '',
    eventData: [],
    media: {},
    playPosition: 0,
  }

  listeners = []

  setState = (state) => {
    this.state = {
      ...this.state,
      ...state,
    }
  }

  updateCastProgress = (data) => {
    this.setState({
      playPosition: data.currentTime,
    })
  }

  handleEvent = (eventName) => (...eventData) => {
    // if sessions starts, cast currently playing track and
    // seek (set playPosition), so Google Cast is in sync with player
    if (StartEvents.includes(eventName)) {
      this.castMedia({
        ...this.state.media,
        playPosition: this.state.playPosition,
      })
    }
    if (NotConnectedEvents.includes(eventName)) {
      this.setState({ castState: 'NotConnected' })
    } else {
      if (ConnectedEvents.includes(eventName)) {
        this.setState({ castState: 'Connected' })
      }
    }
    this.setState({ eventName, eventData })
  }

  registerListeners = () => {
    EVENTS.forEach((event) => {
      const listener = this.handleEvent(event)
      // Adds listeners to an array to be able to clean up listeners on unmount
      this.listeners.push([event, listener])
      GoogleCast.EventEmitter.addListener(GoogleCast[event], listener)
    })
  }

  unregisterListeners() {
    this.listeners.forEach(([event, listener]) => {
      GoogleCast.EventEmitter.removeListener(GoogleCast[event], listener)
    })
  }

  /**
   * A method to check if Google Cast is currently connected
   * For example, to be able to call Google Cast methods only if there is an
   * active seession
   */
  isConnected = () => {
    return GoogleCast.getCastState()
      .then((state) => state === 'Connected')
      .catch((e) => console.error(e))
  }

  play = () => {
    this.isConnected().then((isConnected) => {
      if (isConnected) {
        GoogleCast.play()
      }
    })
  }
  pause = () => {
    this.isConnected().then((isConnected) => {
      if (isConnected) {
        GoogleCast.pause()
      }
    })
  }

  /**
   * Send media cast to Google Cast
   * @param {function} cb
   * Cb is needed to be able to call something after the cast has started
   * For example, Google Cast doesn't support playback speed yet,
   * So to handle that we need to set speed to 1 after casting
   */
  castMedia = (media, cb = () => {}, launchExpandedControls = false) => {
    this.setState({ media })
    this.isConnected().then((isConnected) => {
      if (isConnected) {
        GoogleCast.castMedia(media)
        cb()
        if (launchExpandedControls) {
          GoogleCast.launchExpandedControls()
        }
      }
    })
  }

  /**
   *
   * @param {number} playPosition Current time (position) of audio file in seconds
   */
  seek = (playPosition: number) => {
    this.isConnected().then((isConnected) => {
      if (isConnected) {
        GoogleCast.seek(playPosition)
      }
    })
  }

  stop = () => {
    this.isConnected().then((isConnected) => {
      if (isConnected) {
        GoogleCast.pause()
        GoogleCast.seek(0)
      }
    })
  }

  endSession = (stopCasting = true) => {
    this.isConnected().then((isConnected) => {
      if (isConnected) {
        GoogleCast.endSession(stopCasting)
      }
    })
  }

  getCastInstance = () => {
    return {
      castState: this.state.castState,
      castEventName: this.state.eventName,
      castEventData: this.state.eventData,
      playCast: this.play,
      pauseCast: this.pause,
      sendMediaCast: this.castMedia,
      seekCast: this.seek,
      stopCast: this.stop,
      updateCastProgress: this.updateCastProgress,
      endSessionCast: this.endSession,
      registerListeners: this.registerListeners,
    }
  }
}

export const GoogleCastControl = new _GoogleCastControl()
