import { persist } from "../store/store.js";

export function persistCommand(key) {
    return persist(key) ? "1" : "0";
}