import { SobaBot } from "../..";
import * as Discord from "discord.js";
import { recursiveStrip } from "../../utils/recursiveStrip";

export const updateIssue = async (
  sobaBot: SobaBot,
  issue: any,
  message: Discord.Message
) => {
  try {
    const res = await sobaBot.axios.put(`/issues`, {
      issue: {
        short_url: issue.short_url,
        feedback_message_id: message.id
      }
    });

    return res.data;
  } catch (e) {
    console.warn(e);
  }
};
