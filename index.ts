import { client } from "./util/base/login";
import on_message from "./listeners/on_message";

client.on("message", on_message)