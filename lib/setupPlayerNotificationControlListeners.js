import MusicControl from 'react-native-music-control'

type Methods = {
  onPlay: () => {},
  onPause: () => {},
  onRewind: (seconds: number) => {},
  onSeek: (seconds: number) => {},
}

export const setupPlayerNotificationControlListeners = (methods: Methods) => {
  const { onPlay, onPause, onRewind, onSeek, onPrevious, onNext } = methods
  MusicControl.on('play', () => {
    onPlay()
  })

  MusicControl.on('pause', () => {
    onPause()
  })

  MusicControl.on('previousTrack', () => {
    onPrevious()
  })
  MusicControl.on('nextTrack', () => {
    onNext()
  })

  MusicControl.on('skipForward', () => {
    onRewind(15)
  })

  MusicControl.on('skipBackward', () => {
    onRewind(-15)
  })

  MusicControl.on('seek', (pos) => {
    onSeek(pos)
  })

  MusicControl.on('changePlaybackPosition', (pos) => {
    onSeek(pos)
  })
}
