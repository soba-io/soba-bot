import { SobaBot } from "..";
import * as Discord from "discord.js";
import { SobaConfig } from "../types/sobaConfig";

export const handleHelp = async (
  bot: SobaBot,
  config: SobaConfig,
  msg: Discord.Message
) => {
  const embed = {
    title: "Soba Commands",
    description: "This message will self-destruct in 20 seconds",
    color: 0x36b47c,
    footer: {
      text: "Powered by soba.io"
    },
    fields: [
      {
        name: `${config.prefix}feedback {message}`,
        value: "Creates new feedback",
        inline: true
      },
      {
        name: `${config.prefix}respond {message}`,
        value: "[ADMIN] Responds to feedback",
        inline: true
      },
      {
        name: `${config.prefix}blacklist (add|remove|list) {username#1234}`,
        value: "[ADMIN] Manage user blacklist",
        inline: true
      },
      {
        name: `${config.prefix}delete {issueId}`,
        value: "[ADMIN] Deletes a feedback issue",
        inline: true
      },
      {
        name: `${config.prefix}config (set|list) {value}`,
        value: "[ADMIN] Configuration settings",
        inline: true
      },
      {
        name: `${config.prefix}help`,
        value: "Shows this message",
        inline: true
      },
      {
        name: "How to set a user as admin:",
        value:
          "Set `MANAGE_MESSAGES` permission of the Feedback Channel for that user"
      }
    ]
  };
  const message: Discord.Message | Discord.Message[] = await msg.channel.send(
    "",
    {
      embed
    }
  );
};
