import { Client } from "discord.js";
import token from "../../data/token";

export const client = new Client();

client.login(token);

client.on("ready", () => console.log("Ready."));