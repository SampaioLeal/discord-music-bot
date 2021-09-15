import { Message } from 'discord.js';

export function getCommand(message: Message, prefix: string) {
  return message.content.split(' ')[0].replace(prefix, '');
}
