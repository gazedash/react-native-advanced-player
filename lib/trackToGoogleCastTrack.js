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

// Google Cast Media structure
// https://github.com/react-native-google-cast/react-native-google-cast#usage
type Media = {
  mediaUrl: string,
  imageUrl?: string,
  title?: string,
  subtitle?: string,
  studio?: string,
  streamDuration?: string,
  contentType?: string, // default 'video/mp4', pass 'audio/...' to show audio player
  playPosition?: string,
}

export function trackToGoogleCastTrack(track: Track): Media {
  const media = {
    mediaUrl: track.url,
    imageUrl: track.artwork,
    title: track.title,
    subtitle: track.description,
    studio: track.studio,
    streamDuration: track.duration,
    contentType: track.contentType,
    playPosition: track.position,
    ...track,
  }
  return media
}
