

//actual redis fromat of command 

export function parseRESP(data) {
    const input = data.toString();

    if (!input.startsWith("*")) {
        return null;
    }

    const lines = input.split("\r\n");

    const count = Number(lines[0].slice(1));
    const parts = [];

    let index = 1;

    for (let i = 0; i < count; i++) {
        const length = Number(lines[index].slice(1));
        index++;

        parts.push(lines[index]);
        index++;
    }

    return parts;
}


export function formatRESP(response) {
    if (response === null || response === undefined) {
        return "$-1\r\n";
    }

    if (/^-?\d+$/.test(String(response))) {
        return `:${response}\r\n`;
    }

    if (String(response).startsWith("ERROR:") ||
        String(response).startsWith("ERR")) {
        return `-${response}\r\n`;
    }

    return `$${Buffer.byteLength(String(response))}\r\n${response}\r\n`;
}

export function formatRESPArray(values) {
    let response = `*${values.length}\r\n`;

    for (const value of values) {
        const stringValue = String(value);

        response += `$${Buffer.byteLength(stringValue)}\r\n`;
        response += `${stringValue}\r\n`;
    }

    return response;
}