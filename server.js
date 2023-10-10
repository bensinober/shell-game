// Bun server with websocket and static file serving
const BASE_PATH = "./www"
var pendingBuffer,pendingCmd, pendingSize, pendingMode
const httpServer = Bun.serve({
  port: 8665,
  host: "0.0.0.0",
  async fetch(req, server) {
    const url = new URL(req.url);
    if (url.pathname === "/ws") {
      // ws upgrade logic and channels subscription
      // valid channels are: commands, centroids, images
      const channels = new URL(req.url).searchParams.get("channels").split(",")
      return server.upgrade(req, {
        data: {
          createdAt: Date.now(),
          channels: channels,
        }
      })
    } else {
      const filePath = BASE_PATH + url.pathname
      const file = Bun.file(filePath)
      return new Response(file)
    }
  },
  websocket: {
    message(ws, data) {
      if (!pendingBuffer) {
        console.log(`Got new data from ${ws.data.sessionId}: ${data.length}`)
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
        console.log(`Adding raw data to pending buffer from ${ws.data.sessionId}: ${data.length}`)
        pendingBuffer = Buffer.concat([pendingBuffer, data])
        console.log(`pending buffer now: ${pendingBuffer.length} expecting: ${pendingSize}`)
        if (pendingBuffer.length < pendingSize ) {
          return
        }
      }
      console.log(pendingBuffer.length, pendingSize)
      switch(pendingCmd) {
      case 0:
        console.log(`WS command response: ${pendingBuffer}`)
        break
      case 1:
        console.log(`GAME MODE CHANGE: ${pendingMode}`)
        ws.publish("commands", data) // we just forward message
        //ws.publish("commands", pendingBuffer)
        break
      case 2:
        console.log("CENTROID DATA")
        ws.publish("centroids", pendingBuffer)
        break
      case 3:
        console.log("IMAGE DATA")
        ws.publish("images", pendingBuffer)
        break
      default:
        console.log("UNKNOWN CMD")
      }
      pendingBuffer = undefined
    },
    open(ws) {
      console.log(`opened websocket type ${ws.binaryType} for channels ${ws.data.channels}`)
      for (const c of ws.data.channels) {
        ws.subscribe(c)
      }
      ws.data.sessionId = "shell-game-MCC"
    }, // a socket is opened
    close(ws, code, message) {}, // a socket is closed
    drain(ws) {}, // the socket is ready to receive more data
  },
  error() {
    return new Response(null, { status: 404 })
  },
})
console.log(`Bun http Server listening on ${httpServer.hostname}:${httpServer.port}`)
