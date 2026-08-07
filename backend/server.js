import http from "http";
import { Server } from "socket.io";
import app from "./src/app.js";

const port = process.env.PORT || 4500;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  socket.on("join-coach", ({ train_id, travel_date, coach_name }) => {
    const roomName = `coach:${train_id}:${travel_date}:${coach_name}`;
    socket.join(roomName);
  });

  socket.on("leave-coach", ({ train_id, travel_date, coach_name }) => {
    const roomName = `coach:${train_id}:${travel_date}:${coach_name}`;
    socket.leave(roomName);
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});