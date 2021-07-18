import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as express from "express";
import * as path from "path";
import * as http from "http";
import * as fs from "fs";
import { Server as SocketIoServer, Socket } from "socket.io";

const app = express();
const httpServer = http.createServer(app);
const io = new SocketIoServer(httpServer);

app.use(cors());
app.use(bodyParser.json());
app.use("/", express.static(path.join(__dirname, "../ui-dist")));
app.use("*", express.static(path.join(__dirname, "../ui-dist/index.html")));

const connectedClients = new Set<Socket>();

io.on("connection", (socket) => {
    socket.on("connectedClients", () => {
        socket.emit("connectedClients", connectedClients.size);
    });
    socket.on("registerConsumer", () => {
        connectedClients.add(socket);
        io.emit("connectedClients", connectedClients.size);
    });
    socket.on("disconnect", () => {
        connectedClients.delete(socket);
        io.emit("connectedClients", connectedClients.size);
    });
    socket.on("show", ({template, data}) => {
        io.emit("show", template, data);
    });
    socket.on("version", () => {
        io.emit("version", JSON.parse(fs.readFileSync(path.join(__dirname, "../package.json")).toString()).version);
    });
});

const port = 16849;
httpServer.listen(port, () => {
    console.log(`Server started on port ${port}!`);
});