import { MessageEmbedOptions } from 'discord.js'
import { CardMusic } from '@typings/cardMessageTypes'
import { CurrentSongData } from '@typings/queue'
import { secondsToDisplayTime } from '@utils/converts'

const makeCardMusic = (data: CardMusic) => {
  const logMessage: MessageEmbedOptions = {
    title: data.title,
    color: data.color ?? '#0088ff',
    author: {
      name: 'Adicionou na fila',
      iconURL: data.authorIconUrl ?? undefined,
      proxyIconURL: data.imageUrl
    },
    url: data.musicUrl,
    thumbnail: {
      url: data.imageUrl
    },
    fields: [
      {
        name: 'Canal Youtube',
        value: data.youtubeChannelName,
        inline: true
      },
      {
        name: 'Tempo de música',
        value: secondsToDisplayTime(data.songDuration),
        inline: true
      },
      {
        name: 'Estimado tocar em',
        value: data.timeUntilPlaying.toString(),
        inline: true
      },
      {
        name: 'Posição na fila',
        value: data.positionInQueue.toString(),
        inline: true
      }
    ]
  }

  return logMessage
}

const makeCardNowPlaying = (data: CurrentSongData) => {
  const description = [
    `\`${buildProgressBar(data.elapsedTime, data.duration)}\``,
    `\`${secondsToDisplayTime(data.elapsedTime)} / ${secondsToDisplayTime(
      data.duration
    )}\``,
    `\`Música adicionada por: ${data.userRequestName}\``
  ]

  const logMessage: MessageEmbedOptions = {
    title: data.name,
    color: '#26ff00',
    author: {
      name: 'Tocando agora'
    },
    url: data.url,
    thumbnail: {
      url: data.imageUrl
    },
    description: buildDescription(description)
  }

  return logMessage
}

const buildDescription = (descriptions: string[], breakCount = 2) => {
  const breaker = new Array(breakCount).fill('\n').join('')
  return descriptions.join(breaker)
}

const buildProgressBar = (currentTime: number, endTime: number) => {
  const barChar = '▬'
  const circleChar = '🔘'

  const barSize = 30
  const percent = Math.floor((currentTime * 100) / endTime)
  const circlePosition = Math.floor((percent * barSize) / 100)

  const progressBar = new Array(barSize).fill(barChar)
  progressBar[circlePosition] = circleChar

  return progressBar.join('')
}

export { makeCardMusic, makeCardNowPlaying }
