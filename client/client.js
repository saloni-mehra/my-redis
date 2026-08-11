import net from "net";

const client = net.createConnection(
    { port: 6379 },
    () => {
        console.log("Connected to Redis server");

        client.write("PING");
    }
);

client.on("data", (data) => {
    console.log("Server:", data.toString());
});

client.on("error", (err) => {
    console.log("Error:", err.message);
});