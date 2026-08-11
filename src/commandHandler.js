import setCommand from "./commands/set.js";

const commandHandler = (command) => {
    const parts = command.split(" ");

    const commandName = parts[0].toUpperCase();

    if (commandName === "SET") {
        const key = parts[1];
        const value = parts.slice(2).join(" ");

        if (!key || !value) {
            return "ERROR: SET requires key and value";
        }

        return setCommand(key, value);
    }

    return "ERROR: Unknown command";
};

export default commandHandler;