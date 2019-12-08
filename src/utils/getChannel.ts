import * as Discord from "discord.js";

// gets a channel by name
export const getChannel = (
  guild: Discord.Guild,
  channelName: string
): Discord.TextChannel => {
  const channel = guild.channels.find(
    channel => channel.name == channelName
  ) as Discord.TextChannel;
  return channel;
};
