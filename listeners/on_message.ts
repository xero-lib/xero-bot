import { Message } from "discord.js";
import mute from "../functions/mute";
// import play from "../functions/play";
import play from "../functions/play";
import record from "../functions/record";
import replay from "../functions/replay";
import { client } from "../util/base/login";

export default function (message: Message) {
	if (!message.content.startsWith("/")) return; //if message doesn't start with "/", return.

	switch (message.content.split("/")[1].split(" ")[0]) {
		case "mute":
			mute(message);
			break;
		case "play":
			play(message);
			break;
		case "stop":
			message.guild.voice.channel.leave();
			break;
		case "record":
			record(message);
			break;
		case "replay":
			replay(message);
			break;
		default:
			return;
	}
}
