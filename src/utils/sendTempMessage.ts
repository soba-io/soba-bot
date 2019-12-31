import * as Discord from "discord.js";

export const sendTempMessage = async (
  channel: Discord.TextChannel,
  message: string,
  deleteIn: number = 5000,
  embed = {}
) => {
  console.warn(embed);

  const msg = await channel.send(message, embed);
  setTimeout(() => {
    if (msg as Discord.Message) {
      (msg as Discord.Message).delete();
    }
  }, deleteIn);
};
