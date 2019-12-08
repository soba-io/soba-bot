import * as Discord from "discord.js";
import { SobaConfig } from "../types/sobaConfig";
import { getChannel } from "./getChannel";

export const getDiscordMessage = async (
  guild: Discord.Guild,
  messageId: string,
  config: SobaConfig
) => {
  const msg = await getChannel(
    guild,
    config.feedback_channel_name
  ).fetchMessage(messageId);
  return msg;
};
