import * as Discord from "discord.js";
import { SobaBot } from "..";
import { sendTempMessage } from "./sendTempMessage";
import { SobaConfig } from "../types/sobaConfig";

// checks to see if the feedback channel exists
// if not, it attempts to create it and writes welcome text
export const ensureFeedbackChannel = async (
  sobaBot: SobaBot,
  config: SobaConfig,
  guild: Discord.Guild
) => {
  const channel = guild.channels.find(
    channel => channel.name == config.feedback_channel_name
  ) as Discord.TextChannel;

  if (channel) {
    const can_manage_messages = channel
      .permissionsFor(sobaBot.discordClient.user)
      ?.has("MANAGE_MESSAGES", false);

    const can_send_messages = channel
      .permissionsFor(sobaBot.discordClient.user)
      ?.has("SEND_MESSAGES", false);

    const can_add_reactions = channel
      .permissionsFor(sobaBot.discordClient.user)
      ?.has("ADD_REACTIONS", false);

    const can_embed_links = channel
      .permissionsFor(sobaBot.discordClient.user)
      ?.has("EMBED_LINKS", false);

    const can_read_message_history = channel
      .permissionsFor(sobaBot.discordClient.user)
      ?.has("READ_MESSAGE_HISTORY", false);

    if (
      can_manage_messages &&
      can_send_messages &&
      can_add_reactions &&
      can_embed_links &&
      can_read_message_history
    )
      return true;

    return false;
  } else {
    try {
      const newChannel = (await guild.createChannel(
        config.feedback_channel_name,
        {
          type: "text",
          permissionOverwrites: [
            {
              id: guild.id,
              deny: ["SEND_MESSAGES"],
              allow: ["ADD_REACTIONS"]
            },
            {
              id: sobaBot.discordClient.user.id,
              allow: [
                "SEND_MESSAGES",
                "MANAGE_MESSAGES",
                "ADD_REACTIONS",
                "EMBED_LINKS",
                "READ_MESSAGE_HISTORY"
              ]
            }
          ]
        }
      )) as Discord.TextChannel;

      if (newChannel) {
        await newChannel.send(`
To submit a suggestion or feedback, write a SINGLE message that begins with \`${config.prefix}feedback\`. For example
\`\`\` 
${config.prefix}feedback This is my suggestion here. Thanks!
\`\`\`
(it does not need to be in a code block)

The message will be embedded here for others to see and vote on. If you'd like to discuss these suggestions, a link has been provided.

Format your suggestion if you'd like! If you want your question to look extra neat, [hyper linking](https://www.hyperlinkedwebsite.com/) along with traditional Discord markdown (**bold**, *italics*, etc) are fully supported.
        `);

        return true;
      }
    } catch (e) {
      return false;
    }

    return false;
  }
};
