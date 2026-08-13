import { formatRESPArray } from "./resp.js";

const channels = new Map();

export function subscribe(channel, socket) {
    if (!channels.has(channel)) {
        channels.set(channel, new Set());
    }

    channels.get(channel).add(socket);
}

export function publish(channel, message) {
    const subscribers = channels.get(channel);

    if (!subscribers) {
        return 0;
    }

    for (const socket of subscribers) {
        socket.write(
            formatRESPArray([
                "message",
                channel,
                message
            ])
        );
    }

    return subscribers.size;
}

export function unsubscribe(channel, socket) {
    const subscribers = channels.get(channel);

    if (!subscribers) {
        return;
    }

    subscribers.delete(socket);

    if (subscribers.size === 0) {
        channels.delete(channel);
    }
}

export function unsubscribeSocket(socket) {
    for (const [channel, subscribers] of channels) {
        subscribers.delete(socket);

        if (subscribers.size === 0) {
            channels.delete(channel);
        }
    }
}