const { Client } = require("discord.js-selfbot-v13");
require("dotenv/config");
const client = new Client();
const { playMedia } = require("./fun");

client.on("ready", () => console.log("ready", client.user.username));

client.on("messageCreate", async (message) => {
  if (!message.content.startsWith("!play")) return;
  const args = message.content.split(" ");
  let url;
  try {
    if (message.attachments.size > 0) {
      url = message.attachments.first().url;
      const channel = message.author.voice.channel;
      if (!channel) return;
      const connection = await client.voice.joinChannel(channel, { selfMute: true, selfDeaf: true, selfVideo: false, videoCodec: "H264" });
      const stream = await connection.createStreamConnection();
      await playMedia("URL", url, url, stream);
    } else if (args[1]?.startsWith("https://www.youtube.com") || args[1]?.startsWith("https://youtu.be")) {
      const channel = message.author.voice.channel;
      if (!channel) return;
      const connection = await client.voice.joinChannel(channel, { selfMute: true, selfDeaf: true, selfVideo: false, videoCodec: "H264" });
      const stream = await connection.createStreamConnection();
      message.reply("video started!");
      await playMedia("YOUTUBE", args[1], args[1], stream);
    } else if (
      args[1]?.startsWith("https://cdn.discordapp.com") ||
      args[1]?.endsWith(".mp4") ||
      args[1]?.endsWith(".mkv") ||
      args[1]?.endsWith(".webm") ||
      args[1]?.startsWith("https://")
    ) {
      url = args[1];
      const channel = message.author.voice.channel;
      if (!channel) return;
      const connection = await client.voice.joinChannel(channel, { selfMute: true, selfDeaf: true, selfVideo: false, videoCodec: "H264" });
      const stream = await connection.createStreamConnection();
      await playMedia("URL", url, url, stream);
    }
  } catch (e) {
    console.log(e);
  }
});

client.login(process.env.TOKEN);
