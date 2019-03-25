# react-native-advanced-player

Player is modular, this allows to compose components as needed.

## Running example app
NOTE: use yarn to install dependencies!
There is a postinstall hook which deletes react-native-advanced-player modules, to be able to update *lib* without the need to reinstall and restart the packager
Postinstall script doesn't work well with npm.

```
cd example
yarn
cd ios
pod install
cd ..
react-native run-ios
// or 
react-native run-android
```

You can also notice that the example app *react-native-advanced-player* dependency version is "..". This is done to be able to require the lib from the repo and not from npm.

Also don't forget to link all react-native dependencies:

`react-native link`

And check these instructions for linking:

* [react-native-video](https://github.com/react-native-community/react-native-video/)
* [react-native-google-cast](https://github.com/react-native-google-cast/react-native-google-cast)
* [react-native-music-control](https://github.com/tanguyantoine/react-native-music-control#readme)

## Main parts of the library:
* withEvent (hoc)
* GoogleCastControl (ES6 class)
* PlayerControl (Provider, Consumer, using Context API)
* AirPlayControl (Provider, Consumer, using Context API)
* VolumeControl (Provider, Consumer, using Context API)

You can use them as needed or compose into a single component.
Example demonstrates wrapping components in hocs as needed.

### PlayerControl
enables control of such things as:

* loading the track
* player speed
* state (playing/paused)
* how much of current track is buffered (loaded), in percent
* what is the current progress in percent
* adds rewind rewind / seek methods
* sends commands to withGoogleCastControl hoc to handle play/pause/seek on Chromecast

It uses react-native-video under the hood.

### GoogleCastControl
Enables control of the Chromecast

* load track to chromecast
* seeking
* play / pause 
* start / stop cast

### VolumeControl

Enables control of the system volume

### withEvent
Returns the event object and isShown property.
It works by finding the appropriate event in the events prop,
by comparing if the currentTime is within bounds of event (*time* and *end* properties)

### AirPlayControl

This component is used to display currently connected devices

## Additional (helper) components
* ProgressSlider

### ProgressSlider

This component is used to enable proper seeking slider behavior, without lags or jumps when user is seeking the track.
It uses react-native-slider library, as it offers useful events
e.g. onSlidingStart, onSlidingComplete.

# Additional (helper) methods
* setupPlayerNotificationControls