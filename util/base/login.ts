import * as Discord from "discord.js";
import token from "../../data/token";

export const client = new Discord.Client();

client.login(token);

client.on("ready", () => console.log("Ready."));