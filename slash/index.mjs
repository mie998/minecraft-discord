import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const appID = process.env.appID;
const guildID = process.env.guildID;
const botToken = process.env.botToken;
const apiEndpoint = `https://discord.com/api/v10/applications/${appID}/guilds/${guildID}/commands`;

const commandData = {
  name: "server",
  description: "command to start/stop minecraft server",
  options: [
    {
      name: "action",
      description: "server action",
      type: 3,
      required: true,
      choices: [
        {
          name: "start",
          value: "start",
        },
        {
          name: "stop",
          value: "stop",
        },
        {
          name: "test",
          value: "test",
        },
      ],
    },
  ],
};

async function main() {
  const response = await fetch(apiEndpoint, {
    method: "post",
    body: JSON.stringify(commandData),
    headers: {
      Authorization: "Bot " + botToken,
      "Content-Type": "application/json",
    },
  });
  const json = await response.json();

  console.log(json);
}

main();
