import hash from "./commands/hash.js";

const hashHandler = (commandName, parts) => {
    if (commandName === "HSET") {
        const key = parts[1];
        const field = parts[2];
        const value = parts.slice(3).join(" ");

        if (!key || !field || !value) {
            return "ERROR: HSET requires key, field and value";
        }

        return hash.hset(key, field, value);
    }

    if (commandName === "HGET") {
        const key = parts[1];
        const field = parts[2];

        if (!key || !field) {
            return "ERROR: HGET requires key and field";
        }

        return hash.hget(key, field);
    }

    if (commandName === "HDEL") {
        const key = parts[1];
        const field = parts[2];

        if (!key || !field) {
            return "ERROR: HDEL requires key and field";
        }

        return hash.hdel(key, field);
    }

    if (commandName === "HEXISTS") {
        const key = parts[1];
        const field = parts[2];

        if (!key || !field) {
            return "ERROR: HEXISTS requires key and field";
        }

        return hash.hexists(key, field);
    }

    if (commandName === "HKEYS") {
        const key = parts[1];

        if (!key) {
            return "ERROR: HKEYS requires key";
        }

        return hash.hkeys(key);
    }

    if (commandName === "HVALS") {
        const key = parts[1];

        if (!key) {
            return "ERROR: HVALS requires key";
        }

        return hash.hvals(key);
    }   

    if (commandName === "HLEN") {
        const key = parts[1];

        if (!key) {
            return "ERROR: HLEN requires key";
        }

        return hash.hlen(key);
    }

    if (commandName === "HMGET") {
        const key = parts[1];
        const fields = parts.slice(2);

        if (!key || fields.length === 0) {
            return "ERROR: HMGET requires key and at least one field";
        }

        return hash.hmget(key, fields);
    }

    if (commandName === "HGETALL") {
        const key = parts[1];

        if (!key) {
          return "ERROR: HGETALL requires key";
        }

       return hash.hgetall(key);
    }

    return null;
};

export default hashHandler;