import { SobaBot } from "..";
import * as API from "../api";

import * as Discord from "discord.js";
import { SobaConfig } from "../types/sobaConfig";
import { getChannel } from "../utils/getChannel";
import { sendTempMessage } from "../utils/sendTempMessage";

export const handleFeedback = async (
  sobaBot: SobaBot,
  config: SobaConfig,
  msg: Discord.Message
) => {
  try {
    const issue = await API.createIssue(sobaBot, msg);
    const feedbackContent = msg.content.replace(
      `${config.prefix}feedback `,
      ""
    );

    const embed = new Discord.RichEmbed({
      title: "",
      description: "",
      color: 0x36b47c,
      timestamp: new Date(msg.createdTimestamp),
      footer: {
        text: "Powered by soba.io"
      },
      author: {
        name: msg.author.username,
        icon_url: msg.author.avatarURL
      },
      fields: [
        {
          name: "Issue ID",
          value: issue.short_url
        },
        {
          name: "Issue Title",
          value: feedbackContent
        },
        {
          name: "Discussion URL",
          value: `https://discord.soba.io/issues/${issue.short_url}`
        }
      ]
    });

    const discordMessage = (await getChannel(
      msg.guild,
      config.feedback_channel_name
    ).send("", embed)) as Discord.Message;
    await discordMessage.react("👍");
    await discordMessage.react("👎");

    await API.updateIssue(sobaBot, issue, discordMessage);
  } catch (e) {
    if (e instanceof Discord.DiscordAPIError) {
      const errorMsg = `Hi, Soba Bot does not have permissions to post to the \`#${config.feedback_channel_name}\` channel.

Please make sure:
1) The channel exists
2) Soba Bot's has permissions to post in the channel

Note: Admins can change the permission channel with \`!config channel {channelName}\``;

      sendTempMessage(msg.channel as Discord.TextChannel, errorMsg, 10000);
    }
    console.log("Cannot post to channel!!!", e);
  }
};
