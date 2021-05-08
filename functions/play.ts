import ytdl = require("ytdl-core");
import ytSearch from "yt-search";
import { Guild, Message, MessageEmbed } from "discord.js";

const queue = new Map();

const video_player = (guild: Guild, song) => {
    const song_queue = queue.get(guild.id);

    if(!song) {
        song_queue.voice_channel.leave();
        queue.delete(guild.id);
        return;
    }

    const stream = ytdl(song.url, { filter: "audioonly" });
    song_queue.connection.play(stream)
    .on("finish", () => {
            song_queue.songs.shift();
            video_player(guild, song_queue.songs[0]);
    });

    song_queue.text_channel.send(`Now playing **${song.title}**`);
}

export default async function(message: Message) {
    let embed: MessageEmbed = new MessageEmbed();
    let args: any;

    if(!message.member.voice.channel) {
        message.channel.send(embed.setTitle("Play")
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setColor("RED")
            .setDescription("You must be in a voice channel to listen to music with this bot.")
            .setTimestamp()
        );

        return;
    }

    const permissions = message.member.voice.channel.permissionsFor(message.client.user);
    if(!permissions.has("CONNECT")) {
        message.channel.send(embed.setTitle("Play")
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setColor("RED")
            .setDescription(`The bot does not have permissions to connect to ${message.member.voice.channel.name}`)
            .setTimestamp()
        );

        return;
    }

    if(!message.content.split("/")[1].split(" ")[1]) {
        message.channel.send(embed.setTitle("Play")
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setColor("RED")
            .setDescription("You must provide a song to play.")
            .setTimestamp()
        );

        return;
    } else {
        args = message.content.split("/play")[1]; //find better way to do this
    }

    const server_queue = queue.get(message.guild.id);

    let song: any = {};

    if(ytdl.validateURL(args.split(" ")[0])) {
        const songInfo = await ytdl.getInfo(args[0]);
        song = { title: songInfo.videoDetails.title, url: songInfo.videoDetails.video_url };
    } else {
        const videoFinder = async(query) => {
            const videoResult = await ytSearch(query);

            return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
        }

        const video = await videoFinder(args);

        if(video) {
            song = { title: video.title, url: video.url }
        } else {
            message.channel.send(embed.setTitle("Play")
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setColor("RED")
                .setDescription("Could not find video.")
                .setTimestamp()
            );
        }
    }

    if(!server_queue) {
        const queueConstructor = {
            voice_channel: message.member?.voice?.channel,
            text_channel: message.channel,
            connection: null,
            songs: []
        }

        queue.set(message.guild.id, queueConstructor);
        queueConstructor.songs.push(song);

        try {
            const connection = await message.member.voice.channel.join();
            queueConstructor.connection = connection;

            video_player(message.guild, queueConstructor.songs[0])
        } catch(err) {
            queue.delete(message.guild.id);
            message.channel.send("There was an error connecting and playing the requested song.");
            console.error(err);
        }
    } else {
        server_queue.songs.push(song);
        return message.channel.send(embed.setTitle("Play")
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setColor("GREEN")
            .setDescription(`Adding ${song.title} to the queue.`)
            .setTimestamp()
        );
    }
}
