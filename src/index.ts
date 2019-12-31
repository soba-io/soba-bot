import axios, { AxiosInstance } from "axios";
import * as Discord from "discord.js";
import dotenv from "dotenv";
import * as API from "./api";
import * as Commands from "./commands";
import { parseCommand } from "./utils/parseCommand";
import { ensureFeedbackChannel } from "./utils/ensureFeedbackChannel";
import { SobaConfig } from "./types/sobaConfig";
import { sendTempMessage } from "./utils/sendTempMessage";

export class SobaBot {
  apiToken: string;
  discordClient: Discord.Client;
  axios: AxiosInstance;

  constructor(apiToken: string, discordClient: Discord.Client) {
    this.apiToken = apiToken;
    this.discordClient = discordClient;
    this.axios = axios.create({
      baseURL: process.env.development
        ? "http://localhost:3000/api/v1"
        : "https://discord.soba.io/api/v1",
      timeout: 30000,
      headers: { Authorization: apiToken }
    });
  }

  handleMessage = async (msg: Discord.Message) => {
    const config: SobaConfig = await API.getConfig(this, msg);
    const command = parseCommand(msg.content, config);
    const hasChannel = await ensureFeedbackChannel(this, config, msg.guild);

    if (msg.author.bot) return;
    if (msg.content.indexOf(config.prefix) !== 0) return;
    if (!hasChannel) {
      const errorMsg = `Hi, Soba Bot does not have permissions to post to the \`#${config.feedback_channel_name}\` channel.

Please make sure:
1) The channel exists
2) Soba Bot has the following permissions for the channel: \`SEND_MESSAGES\`, \`MANAGE_MESSAGES\`, \`ADD_REACTIONS\`, \`EMBED_LINKS\`, \`READ_MESSAGE_HISTORY\`
`;

      sendTempMessage(msg.channel as Discord.TextChannel, errorMsg, 10000);

      return;
    }

    console.log("Received Soba Command:", msg.content);

    switch (command) {
      case "feedback":
        Commands.handleFeedback(this, config, msg);
        break;
      case "respond":
        Commands.handleResponse(this, config, msg);
        break;
      case "delete":
        Commands.handleDelete(this, config, msg);
        break;
      case "blacklist":
        Commands.handleBlacklist(this, config, msg);
        break;
      case "config":
        Commands.handleConfig(this, config, msg);
        break;
      case "help":
        Commands.handleHelp(this, config, msg);
        break;
      default:
        break;
    }
  };
}
