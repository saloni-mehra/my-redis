const store = new Map();
const expiry = new Map();

export function set(key, value) {
    store.set(key, value);
}

export function get(key) {
    if (isExpired(key)) {
        store.delete(key);
        expiry.delete(key);
        return null;
    }

    return store.get(key);
}

export function del(key) {
    if (isExpired(key)) {
        store.delete(key);
        expiry.delete(key);
        return false;
    }

    const deleted = store.delete(key);
    expiry.delete(key);

    return deleted;
}

export function exists(key) {
    if (isExpired(key)) {
        store.delete(key);
        expiry.delete(key);
        return false;
    }

    return store.has(key);
}

export function expire(key, seconds) {
    if (!store.has(key)) {
        return false;
    }

    const expireAt = Date.now() + seconds * 1000;

    expiry.set(key, expireAt);

    return true;
}

export function ttl(key) {
    if (isExpired(key)) {
        store.delete(key);
        expiry.delete(key);
        return -2;
    }

    if (!store.has(key)) {
        return -2;
    }

    if (!expiry.has(key)) {
        return -1;
    }

    const expireAt = expiry.get(key);
    const remaining = Math.ceil((expireAt - Date.now()) / 1000);

    if (remaining <= 0) {
        store.delete(key);
        expiry.delete(key);
        return -2;
    }

    return remaining;
}

export function persist(key) {
    if (isExpired(key)) {
        store.delete(key);
        expiry.delete(key);
        return false;
    }

    if (!store.has(key)) {
        return false;
    }

    if (!expiry.has(key)) {
        return false;
    }

    expiry.delete(key);

    return true;
}

function isExpired(key) {
    if (!expiry.has(key)) {
        return false;
    }

    const expireAt = expiry.get(key);

    return Date.now() >= expireAt;
}

export default {
    set,
    get,
    del,
    exists
};