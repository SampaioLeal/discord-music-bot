import 'dotenv/config'
import * as Discord from 'discord.js'
import { getVoiceConnection, joinVoiceChannel } from '@discordjs/voice'
import { Queue } from './queue'
import { getCommand } from './commands'

const client = new Discord.Client({
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_VOICE_STATES
  ]
})
const prefix = process.env.PREFIX || '!'
const queues: Map<string, Queue> = new Map()

client.once('ready', () => {
  console.log('Ready!')
})

client.once('reconnecting', () => {
  console.log('Reconnecting!')
})

client.once('disconnect', () => {
  console.log('Disconnect!')
})

client.on('messageCreate', async (message) => {
  if (message.author.bot) return
  if (!message.content.startsWith(prefix)) return

  if (message.guild) {
    const command = getCommand(message, prefix)
    // TODO: change to args
    const requestedVideo = message.content.replace(prefix + command, '').trim()
    const userVoiceChannel = message.member?.voice.channel
    let queue = queues.get(message.guild.id)

    if (!userVoiceChannel?.id) {
      message.reply('Você deve estar em um canal de voz!')
      return
    }

    if (!queue) {
      queues.set(
        message.guild.id,
        new Queue({
          guildId: message.guild.id,
          channelId: userVoiceChannel.id
        })
      )
      queue = queues.get(message.guild.id)
    }

    if (queue!.channelId !== userVoiceChannel.id) {
      queue!.channelId = userVoiceChannel.id
    }

    const voiceConnection = getVoiceConnection(message.guild.id)
    if (!voiceConnection) {
      const connection = joinVoiceChannel({
        channelId: userVoiceChannel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator
      })

      connection.subscribe(queue!.player)
    }

    switch (command) {
      case 'play':
        console.log(requestedVideo)
        if (requestedVideo) queue!.push({ name: 'Musica', url: requestedVideo })
        queue!.play()
        break

      case 'pause':
        queue!.pause()
        break

      case 'skip':
        queue!.skip()
        break

      case 'dc':
        queue!.disconnect()
        queues.delete(message.guild.id)
        break
      default:
        break
    }
  }
})

client.login(process.env.TOKEN)
