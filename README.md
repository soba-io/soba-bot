## Getting Started

1. Set envionment variables
2. `npm install`
3. `npm run watch`

## Directory Structure

```
index.js # entrypoint to the app
src
└───index.js  # discord bot client logic


```

```javascript
if (process.env.HEROKU != "true") {
  dotenv.config();
}

const client = new Discord.Client();
const sobaBot = new SobaBot("8e1922030e5074e989b282d23aa6f164", client);

client.on("ready", () => {
  console.log("Online");
});
client.on("message", message => {
  sobaBot.handleMessage(message);
});

client.login(process.env.DISCORD_TOKEN);
```
