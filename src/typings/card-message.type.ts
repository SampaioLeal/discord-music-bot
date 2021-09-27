import { ColorResolvable } from 'discord.js'

export interface CardMusic {
  title: string
  musicUrl: string
  youtubeChannelName: string
  songDuration: number
  timeUntilPlaying: number
  positionInQueue: number
  color?: ColorResolvable
  authorIconUrl: null | string
  imageUrl: string
}
