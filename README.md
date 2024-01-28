# Discord Stream Bot

This bot is designed to stream videos in a Discord voice channel. It can stream videos from YouTube or from a file attachment.

## Prerequisites

Before you can run this bot, you need to install several dependencies:

1. Node.js: This is the runtime environment for executing JavaScript code server-side. You can download it from [here](https://nodejs.org/).

2. FFmpeg: This is a free and open-source software project consisting of a vast software suite of libraries and programs for handling video, audio, and other multimedia files and streams. You can download it from [here](https://ffmpeg.org/download.html).

3. npm packages: You need to install several npm packages. You can do this by running `npm install` in the directory where your `package.json` file is located. The packages you need are:

    - discord.js-selfbot-v13
    - @dank074/discord-video-stream
    - yt-stream
    - ytdl-core
    - fluent-ffmpeg

## How It Works

The bot logs into Discord using a token stored in an environment variable. It listens for messages in all channels it has access to. If a message starts with `!play`, the bot will attempt to stream a video. The video can be specified in one of three ways:

1. As a URL in the message, e.g., `!play https://www.youtube.com/watch?v=dQw4w9WgXcQ`. The bot will download the video and audio from YouTube, merge them into a single file, and then stream that file.

2. As a search query in the message, e.g., `!play never gonna give you up`. The bot will search YouTube for the query, download the first result, and then stream it.

3. As a file attachment to the message. The bot will stream the attached file directly.

4. As a direct URL to a video file ending with `.mp4`, `.mkv`, or `.webm`, or a Discord CDN URL. The bot will stream the video directly from the URL.

The bot uses FFmpeg to merge the audio and video streams from YouTube. It streams the video to Discord using the `@dank074/discord-video-stream` package.

## Acknowledgements

A special thanks to [@usy4](https://github.com/usy4) for their invaluable help in building this bot. Your contributions and support have been instrumental to this project.
