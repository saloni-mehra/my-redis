



import net from "net";
import readline from "readline";


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "redis> ",
    terminal: false
});

const client = net.createConnection(
    { port: 6379 },
    () => {
        console.log("Connected to Redis server");
        rl.prompt();
    }
);

rl.on("line", (command) => {
    const parts = command.trim().split(/\s+/);

    let resp = `*${parts.length}\r\n`;

    for (const part of parts) {
        resp += `$${Buffer.byteLength(part)}\r\n${part}\r\n`;
    }

    client.write(resp);
});

function parseServerResponse(data) {
    const response = data.toString();

    if (response.startsWith(":")) {
        const number = response.split("\r\n")[0].slice(1);
        return `(integer) ${number}`;
    }

    if (response.startsWith("$-1")) {
        return "(nil)";
    }

    if (response.startsWith("$")) {
        const lines = response.split("\r\n");
        return `"${lines[1]}"`;
    }

    if (response.startsWith("-")) {
        return `(error) ${response.slice(1).trim()}`;
    }

    return response.trim();
}

client.on("data", (data) => {
    console.log(parseServerResponse(data));
    rl.prompt();
});

client.on("error", (err) => {
    console.log("Error:", err.message);
});