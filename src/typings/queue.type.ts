export interface SongData {
  name: string
  url: string
  duration: number
  userRequestName: string
  imageUrl: string
  source: 'youtube' | 'spotify'
}

export interface CurrentSongData extends SongData {
  elapsedTime: number
}
