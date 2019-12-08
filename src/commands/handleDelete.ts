import * as Discord from "discord.js";
import { SobaConfig } from "../types/sobaConfig";
import { SobaBot } from "..";

import { getChannel } from "../utils/getChannel";
import { getDiscordMessage } from "../utils/getDiscordMessage";
import { sendTempMessage } from "../utils/sendTempMessage";
import * as API from "../api";

const parseDelete = (content: string, config: SobaConfig) => {
  content = content.trim().replace(`${config.prefix}delete`, "");
  let issueId = content.trim().split(" ")[0];
  content = content.replace(issueId + " ", "");

  return { issueId };
};

export const handleDelete = async (
  sobaBot: SobaBot,
  config: SobaConfig,
  msg: Discord.Message
) => {
  const { issueId } = parseDelete(msg.content, config);

  if (!issueId || issueId == "NaN") {
    await sendTempMessage(
      msg.channel as Discord.TextChannel,
      "Did not pass in a valid Issue ID!"
    );
    return;
  }

  const issue = await API.getIssue(sobaBot, issueId);

  if (
    !getChannel(msg.guild, config.feedback_channel_name)
      .permissionsFor(msg.member)!
      .has("MANAGE_MESSAGES", true) &&
    issue.user.id !== msg.author.id
  ) {
    await sendTempMessage(
      msg.channel as Discord.TextChannel,
      `Sorry, you do not have access to the \`MANAGE_MESSAGES\` permission of the \`#${config.feedback_channel_name}\` channel`
    );
    return;
  }

  const discordMessage = await getDiscordMessage(
    msg.guild,
    issue.feedback_message_id,
    config
  );

  await discordMessage.delete();
  await sendTempMessage(msg.channel as Discord.TextChannel, `Issue deleted!`);
};
