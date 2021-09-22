import AbstractCommand from '@app/services/commands/abstract-command.strategy'
import { Message } from 'discord.js'
import { Logger } from '@logger'
import ytdl from 'ytdl-core'
import ytsr from 'ytsr'
import { makeCardMusic } from '@app/utils/card-messages.util'
import ChannelService from '@app/services/channel.service'

class PlayStrategy extends AbstractCommand {
  private logger = new Logger(PlayStrategy.name)
  private channelService = new ChannelService()

  async processMessage(message: Message) {
    this.channelService.setQueue(this.getQueue())
    this.channelService.joinChannel(message)
    const result = await this.getYoutubeUrl(message.content)

    if (!result) {
      message.channel.send('`Não foi possivel encontrar referencias`')
      return
    }

    const { url, search } = result
    message.channel.send(`:musical_note: Pesquisando :mag_right: \`${search}\``)

    const logMessage = await this.playMusic(search, url, message.author)
    message.channel.send(logMessage)
  }

  async playMusic(
    search: string,
    url: string,
    author: Message['author']
  ): Promise<Parameters<Message['channel']['send']>['0']> {
    const videoInfo = (await ytdl.getBasicInfo(url)).videoDetails
    const videoTitle = videoInfo.title
    const videoChannel = videoInfo.author.name
    const videoLengthSeconds = parseInt(videoInfo.lengthSeconds)
    const totalMusicTime = this.getTotalMusicTime()

    const logMessage = makeCardMusic({
      title: videoTitle,
      musicUrl: url,
      positionInQueue: this.getQueue().getListSong().length + 1,
      timeUntilPlaying: totalMusicTime,
      songDuration: videoLengthSeconds,
      youtubeChannelName: videoChannel,
      imageUrl: videoInfo.thumbnails[0].url,
      authorIconUrl: author.avatarURL({ size: 32 })
    })

    this.getQueue().addSong({
      url: url,
      name: videoInfo.title,
      duration: videoLengthSeconds,
      userRequestName: author.username,
      imageUrl: videoInfo.thumbnails[0].url,
      source: 'youtube'
    })
    this.getQueue().play()

    return {
      embeds: [logMessage]
    }
  }

  private getTotalMusicTime() {
    const queue = this.getQueue()
    const listSong = [...queue.getListSong()]
    const timeOfFirstMusic = queue.getCurrentSong()
    listSong.shift()
    return (
      listSong.reduce((sum, data) => sum + data.duration, 0) +
      timeOfFirstMusic.duration -
      timeOfFirstMusic.elapsedTime
    )
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

export default PlayStrategy
