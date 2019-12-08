import { SobaBot } from "..";
import * as Discord from "discord.js";
import { SobaConfig } from "../types/sobaConfig";
import { getChannel } from "../utils/getChannel";

import { sendTempMessage } from "../utils/sendTempMessage";
import { getDiscordMessage } from "../utils/getDiscordMessage";

import * as API from "../api";

const addResponse = async (msg: Discord.Message, content: string) => {
  const receivedEmbed = msg.embeds[0];
  const exampleEmbed = new Discord.RichEmbed(receivedEmbed).addField(
    "Response",
    content
  );
  await msg.edit(exampleEmbed);
};

const parseResponse = (content: string, config: SobaConfig) => {
  content = content.trim().replace(`${config.prefix}respond`, "");
  let issueId = content.trim().split(" ")[0];
  content = content.replace(issueId + " ", "");

  return { content, issueId };
};

export const handleResponse = async (
  sobaBot: SobaBot,
  config: SobaConfig,
  msg: Discord.Message
) => {
  const { content, issueId } = parseResponse(msg.content, config);

  if (!issueId) {
    await sendTempMessage(
      msg.channel as Discord.TextChannel,
      "Did not pass in a valid Issue ID!"
    );
    return;
  }

  if (
    !getChannel(msg.guild, config.feedback_channel_name)
      .permissionsFor(msg.member)!
      .has("MANAGE_MESSAGES", true)
  ) {
    await sendTempMessage(
      msg.channel as Discord.TextChannel,
      `Sorry, you do not have access to the \`MANAGE_MESSAGES\` permission of the \`#${config.feedback_channel_name}\` channel`
    );
    return;
  }

  try {
    const issue = await API.getIssue(sobaBot, issueId);
    const discordMessage = await getDiscordMessage(
      msg.guild,
      issue.feedback_message_id,
      config
    );
    await addResponse(discordMessage, content);
    await sendTempMessage(
      msg.channel as Discord.TextChannel,
      "Issue response added!"
    );
  } catch (e) {
    await sendTempMessage(
      msg.channel as Discord.TextChannel,
      `Issue not found!`
    );
  }
};
