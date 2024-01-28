const { Client } = require("discord.js-selfbot-v13");
const {
  command,
  streamLivestreamVideo,
  MediaUdp,
  setStreamOpts,
  getInputMetadata,
  inputHasAudio,
  Streamer,
} = require("@dank074/discord-video-stream");
const ytstream = require("yt-stream");
require("dotenv/config");
const fs = require("fs");
const streamer = new Streamer(new Client());
const ytdl = require("ytdl-core");
const ffmpeg = require("fluent-ffmpeg");
streamer.client.on("ready", () => {
  console.log("ready");
});
async function playVideo(video, udpConn) {
  let includeAudio = true;

  try {
    const metadata = await getInputMetadata(video);
    includeAudio = inputHasAudio(metadata);
  } catch (e) {
    console.log(e);
    return;
  }

  console.log("Started playing video");

  udpConn.mediaConnection.setSpeaking(true);
  udpConn.mediaConnection.setVideoStatus(true);
  try {
    const res = await streamLivestreamVideo(video, udpConn, includeAudio);
    console.log("Finished playing video " + res);
  } catch (e) {
    console.log(e);
  } finally {
    udpConn.mediaConnection.setSpeaking(false);
    udpConn.mediaConnection.setVideoStatus(false);
  }
  command?.kill("SIGINT");
}

streamer.client.on("messageCreate", async (message) => {
  if (message.content.startsWith("!play")) {
    const args = message.content.split(" ");
    try {
      async function downloadVideo(url, filePath) {
        try {
          const videoInfo = await ytdl.getInfo(url);
          const videoFormat = ytdl.chooseFormat(videoInfo.formats, {
            quality: "highest",
          });
          const audioFormat = ytdl.chooseFormat(videoInfo.formats, {
            quality: "highestaudio",
          });

          const videoReadableStream = ytdl(url, { format: videoFormat });
          const audioReadableStream = ytdl(url, { format: audioFormat });

          const videoWriteableStream = fs.createWriteStream(filePath);
          const audioWriteableStream = fs.createWriteStream("./audio.mp3");

          videoReadableStream.pipe(videoWriteableStream);
          audioReadableStream.pipe(audioWriteableStream);

          videoWriteableStream.on("finish", async () => {
            console.log("Video downloaded successfully!");
            await mergeAudioAndVideo(filePath, "./audio.mp3");
          });

          videoWriteableStream.on("error", (error) => {
            console.error("Error downloading video:", error);
          });

          audioWriteableStream.on("error", (error) => {
            console.error("Error downloading audio:", error);
          });
        } catch (error) {
          console.error("Error retrieving video information:", error);
        }
      }
      function mergeAudioAndVideo(videoPath, audioPath) {
        const mergedPath = "./merged.mp4";
        ffmpeg()
          .input(videoPath)
          .input(audioPath)
          .outputOptions("-c:v copy")
          .outputOptions("-c:a aac")
          .outputOptions("-strict experimental")
          .output(mergedPath)
          .on("end", async () => {
            console.log("Audio and video merged successfully!");
            fs.unlinkSync(videoPath);
            fs.unlinkSync(audioPath);
            const video = "./merged.mp4";
            setStreamOpts({
              width: 1920,
              height: 1080,
              fps: 60,
              bitrateKbps: 4000,
              maxBitrateKbps: 8000,
              hardware_acceleration: false,
              video_codec: "H264",
            });
            const channel = message.author.voice.channel;
            if (!channel) return;
            await streamer.joinVoice(message.guildId, channel.id);
            const udp = await streamer.createStream();
            console.log("Started playing video");
            message.channel.send("Video has started playing!");
            await playVideo(video, udp).then(() => {
              message.channel.send("Video has finished playing!");
              //destroy the stream
              streamer.leaveVoice(message.guildId);
            });
          })
          .on("error", (error) => {
            console.error("Error merging audio and video:", error);
          })
          .run();
      }

      let url;
      if (message.attachments.size > 0) {
        console.log("attachment");
        url = message.attachments.first().url;
        const channel = message.author.voice.channel;
        if (!channel) return;
        await streamer.joinVoice(message.guildId, channel.id);
        const udp = await streamer.createStream();
        console.log("Started playing video");
        message.channel.send("Video has started playing!");

        await playVideo(url, udp).then(() => {
          message.channel.send(
            "Video has finished playing! i will leave the voice channel in 5 seconds"
          );
          //destroy the stream
          setTimeout(() => {
            streamer.leaveVoice(message.guildId);
          }, 5000);
        });
      } else if (args[1].startsWith("https://www.youtube.com")) {
        console.log("url");
        url = args[1];
        await downloadVideo(url, "./video.mp4");
      } else if (
        args[1].startsWith("https://cdn.discordapp.com") ||
        args[1].endsWith(".mp4") ||
        args[1].endsWith(".mkv") ||
        args[1].endsWith(".webm")
      ) {
        console.log("file");
        url = args[1];
        const channel = message.author.voice.channel;
        if (!channel) return;
        await streamer.joinVoice(message.guildId, channel.id);
        const udp = await streamer.createStream();
        await playVideo(url, udp).then(() => {
          message.channel.send(
            "Video has finished playing! i will leave the voice channel in 5 seconds"
          );
          //destroy the stream
          setTimeout(() => {
            streamer.leaveVoice(message.guildId);
          }, 5000);
        });
      } else {
        const searchQuery = args.slice(1).join(" ");
        const info = await ytstream.search(searchQuery);
        console.log("search");
        url = info[0].url;
        await downloadVideo(url, "./video.mp4");
      }
    } catch (e) {
      console.log(e);
    }
  }
});

streamer.client.login(process.env.TOKEN);
