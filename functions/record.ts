import fs from "fs";

import { Message } from "discord.js";

export default async function(message?: Message) {
    const channel = message.member.voice.channel;
    if(!channel) return message.channel.send("You must be in a bot accessible voice channel to use this command.");

    let recname = message.content.split(" ")[1] || undefined;
    
    const connection = await channel.join();
    const receiver = connection.receiver.createStream(message.mentions.members.first(), {
        mode: "pcm",
        end: "manual"
    });

    const writer = receiver.pipe(fs.createWriteStream(`./recordings/${recname}.pcm` || `./recordings/recording_${new Date().toISOString()}.pcm`));
    writer.on("finish", () => {
        message.member.voice.channel.leave();
        message.channel.send("Finished");
    })
}