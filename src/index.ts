import axios, { AxiosInstance } from "axios";
import * as Discord from "discord.js";
import dotenv from "dotenv";
import * as API from "./api";
import * as Commands from "./commands";
import { parseCommand } from "./utils/parseCommand";

export class SobaBot {
  apiToken: string;
  discordClient: Discord.Client;
  axios: AxiosInstance;

  constructor(apiToken: string, discordClient: Discord.Client) {
    this.apiToken = apiToken;
    this.discordClient = discordClient;
    this.axios = axios.create({
      baseURL: process.env.production
        ? "https://discord.soba.io/api/v1"
        : "http://localhost:3000/api/v1",
      timeout: 30000,
      headers: { Authorization: apiToken }
    });
  }

  handleMessage = async (msg: Discord.Message) => {
    const config = await API.getConfig(this, msg);
    const command = parseCommand(msg.content, config);

    if (msg.author.bot) return;
    if (msg.content.indexOf(config.prefix) !== 0) return;

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
