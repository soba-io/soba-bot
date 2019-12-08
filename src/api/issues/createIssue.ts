import { SobaBot } from "../..";
import * as Discord from "discord.js";
import { recursiveStrip } from "../../utils/recursiveStrip";

export const createIssue = async (
  sobaBot: SobaBot,
  message: Discord.Message
) => {
  try {
    const res = await sobaBot.axios.post("/issues", {
      message: recursiveStrip(message)
    });

    return res.data;
  } catch (e) {
    console.warn(e);
  }
};
