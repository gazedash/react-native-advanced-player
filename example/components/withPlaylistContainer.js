import { compose, withStateHandlers, withProps } from 'recompose'
import playlistJSON from '../playlist.json'
import events from '../events.json'

// Handles playlist, onNext, onPrev and track props
export const withPlaylistContainer = compose(
  withStateHandlers(
    {
      index: 0,
      playlist: playlistJSON,
    },
    {
      onMount: () => () => { return {} },
      onPrevious: ({ index }) => () => {
        if (index - 1 >= 0) {
          return { index: index - 1 }
        }
        return { index: 0 }
      },
      onNext: ({ index, playlist }) => () => {
        if (index + 1 < playlist.length) {
          return { index: index + 1 }
        }
        return { index: 0 }
      },
    }
  ),
  withProps(({ index, playlist }) => ({
    track: playlist[index],
    playerComponentProps: {
      bufferConfig: {
        minBufferMs: 1,
        maxBufferMs: 1,
        bufferForPlaybackMs: 1,
        bufferForPlaybackAfterRebufferMs: 1,
      },
    },
    events,
  }))
)
