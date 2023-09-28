const server = Bun.listen({
  hostname: "localhost",
  port: 8666,
  socket: {
    data(socket, data) {
      console.log(`Got data from ${socket.data.sessionId}: ${data}`)
      const buf = Buffer.from(data.buffer);
      const cmd = buf.readUInt8(0)
      const len = buf.readUInt8(1)
      const x = buf.readInt32(2)
      const y = buf.readInt32(6)
      console.log(cmd, len, x, y)
      //socket.write(`${socket.data.sessionId}: ack`)
    },
    open(socket) {
      console.log("openend")
      socket.data = { sessionId: "id-wowser" }
    },
    close(socket) {
      console.log("closed")
    },
    drain(socket) {}, // socket ready for more data
    error(socket, error) {
      console.log(`error ${socket.data.sessionId}:  ${error}`)
    },
  },
})
console.log(`Bun listening on ${server.hostname}:${server.port}`)