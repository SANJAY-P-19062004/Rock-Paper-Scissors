const rooms = [];

const roomHandler = (socket, io) => {
  const create = (callback) => {
    const roomId = Math.random().toString(36).substr(2, 6);
    const room = {
      roomId,
      players: {},
      vacant: true,
      private: true,
    };

    rooms.push(room);
    callback(room);
  };

  const join = (payload, callback) => {
    const index = rooms.findIndex((room) => room.roomId === payload.roomId);
    if (index >= 0) {
      const room = rooms[index];
      if (room.players[socket.id]) return callback(null);

      if (room.vacant && room.private) {
        room.players[socket.id] = {
          option: null,
          optionLock: false,
          score: 0,
        };
        room.vacant = false;
        socket.join(room.roomId);
        io.to(room.roomId).emit("room:get", room);
      } else {
        callback({ error: true });
      }
    } else {
      callback({ error: true });
    }
  };

  const update = (payload) => {
    const index = rooms.findIndex((room) => room.roomId === payload.roomId);
    if (index >= 0) {
      rooms[index] = payload;
      io.to(payload.roomId).emit("room:get", payload);
    }
  };

  socket.on("room:create", create);
  socket.on("room:update", update);
  socket.on("room:join", join);
};

export default roomHandler;
