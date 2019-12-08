import { SobaBot } from "../..";
import * as Discord from "discord.js";

export const getConfig = async (sobaBot: SobaBot, message: Discord.Message) => {
  try {
    const res = await sobaBot.axios.get("/discord_configs/get", {
      params: {
        guild_id: message.guild.id
      }
    });

    return res.data;
  } catch (e) {
    console.warn(e);
  }
};
