export interface SongData {
  name: string
  url: string
  duration: number
  userRequestName: string
  imageUrl: string
}

export interface CurrentSongData extends SongData {
  elapsedTime: number
}
