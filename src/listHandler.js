import list from "./commands/list.js";

const listHandler = (commandName, parts) => {
    if (commandName === "LPUSH") {
        const key = parts[1];
        const value = parts.slice(2).join(" ");

        if (!key || !value) {
            return "ERROR: LPUSH requires key and value";
        }

        return list.lpush(key, value);
    }

    if (commandName === "LRANGE") {
        const key = parts[1];
        const start = Number(parts[2]);

        const end = Number(parts[3]);

        if (!key || isNaN(start) || isNaN(end)) {
            return "ERROR: LRANGE requires key, start and end";
        }

        return list.lrange(key, start, end);
    }

    if (commandName === "LLEN") {
        const key = parts[1];

        if (!key) {
            return "ERROR: LLEN requires key";
        }

        return list.llen(key);
    }

    if (commandName === "LPOP") {
        const key = parts[1];

        if (!key) {
            return "ERROR: LPOP requires key";
        }

        return list.lpop(key);
    }

    if (commandName === "RPOP") {
        const key = parts[1];

        if (!key) {
            return "ERROR: RPOP requires key";
        }

        return list.rpop(key);
    }

    if (commandName === "LINDEX") {
        const key = parts[1];
        const index = Number(parts[2]);

        if (!key || isNaN(index)) {
            return "ERROR: LINDEX requires key and index";
        }

        return list.lindex(key, index);
    }

    if (commandName === "LSET") {
        const key = parts[1];
        const index = Number(parts[2]);
        const value = parts.slice(3).join(" ");

        if (!key || isNaN(index) || !value) {
            return "ERROR: LSET requires key, index and value";
        }

        return list.lset(key, index, value);
    }


    return null;
};

export default listHandler;