import MusicControl from 'react-native-music-control'

export const setupPlayerNotificationControls = () => {
  MusicControl.enableBackgroundMode(true);
  MusicControl.handleAudioInterruptions(true);

  MusicControl.enableControl("play", true);
  MusicControl.enableControl("pause", true);
  // MusicControl.enableControl("stop", true);
  MusicControl.enableControl("nextTrack", true);
  MusicControl.enableControl("previousTrack", true);

  // Changing track position on lockscreen
  MusicControl.enableControl("changePlaybackPosition", true);

  // Seeking
  // MusicControl.enableControl("seekForward", true); // iOS only
  // MusicControl.enableControl("seekBackward", true); // iOS only
  MusicControl.enableControl('togglePlayPause', true) // iOS only
  MusicControl.enableControl("seek", true); // Android only
  MusicControl.enableControl("skipForward", true);
  MusicControl.enableControl("skipBackward", true);

  // Android Specific Options
  // MusicControl.enableControl("setRating", false);
  MusicControl.enableControl("volume", true); // Only affected when remoteVolume is enabled
  MusicControl.enableControl("remoteVolume", true);

  // Default - Allow user to close notification on swipe when audio is paused
  MusicControl.enableControl("closeNotification", true, { when: "paused" });
  MusicControl.enableControl("seek", true);
};
