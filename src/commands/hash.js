import store from "../store/store.js";

export function hset(key, field, value) {
    let hash = store.get(key);

    if (!hash) {
        hash = {};
    }

    hash[field] = value;
    store.set(key, hash);

    return 1;
}


export function hget(key, field) {
    const hash = store.get(key);

    if (!hash) {
        return  "(nil)";
    }

    return hash[field] ?? "(nil)";
}

function hdel( key, field) {
    const hash = store.get(key);

    if (!hash || typeof hash !== "object") {
        return 0;
    }

    if (!Object.prototype.hasOwnProperty.call(hash, field)) {
        return 0;
    }

    delete hash[field];

    return 1;
}

export function hexists(key, field) {
    const hash = store.get(key);

    if (!hash || typeof hash !== "object") {
        return 0;
    }

    return Object.prototype.hasOwnProperty.call(hash, field) ? 1 : 0;
}

export function hkeys(key) {
  const hash = store.get(key);

  if (!hash) {
    return [];
  }

  return Object.keys(hash);
}

export function hvals(key) {
  const hash = store.get(key);

  if (!hash) {
    return [];
  }

  return Object.values(hash);
}

export function hlen(key) {
  const hash = store.get(key);

  if (!hash) {
    return 0;
  }

  return Object.keys(hash).length;
}

export function hmget(key, fields) {
    const hash = store.get(key);

    if (!hash) {
        return fields.map(() => null);
    }

    return fields.map((field) => {
        if (!(field in hash)) {
            return null;
        }

        return hash[field];
    });
}

export function hgetall(key) {
    const hash = store.get(key);

    if (!hash) {
        return [];
    }

    return Object.entries(hash).flat();
}

export default {
    hset,
    hget,
    hdel,
    hexists,
    hkeys,
    hvals,
    hlen,
    hmget,
    hgetall

};