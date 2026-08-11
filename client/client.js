import net from "net";
import readline from "readline";

const client = net.createConnection(
    { port: 6379 },
    () => {
        console.log("Connected to Redis server");

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: "redis> "
        });

        rl.prompt();

        rl.on("line", (command) => {
            client.write(command);
            rl.prompt();
        });

    }
);


client.on("data", (data) => {
    console.log("Server:", data.toString());
});

client.on("error", (err) => {
    console.log("Error:", err.message);
});