import { store, expiry } from "./store/store.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
//we are using this for better windows version to implement persist
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, "../data");
const dumpFile = path.join(dataDir, "dump.json");

function serializeValue(value) {
    if (value instanceof Map) {
        return {
            type: "hash",
            value: Array.from(value.entries())
        };
    }

    if (Array.isArray(value)) {
        return {
            type: "list",
            value: value
        };
    }

    return {
        type: "string",
        value: value
    };
}

export function saveSnapshot() {
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir);
    }

    const data = {
        store: Array.from(store.entries()).map(([key, value]) => [
            key,
            serializeValue(value)
        ]),
        expiry: Array.from(expiry.entries())
    };

    fs.writeFileSync(
        dumpFile,
        JSON.stringify(data, null, 2)
    );
}

export function loadSnapshot() {
    if (!fs.existsSync(dumpFile)) {
        return;
    }

    const data = JSON.parse(
        fs.readFileSync(dumpFile, "utf-8")
    );

    store.clear();
    expiry.clear();

    for (const [key, value] of data.store) {
        if (value.type === "hash") {
            store.set(key, new Map(value.value));
        } 
        else if (value.type === "list") {
            store.set(key, value.value);
        } 
        else {
            store.set(key, value.value);
        }
    }

    for (const [key, expireAt] of data.expiry) {
        expiry.set(key, expireAt);
    }
}