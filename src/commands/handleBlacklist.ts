import * as Discord from "discord.js";
import { SobaBot } from "..";
import * as API from "../api";
import { BlacklistCommand } from "../types/blacklistCommand";
import { SobaConfig } from "../types/sobaConfig";
import { getChannel } from "../utils/getChannel";
import { sendTempMessage } from "../utils/sendTempMessage";

const parseBlacklist = (
  content: string,
  config: SobaConfig
): BlacklistCommand => {
  content = content.replace(`${config.prefix}blacklist `, "");
  const res = content.match(/^(add|remove|list)(\s\w+)*$/);

  if (!res) return { command: undefined, userId: undefined };

  const resA = res[0].split(" ");
  return { command: resA[0], userId: resA[1] };
};

export const handleBlacklist = async (
  sobaBot: SobaBot,
  config: SobaConfig,
  msg: Discord.Message
) => {
  const command = parseBlacklist(msg.content, config);

  if (!command.command) {
    await sendTempMessage(
      msg.channel as Discord.TextChannel,
      "Invalid command!"
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

  if (command.command == "add" && command.userId) {
    config.blacklist_user_ids.push(command.userId);
    await API.updateConfig(sobaBot, config);
    await sendTempMessage(
      msg.channel as Discord.TextChannel,
      `${command.userId} added to blacklist`
    );
  }

  if (command.command == "remove" && command.userId) {
    const index = config.blacklist_user_ids.indexOf(command.userId);

    if (index > -1) {
      config.blacklist_user_ids.splice(index, 1);
      await API.updateConfig(sobaBot, config);
      await sendTempMessage(
        msg.channel as Discord.TextChannel,
        `${command.userId} removed from blacklist`
      );
    } else {
      await sendTempMessage(
        msg.channel as Discord.TextChannel,
        `${command.userId} not found in blacklist!`
      );
    }
  }

  if (command.command == "list") {
    let userIds = config.blacklist_user_ids.join("\n");
    if (!userIds) {
      userIds = "Blacklist is empty!";
    }

    await sendTempMessage(
      msg.channel as Discord.TextChannel,
      `${userIds}`,
      15000
    );
  }
};
