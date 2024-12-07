const ffmpeg = require("fluent-ffmpeg");
const { PassThrough } = require("stream");
const youtubedl = require("youtube-dl-exec");

async function playMedia(sourceType, videoSource, audioSource, stream) {
  if (sourceType === "URL") {
    // إذا كان المصدر عبارة عن روابط مباشرة
    await playStream(videoSource, audioSource, stream);
  } else if (sourceType === "YOUTUBE") {
    try {
      console.log("Fetching video information from YouTube...");

      // استخراج معلومات الفيديو باستخدام youtube-dl-exec
      const videoUrlData = await youtubedl(videoSource, {
        dumpSingleJson: true,
        noWarnings: true,
        noCallHome: true,
        format: "bestvideo",
      });

      const audioUrlData = await youtubedl(videoSource, {
        dumpSingleJson: true,
        noWarnings: true,
        noCallHome: true,
        format: "bestaudio",
      });

      const videoUrl = videoUrlData.url;
      const audioUrl = audioUrlData.url;

      await playStream(videoUrl, audioUrl, stream);
    } catch (error) {
      console.error("Error fetching video information:", error);
    }
  }
}

async function playStream(video, audio, stream) {
  const dispatcher = await stream.playVideo(video, {
    fps: 60,
    bitrate: 6000,
  });
  const dispatcher2 = await stream.playAudio(audio);
  dispatcher.on("start", () => {
    console.log("video is now playing!");
  });

  dispatcher.on("finish", () => {
    console.log("video has finished playing!");
    stream.disconnect();
  });
  dispatcher.on("error", console.error);

  dispatcher2.on("start", () => {
    console.log("audio is now playing!");
  });

  dispatcher2.on("finish", () => {});
  dispatcher2.on("error", console.error);
}

module.exports = { playMedia };
