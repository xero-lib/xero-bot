import * as Discord from "discord.js";

export default function(message: Discord.Message) {
    let admins = [];
    message.guild.members.cache.forEach((member) => {
        if(member.hasPermission(8)) {
            admins.push(member);
        }
    })

    return admins;
}