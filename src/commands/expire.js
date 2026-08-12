import { expire } from "../store/store.js";

export function expireCommand(key, seconds) {
    return expire(key, seconds) ? "1" : "0";
}