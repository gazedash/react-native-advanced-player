// Track structure
// https://github.com/react-native-kit/react-native-track-player/wiki/Documentation#track-structure
type Track = {
  url: string, // The remote / local or bundle track url
  artwork?: string, // Artwork image (remote/local/bundle) url
  title: string,
  duration?: string, // Duration in seconds
  id: string,
  artist: string,
  type?: string, // one of hls/dash/smoothstreaming
  userAgent?: string, // The user agent HTTP header
  contentType?: string, // MIME type of the media file
  album?: string,
  description?: string,
  genre?: string,
  date?: string,
  rating?: string,
  studio?: string,
  position?: string, // Track position to start in seconds
}

// react-native-music-control NowPlaying
// https://github.com/react-native-google-cast/react-native-google-cast#usage
type NowPlaying = {
  title: string,
  artist: string,
  album: string,
  duration: string,
  artwork: string,
  date: string,
  rating: string,
  genre: string,
  description: string,
  color: string,
  notificationIcon: string,
}

export const trackToNowPlaying = (track: Track): NowPlaying => {
  return {
    ...track,
    title: track.title,
    artist: track.artist,
    album: track.album,
    duration: track.duration, // Seconds
    artwork: track.imageUrl, // URL or RN's image require()
    date: track.date, // Release Date (RFC 3339) - Android Only
    rating: track.rating, // Android Only (Boolean or Number depending on the type)
    genre: 'Podcast',
    description: '', // Android Only
    // color: , // Notification Color - Android Only
    notificationIcon: '', // Android Only (String), Android Drawable resource name for a custom notification icon
  }
}
