import { createServer } from "http";
import { Server } from "socket.io";
import roomHandler from "./roomHandler.js"; // Ensure this is the correct import

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  
  roomHandler(socket, io); // Pass the socket & io instance
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
