import React from 'react'
import { compose } from 'recompose'
import { withPlaylistContainer } from './withPlaylistContainer'
import { GoogleCastControl, PlayerControl } from 'react-native-advanced-player'
import { PlayerView } from './PlayerView'

export const Player = compose(withPlaylistContainer)((props) => (
  <PlayerControl.Provider
    {...props}
    castInstance={GoogleCastControl.getCastInstance}
  >
    <PlayerView events={props.events} />
  </PlayerControl.Provider>
))
