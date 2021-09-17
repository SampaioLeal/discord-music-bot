import 'dotenv/config'
import './utils/module-alias'
import Client from '@app/client'
import Commands from '@app/commands'

const client = new Client()
const commands = new Commands()

process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error)
})

client.login(() => {
  client.addEventOn('messageCreate', async (message) => {
    commands.processMessage(message)
  })
})
