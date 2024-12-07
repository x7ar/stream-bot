# Discord Video Streaming Bot

This bot streams videos in Discord voice channels from YouTube, file attachments, or direct video URLs.

## ⚠️ Note
Using this bot on a **user account violates Discord's [Terms of Service](https://discord.com/terms)** and may result in account suspension. Always use a **bot account**.

## Prerequisites
1. **Node.js**: Download it [here](https://nodejs.org/).
2. **npm packages**: Run `npm install` in the directory containing your `package.json`.

## Features
1. **Stream via URL**: Play a YouTube video by providing its URL, e.g., `!play https://www.youtube.com/watch?v=dQw4w9WgXcQ`.
2. **Stream File Attachments**: Directly stream a video file attached to a Discord message.
3. **Stream Direct Video URLs**: Stream videos from URLs ending with `.mp4`, `.mkv`, `.webm`, or Discord CDN links.

## Usage
The bot listens for the `!play` command and streams the specified video in the voice channel you’re connected to.

### Credits
Special thanks to [@usy4](https://github.com/usy4) for support in building this bot.
