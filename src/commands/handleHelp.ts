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
    description: "",
    color: 0x36b47c,
    footer: {
      text: "Powered by soba.io"
    },
    fields: [
      {
        name: `${config.prefix}feedback {message}`,
        value: "Creates new feedback"
      },
      {
        name: `${config.prefix}respond {message}`,
        value: "[ADMIN] Responds to feedback"
      },
      {
        name: `${config.prefix}blacklist (add|remove|list) {username#1234}`,
        value: "[ADMIN] Manage user blacklist"
      },
      {
        name: `${config.prefix}delete {issueId}`,
        value: "[ADMIN] Deletes a feedback issue"
      },
      {
        name: `${config.prefix}config (set|list) {value}`,
        value: "[ADMIN] Configuration settings"
      },
      {
        name: `${config.prefix}help`,
        value: "Shows this message"
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
  setTimeout(() => {
    if (message as Discord.Message) {
      (message as Discord.Message).delete();
    }
  }, 30000);
};
