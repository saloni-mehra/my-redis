import store from "../store/store.js";

export const del = (keys) => {
    let deletedCount = 0;

    for (const key of keys) {
        if (store.del(key)) {
            deletedCount++;
        }
    }

    return deletedCount;
};