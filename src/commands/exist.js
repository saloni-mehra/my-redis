import store from "../store/store.js";


export const exists = (keys) => {
    let count = 0;

    for (const key of keys) {
        if (store.has(key)) {
            count++;
        }
    }

    return count;
};