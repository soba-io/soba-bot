import { SobaBot } from "../..";
import * as Discord from "discord.js";

export const messageCount = async (
  sobaBot: SobaBot,
  message: Discord.Message
) => {
  try {
    const res = await sobaBot.axios.get("/discord_messages/count", {
      params: {
        guildId: message.guild.id
      }
    });

    return res.data;
  } catch (e) {
    console.warn(e);
  }
};
