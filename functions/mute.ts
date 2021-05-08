import { Channel, GuildChannel, Message } from "discord.js";

function hasOwnProperty<X extends {}, Y extends PropertyKey>(obj: X, prop: Y): obj is X & Record<Y, unknown> {
    return obj.hasOwnProperty(prop)
}

function isGuildChannel(channel: Channel): channel is GuildChannel {
    return hasOwnProperty(channel, "permissionOverwrites"); 
}

export default function(message: Message) {
    if(!isGuildChannel(message.channel)) return;    

    let msg = message.content.split("/")[1];
    
    if(message.member.hasPermission(8) && message.mentions.members.first()) {
        if(msg.startsWith("mute")) {
            message.reply(`Muting ${message.mentions.members.first().user.tag}`);
            message.channel.updateOverwrite(message.mentions.members.first().user, {"SEND_MESSAGES": false});
        } else if(msg.startsWith("unmute")) {
            message.reply(`Unmuting ${message.mentions.members.first().user.tag}`);
            message.channel.updateOverwrite(message.mentions.members.first().user, {"SEND_MESSAGES": true})
        }
    }
}