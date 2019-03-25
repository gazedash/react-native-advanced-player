import * as React from 'react'
import { StyleSheet, ScrollView, View } from 'react-native'
import { CastButton } from 'react-native-google-cast'
import { AirPlayButton } from 'react-native-airplay-ios'
import { ProgressSlider, PlayerControl } from 'react-native-advanced-player'

import { Volume } from './Volume'
import { Speed } from './Speed'
import { Event } from './Event'
import { Controls } from './Controls'
import { TrackInfo } from './TrackInfo'
import { AirPlayDevice } from './AirPlayDevice'

const styles = StyleSheet.create({
  castButton: {
    margin: 20,
    width: 24,
    height: 24,
  },
})

export const PlayerView = (props) => (
  <PlayerControl.Consumer>
    {(playerProps) => (
      <ScrollView>
        <TrackInfo
          track={playerProps.track || {}}
          duration={playerProps.duration || 0}
          currentTime={playerProps.currentTime}
          completedPercentage={playerProps.completedPercentage}
        />

        <ProgressSlider
          value={playerProps.completedPercentage}
          maximumValue={playerProps.maxSeekValue}
          onSlidingComplete={playerProps.onSeek}
        />

        <Controls
          paused={playerProps.paused}
          onPrevious={playerProps.onPrevious}
          onRewind={playerProps.onRewind}
          onTogglePlayback={playerProps.onTogglePlayback}
          onStop={playerProps.onStop}
          onNext={playerProps.onNext}
        />

        <Speed
          speed={playerProps.speed}
          onSpeedChange={playerProps.onSpeedChange}
        />

        <Event currentTime={playerProps.currentTime} events={props.events} />

        <CastButton style={styles.castButton} />

        <AirPlayDevice />

        <View
          style={{
            margin: 50,
          }}
        >
          {playerProps.currentTime === 0 ? null : (
            <AirPlayButton
              source={{
                disabled:
                  'iVBORw0KGgoAAAANSUhEUgAAAB0AAAAdCAYAAABWk2cPAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGmSURBVHgB7ZQ7isJQGIVPBrGw0Eqw0M7ODegOxNrHAsQFuAAbex/gDiysLCzFWrRVwUrQQoS0SZUicCcnMBInMeQmGhmYD0Ie9785yfkfSjabFYZhIC6SySQU6ywQM1/4AIlKpYLRaIS4aLfbSPCiUCggLtLp9Gfs/Rd9KwmZ4MFgcL9m8bHywxSh1J8Oh0NkMhlbaLPZoNFo4Hq9QhZpe6vVKprNJsbjsS3a7XYhS6ScdjodbLdb6LoutS+SKBudxCoalkiix+PRLqp8Pi+1L7QoBTm8WUyySPUpqdfr0DTNbh2KspjeKnq73fAK/k4hMZ/lchnn8xlhUKzciFqt5lpgznq9nqcg88reTKVSWCwWKJVKrrh+v+/Zv+v12j4Lr8NqBWHl8OFYrVbCGggPcbzn89+x3P/s3YHtdf6hE97z+W63C/oqKJPJRJim6VrgiONwJ5fLBUyB37jL5XKYTqd3q5fL5dN4hVbAh8PhgFarFWi+8kPn87lnjp342ktLgwqSH6u5L5Tofr/3zOErhD3tPZ1O9nhTVRVhodWz2QzFYtG19g0/ZtlUOPEw1gAAAABJRU5ErkJggg==',
                normal:
                  'iVBORw0KGgoAAAANSUhEUgAAAB0AAAAdCAYAAABWk2cPAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGmSURBVHgB7ZQ7isJQGIVPBrGw0Eqw0M7ODegOxNrHAsQFuAAbex/gDiysLCzFWrRVwUrQQoS0SZUicCcnMBInMeQmGhmYD0Ie9785yfkfSjabFYZhIC6SySQU6ywQM1/4AIlKpYLRaIS4aLfbSPCiUCggLtLp9Gfs/Rd9KwmZ4MFgcL9m8bHywxSh1J8Oh0NkMhlbaLPZoNFo4Hq9QhZpe6vVKprNJsbjsS3a7XYhS6ScdjodbLdb6LoutS+SKBudxCoalkiix+PRLqp8Pi+1L7QoBTm8WUyySPUpqdfr0DTNbh2KspjeKnq73fAK/k4hMZ/lchnn8xlhUKzciFqt5lpgznq9nqcg88reTKVSWCwWKJVKrrh+v+/Zv+v12j4Lr8NqBWHl8OFYrVbCGggPcbzn89+x3P/s3YHtdf6hE97z+W63C/oqKJPJRJim6VrgiONwJ5fLBUyB37jL5XKYTqd3q5fL5dN4hVbAh8PhgFarFWi+8kPn87lnjp342ktLgwqSH6u5L5Tofr/3zOErhD3tPZ1O9nhTVRVhodWz2QzFYtG19g0/ZtlUOPEw1gAAAABJRU5ErkJggg==',
                focused:
                  'iVBORw0KGgoAAAANSUhEUgAAAB0AAAAdCAYAAABWk2cPAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGmSURBVHgB7ZQ7isJQGIVPBrGw0Eqw0M7ODegOxNrHAsQFuAAbex/gDiysLCzFWrRVwUrQQoS0SZUicCcnMBInMeQmGhmYD0Ie9785yfkfSjabFYZhIC6SySQU6ywQM1/4AIlKpYLRaIS4aLfbSPCiUCggLtLp9Gfs/Rd9KwmZ4MFgcL9m8bHywxSh1J8Oh0NkMhlbaLPZoNFo4Hq9QhZpe6vVKprNJsbjsS3a7XYhS6ScdjodbLdb6LoutS+SKBudxCoalkiix+PRLqp8Pi+1L7QoBTm8WUyySPUpqdfr0DTNbh2KspjeKnq73fAK/k4hMZ/lchnn8xlhUKzciFqt5lpgznq9nqcg88reTKVSWCwWKJVKrrh+v+/Zv+v12j4Lr8NqBWHl8OFYrVbCGggPcbzn89+x3P/s3YHtdf6hE97z+W63C/oqKJPJRJim6VrgiONwJ5fLBUyB37jL5XKYTqd3q5fL5dN4hVbAh8PhgFarFWi+8kPn87lnjp342ktLgwqSH6u5L5Tofr/3zOErhD3tPZ1O9nhTVRVhodWz2QzFYtG19g0/ZtlUOPEw1gAAAABJRU5ErkJggg==',
                highlighted:
                  'iVBORw0KGgoAAAANSUhEUgAAAB0AAAAdCAYAAABWk2cPAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGmSURBVHgB7ZQ7isJQGIVPBrGw0Eqw0M7ODegOxNrHAsQFuAAbex/gDiysLCzFWrRVwUrQQoS0SZUicCcnMBInMeQmGhmYD0Ie9785yfkfSjabFYZhIC6SySQU6ywQM1/4AIlKpYLRaIS4aLfbSPCiUCggLtLp9Gfs/Rd9KwmZ4MFgcL9m8bHywxSh1J8Oh0NkMhlbaLPZoNFo4Hq9QhZpe6vVKprNJsbjsS3a7XYhS6ScdjodbLdb6LoutS+SKBudxCoalkiix+PRLqp8Pi+1L7QoBTm8WUyySPUpqdfr0DTNbh2KspjeKnq73fAK/k4hMZ/lchnn8xlhUKzciFqt5lpgznq9nqcg88reTKVSWCwWKJVKrrh+v+/Zv+v12j4Lr8NqBWHl8OFYrVbCGggPcbzn89+x3P/s3YHtdf6hE97z+W63C/oqKJPJRJim6VrgiONwJ5fLBUyB37jL5XKYTqd3q5fL5dN4hVbAh8PhgFarFWi+8kPn87lnjp342ktLgwqSH6u5L5Tofr/3zOErhD3tPZ1O9nhTVRVhodWz2QzFYtG19g0/ZtlUOPEw1gAAAABJRU5ErkJggg==',
                selected:
                  'iVBORw0KGgoAAAANSUhEUgAAAB0AAAAdCAYAAABWk2cPAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGmSURBVHgB7ZQ7isJQGIVPBrGw0Eqw0M7ODegOxNrHAsQFuAAbex/gDiysLCzFWrRVwUrQQoS0SZUicCcnMBInMeQmGhmYD0Ie9785yfkfSjabFYZhIC6SySQU6ywQM1/4AIlKpYLRaIS4aLfbSPCiUCggLtLp9Gfs/Rd9KwmZ4MFgcL9m8bHywxSh1J8Oh0NkMhlbaLPZoNFo4Hq9QhZpe6vVKprNJsbjsS3a7XYhS6ScdjodbLdb6LoutS+SKBudxCoalkiix+PRLqp8Pi+1L7QoBTm8WUyySPUpqdfr0DTNbh2KspjeKnq73fAK/k4hMZ/lchnn8xlhUKzciFqt5lpgznq9nqcg88reTKVSWCwWKJVKrrh+v+/Zv+v12j4Lr8NqBWHl8OFYrVbCGggPcbzn89+x3P/s3YHtdf6hE97z+W63C/oqKJPJRJim6VrgiONwJ5fLBUyB37jL5XKYTqd3q5fL5dN4hVbAh8PhgFarFWi+8kPn87lnjp342ktLgwqSH6u5L5Tofr/3zOErhD3tPZ1O9nhTVRVhodWz2QzFYtG19g0/ZtlUOPEw1gAAAABJRU5ErkJggg==',
              }}
            />
          )}
        </View>

        <Volume />
      </ScrollView>
    )}
  </PlayerControl.Consumer>
)
