import { SobaBot } from "../..";
import * as Discord from "discord.js";

export const getIssue = async (sobaBot: SobaBot, issueId: string) => {
  try {
    const res = await sobaBot.axios.get(`/issues`, {
      params: {
        short_url: issueId
      }
    });
    return res.data;
  } catch (e) {
    console.warn(e);
  }
};
