import net from "net";
import commandHandler from "./commandHandler.js";


const server = net.createServer((socket) => {
    console.log("Client connected");

    socket.on("data", (data) => {
        const command = data.toString().trim();

        console.log("Received:", command);

        const response = commandHandler(command);

        socket.write(response + "\n");
    });


    socket.on("end", () => {
        console.log("Client disconnected");
    });
});




server.listen(6379, () => {                         //because 6379 is Redis's standard/default port.
    console.log("Redis server is running on port 6379");
});



