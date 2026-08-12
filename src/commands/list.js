// LPUSH
// LRANGE
// LLEN
// LPOP
// RPOP


import store, {del}  from "../store/store.js";

export function lpush(key, value) {
    let list = store.get(key);

    if (list === null || list === undefined) {
        list = [];
    }

    list.unshift(value);
    store.set(key, list);

    return list.length;
}


export function llen(key) {
    const list = store.get(key);

    if (!list) {
        return 0;
    }

    return list.length;
}


export function lrange(key, start, end) {
    const list = store.get(key);

    if (!list) {
        return [];
    }

    if (end === -1) {
        end = list.length - 1;
    }

    return list.slice(start, end + 1);
}

//Remove from start
export function lpop(key) {
    const list = store.get(key);

    if (!list) {
        return null;
    }

    const value = list.shift();

    if (list.length === 0) {
        del(key);
    }

    return value;
}

//Remove from last
function rpop(key) {
    const list = store.get(key);

    if (!list) {
        return null;
    }

    const value = list.pop();

    if (list.length === 0) {
        del(key);
    }

    return value;
}


//get element by index
function lindex(key, index) {
    const list = store.get(key);

    if (!list) {
        return null;
    }

    return list[index] ?? null;
}

export function lset(key, index, value) {
    const list = store.get(key);

    if (!list) {
        return "(nil)";
    }

    index = Number(index);

    if (index < 0) {
        index = list.length + index;
    }

    if (index < 0 || index >= list.length) {
        return "(index out of range)";
    }

    list[index] = value;

    return "OK";
}


export default {
    lpush,
    lrange,
    llen,
    lpop,
    rpop,
    lindex,
    lset
};