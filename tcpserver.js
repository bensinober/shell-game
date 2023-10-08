// This is the Main Command Centre for the shell game
// A simple TCP Socker server for handling:
//  - commands to and from Zig shell game client
//  - websocket commands to and from browser
// Could of course implement websocket client in Zig shell game directly, but websocket can only pass
// one data type, so we would need to parse data packets anyways
// serializing to and from JSON and sending images as base64 is too much overhead
// We need the Zig game client to be focused only on its basic task - DNN computation
// This is the simple data packet format
// cmd | gameMode | buffer length | data buffer
var pendingBuffer,pendingCmd, pendingSize, pendingMode
// const wsCmd = new WebSocket("ws://localhost:8665/ws?channels=commands") // if we need game to send commands to browser directly
const wsImg = new WebSocket("ws://localhost:8665/ws?channels=images")
const wsCent = new WebSocket("ws://localhost:8665/ws?channels=centroids")
const tcpServer = Bun.listen({
  hostname: "localhost",
  port: 8666,
  socket: {
    data(socket, data) {
      if (!pendingBuffer) {
        console.log(`Got new data from ${socket.data.sessionId}: ${data.length}`)
        const buf = Buffer.from(data.buffer);
        pendingCmd = buf.readUInt8(0)
        pendingMode = buf.readUInt8(1)
        pendingSize = buf.readInt32(2)
        pendingBuffer = buf.slice(6)
        console.log(`buffer Cmd: ${pendingCmd} Mode: ${pendingCmd} Size: ${pendingSize}`)
        if (pendingBuffer.length < pendingSize) {
          return
        }
      } else {
        console.log(`Adding raw data to pending buffer from ${socket.data.sessionId}: ${data.length}`)
        pendingBuffer = Buffer.concat([pendingBuffer, data])
        console.log(`pending buffer now: ${pendingBuffer.length} expecting: ${pendingSize}`)
        if (pendingBuffer.length < pendingSize ) {
          return
        }
      }
      console.log(pendingBuffer.length, pendingSize)
      switch(pendingCmd) {
      case 1:
        console.log(`GAME MODE CHANGE: ${pendingMode}`)
        break
      case 2:
        console.log("CENTROID DATA")
        wsCent.send(pendingBuffer)
        break
      case 3:
        console.log("IMAGE DATA")
        wsImg.send(pendingBuffer)
        break
      default:
        console.log("UNKNOWN CMD")
      }
      pendingBuffer = undefined
    },
    open(socket) {
      console.log("openend")
      socket.data = { sessionId: "shell-game-MCC" }
    },
    close(socket) {
      console.log("closed")
    },
    drain(socket) {
      /* NOT NEEDED
      const pending = socket.data?.pendingBuffer
      if (!pendingBuffer) return
      if (socket.write(pendingBuffer)) {
        socket.data = undefined;
        return;
      }
      */
    },
    error(socket, error) {
      console.log(`error ${socket.data.sessionId}:  ${error}`)
    },
  },
})
console.log(`Bun tcp Server listening on ${tcpServer.hostname}:${tcpServer.port}`)
