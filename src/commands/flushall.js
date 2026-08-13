import {store} from "../store/store.js";

export function flushall() {
    store.clear();

    return "OK";
}