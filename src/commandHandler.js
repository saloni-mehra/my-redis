import setCommand from "./commands/set.js";
import getCommand from "./commands/get.js";
import { del } from "./commands/del.js";
import { exists } from "./commands/exist.js";
import { keys } from "./commands/keys.js";
import { flushall } from "./commands/flushall.js";


const commandHandler = (command) => {
    const parts = command.split(" ");

    const commandName = parts[0].toUpperCase();

    if (commandName === "PING") {
        return "PONG";
    }

    if (commandName === "SET") {
        const key = parts[1];
        const value = parts.slice(2).join(" ");

        if (!key || !value) {
            return "ERROR: SET requires key and value";
        }

        return setCommand(key, value);
    }

    if (commandName === "GET") {
        const key = parts[1];

        if (!key) {
            return "ERROR: GET requires key";
        }

        return getCommand(key);
    }

    if (commandName === "DEL") {
        const keys = parts.slice(1);

        if (keys.length === 0) {
            return "ERROR: DEL requires at least one key";
        }

        return String(del(keys));
    }

    if (commandName === "EXISTS") {
        const keys = parts.slice(1);

        if (keys.length === 0) {
            return "ERROR: EXISTS requires at least one key";
        }

        return String(exists(keys));
    }

    if (commandName === "KEYS") {
        return keys();
    }

    if (commandName === "FLUSHALL") {
        return flushall();
    }

    return "ERROR: Unknown command";
};

export default commandHandler;

