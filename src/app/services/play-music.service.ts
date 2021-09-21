import { Message } from 'discord.js'
import ytdl from 'ytdl-core'
import { makeCardMusic } from '@app/utils/card-messages.util'
import ytsr from 'ytsr'
import { Logger } from '@logger'
import QueueService from '@app/services/queue.service'

class PlayMusicService {
  private logger = new Logger(PlayMusicService.name)
  private queue = QueueService.getInstance()

  async playMusic(
    search: string,
    url: string,
    author: Message['author']
  ): Promise<Parameters<Message['channel']['send']>['0']> {
    const videoInfo = (await ytdl.getBasicInfo(url)).videoDetails
    const videoTitle = videoInfo.title
    const videoChannel = videoInfo.author.name
    const videoLengthSeconds = parseInt(videoInfo.lengthSeconds)

    const logMessage = makeCardMusic({
      title: videoTitle,
      musicUrl: url,
      positionInQueue: this.queue.getListSong().length + 1,
      timeUntilPlaying: 0,
      songDuration: videoLengthSeconds,
      youtubeChannelName: videoChannel,
      imageUrl: videoInfo.thumbnails[0].url,
      authorIconUrl: author.avatarURL({ size: 32 })
    })

    this.queue.addSong({
      url: url,
      name: videoInfo.title,
      duration: videoLengthSeconds,
      userRequestName: author.username,
      imageUrl: videoInfo.thumbnails[0].url,
      source: 'youtube'
    })
    this.queue.play()

    return {
      embeds: [logMessage]
    }
  }

  async getYoutubeUrl(text: string) {
    const searchWordOrLink = text.split(/\s(.+)/)[1]
    this.logger.info(`Buscando por ${searchWordOrLink}`)

    if (!searchWordOrLink) {
      this.logger.warn('Não há dados para buscar')
      return null
    }

    if (ytdl.validateURL(searchWordOrLink)) {
      return {
        url: searchWordOrLink,
        search: searchWordOrLink
      }
    }

    return await this.searchUrlYoutubeBySearch(searchWordOrLink)
  }

  private async searchUrlYoutubeBySearch(search: string) {
    this.logger.info(`Buscando link do youtube com base em: ${search}`)
    const filters1 = await ytsr.getFilters(search)
    const filter1 = filters1.get('Type')?.get('Video')?.url
    if (!filter1) {
      return null
    }
    const firstResult = await ytsr(filter1, { limit: 1 })

    const url = (firstResult.items[0] as any).url
    this.logger.info(`Link encontrado: ${url}`)

    return {
      url,
      search
    }
  }
}

export default PlayMusicService
