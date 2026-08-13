import {store} from "../store/store.js";

export function keys() {
    return Array.from(store.keys()).join("\n");
}