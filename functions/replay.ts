import { Message } from "discord.js";
import fs from "fs";

export default async function(message: Message) {
    const channel = message.member.voice.channel;

    let recname = message.content.split(" ")[1];

    if(!channel) return message.channel.send("You must be in a voice channel");

    if(!fs.existsSync(`./recordings/${recname}.pcm`)) return message.channel.send("No recording with that name found.");

    const connection = await channel.join();
    const stream = fs.createReadStream(`./recordings/${recname}.pcm`);

    const dispatcher = connection.play(stream, {
        type: "converted"
    })

    dispatcher.on("finish", () => {
        channel.leave();
        return message.channel.send("Playback concluded.")
    })
}