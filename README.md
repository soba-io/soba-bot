![npm](https://img.shields.io/npm/v/soba-bot)

## Getting Started (Integration)

1. `npm install --save soba-bot`
2. Set envionment variable: `SOBA_API_KEY` (get at discord.soba.io)

```javascript
const Discord = require("discord.js");
const { SobaBot } = require("soba-bot");

const client = new Discord.Client();
const sobaBot = new SobaBot(process.env.SOBA_API_TOKEN, client);

client.on("ready", () => {
  console.log("Online");
});

client.on("message", message => {
  sobaBot.handleMessage(message);
});

client.login(process.env.DISCORD_TOKEN);
```

## Getting Started (Development)

1. Set envionment variable: `SOBA_API_KEY` (get at discord.soba.io)

2. `npm install`
3. `npm run watch`

## Directory Structure

```
src
└───index.ts  # discord bot client logic
└───api       # soba.io api functions
└───commands  # individual command logic
└───types     # type information
└───utils     # misc. helper functions
```
