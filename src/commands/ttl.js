import { ttl } from "../store/store.js";

export function ttlCommand(key) {
    return ttl(key).toString();
}