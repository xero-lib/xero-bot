import { Message } from "discord.js";
import mute from "../functions/mute";
// import play from "../functions/play";
import play from "../functions/play";

export default function(message: Message) {
    if(!message.content.startsWith("/")) return; //if message doesn't start with "/", return.

    switch(message.content.split("/")[1].split(" ")[0]) {
        case("mute"): 
            mute(message);
            break;
        case("play"):
            play(message);
            break;
        default: return;
    }
}