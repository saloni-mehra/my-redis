import net from "net";
import commandHandler from "./commandHandler.js";
import { loadSnapshot, saveSnapshot } from "./persistence.js";
import { parseRESP, formatRESP } from "./resp.js";

loadSnapshot();

const server = net.createServer((socket) => {
    console.log("Client connected");

    socket.on("data", (data) => {
        // const command = data.toString().trim();

        // console.log("Received:", command);

        // const response = commandHandler(command);

        // socket.write(response + "\n");

        const rawData = data.toString();

        if (rawData.startsWith("*")) {
            const parts = parseRESP(rawData);

            if (parts) {
                const command = parts.join(" ");

                console.log("Received RESP:", command);

                const response = commandHandler(command);

                socket.write(formatRESP(response));
            }

            return;
        }

        const command = rawData.trim();

        console.log("Received:", command);

        const response = commandHandler(command);

        socket.write(response + "\n");

    });

    socket.on("end", () => {
        console.log("Client disconnected");
    });

    socket.on("error", (err) => {
        console.log("Socket error:", err.message);
    });
});



server.listen(6379, () => {
    console.log("Redis server is running on port 6379");
});

process.on("SIGINT", () => {
    console.log("Saving snapshot...");

    saveSnapshot();

    console.log("Snapshot saved.");
    console.log("Redis server stopped.");

    process.exit(0);
});