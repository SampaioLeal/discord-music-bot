import { ColorResolvable } from 'discord.js'
import { Null } from '@typings/genericTypes'

export interface CardMusic {
  title: string
  musicUrl: string
  youtubeChannelName: string
  songDuration: number
  timeUntilPlaying: number
  positionInQueue: number
  color?: ColorResolvable
  authorIconUrl: Null<string>
  imageUrl: string
}
