import * as Discord from "discord.js";
import { SobaBot } from "..";
import * as API from "../api";
import { ConfigCommand } from "../types/configCommand";
import { SobaConfig } from "../types/sobaConfig";
import { getChannel } from "../utils/getChannel";
import { sendTempMessage } from "../utils/sendTempMessage";

const parseConfig = (content: string, config: SobaConfig): ConfigCommand => {
  content = content.replace(`${config.prefix}config `, "");
  const res = content.match(/^(set|list)(\s\w+)*(\s.{1,3})*$/);

  if (!res) return { command: undefined, key: undefined, value: undefined };

  const resA = res[0].split(" ");
  return { command: resA[0], key: resA[1], value: resA[2] };
};

export const handleConfig = async (
  sobaBot: SobaBot,
  config: SobaConfig,
  msg: Discord.Message
) => {
  const command = parseConfig(msg.content, config);

  console.log(command.key, command.value);

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

  if (command.command == "set" && command.key && command.value) {
    let set = false;
    if (command.key == "prefix") {
      config["prefix"] = command.value;
      set = true;
    } else if (command.key == "feedback_channel_name") {
      config["feedback_channel_name"] = command.value;
      set = true;
    } else {
      await sendTempMessage(
        msg.channel as Discord.TextChannel,
        `Invalid configuration key!`
      );
    }
    if (set) {
      await API.updateConfig(sobaBot, config);
      await sendTempMessage(
        msg.channel as Discord.TextChannel,
        `${command.key} set to ${command.value}`
      );
    }
  }

  if (command.command == "list") {
    const configKeys = [];
    configKeys.push(`prefix: ${config.prefix}`);
    configKeys.push(`feedback_channel_name: ${config.feedback_channel_name}`);

    await sendTempMessage(
      msg.channel as Discord.TextChannel,
      `\`\`\`
Current Configuration:

${configKeys.join("\n")}\`\`\``,
      15000
    );
  }
};
