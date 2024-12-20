// Bun server with websocket and static file serving
import { Database } from "bun:sqlite"
import { recurrent, NeuralNetwork, NeuralNetworkGPU } from "./www/assets/brain.js"


const db = new Database("shell-game.db")
db.exec("PRAGMA journal_mode = WAL;")

const BASE_PATH = "./www"
var pendingBuffer,pendingCmd, pendingSize, pendingMode

const net = new recurrent.LSTM({hiddenLayers: [20]})
/*const net = new NeuralNetwork({
  hiddenLayers: [10, 10],
  activation: "sigmoid",
})*/
const model = Bun.file("www/assets/model.json")
const ltsmModel = await model.json()
net.fromJSON(ltsmModel)

const httpServer = Bun.serve({
  port: 8665,
  host: "0.0.0.0",
  tls: {
    cert: Bun.file("cert.pem"),
    key: Bun.file("key.pem"),
  },
  async fetch(req, server) {
    const url = new URL(req.url);
    switch (url.pathname) {
    case "/ws":
      // ws upgrade logic and channels subscription
      // valid channels are: commands, centroids, images
      const channel = new URL(req.url).searchParams.get("channels")
      return server.upgrade(req, {
        data: {
          createdAt: Date.now(),
          channels: [channel],
        }
      })
      break

    case "/api/stats":
      try {
        const json = await req.json()
        const { uuid, rect, centr, score} = json
        const exists = db.query(`SELECT * FROM stats WHERE uuid=?1`).get(uuid)
        if (exists) {
          db.query(`UPDATE stats SET boxx=?1, boxy=?2, boxw=?3, boxh=?4, centx=?5, centy=?6, score=?7 WHERE uuid = ?8`)
            .run(rect.x, rect.y, rect.w, rect.h, centr.x, centr.y, score, uuid)
        } else {
          db.query(`INSERT INTO stats (uuid,boxx,boxy,boxw,boxh,centx,centy,score) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?6, ?8)`)
            .run(uuid, rect.x, rect.y, rect.w, rect.h, centr.x, centr.y, score)
          }
        return new Response("OK")
      } catch(err) {
        console.log(err)
      }
      break

    case "/api/getstats":
      try {
        const stats = db.query(`SELECT STRFTIME('%s', time),uuid,boxx,boxy,boxw,boxh,centx,centy,score,predictSeq,predictLetter,verdictLetter FROM stats`).values()
        return Response.json(stats)
      } catch(err) {
        console.log(err)
      }
      break

    case "/api/snapimg":
      try {
        const formData = await req.formData()
        const uuid = formData.get("uuid")
        const num = formData.get("num").padStart(2, "0")
        const img = formData.get("image")
        const imgPath = `images/${uuid}_snap_${num}.png`
        await Bun.write(imgPath, img)
        //db.query(`UPDATE stats SET slideimg=?1 WHERE uuid=?2`)
        //  .run(imgPath, uuid)
        return new Response("OK")
      } catch(err) {
        console.log(err)
      }
      break

    case "/api/slideimg":
      try {
        const formData = await req.formData()
        const uuid = formData.get("uuid")
        const img = formData.get("image")
        const imgPath = `images/${uuid}_slideimg.png`
        await Bun.write(imgPath, img)
        //db.query(`UPDATE stats SET slideimg=?1 WHERE uuid=?2`)
        //  .run(imgPath, uuid)
        return new Response("OK")
      } catch(err) {
        console.log(err)
      }
      break

    case "/api/predictSequence":
      try {
        const { searchParams } = new URL(req.url)
        const seq = searchParams.get("seq")
        const res = await net.run(seq.split(""))
        console.log(res)
        return new Response(res)
      } catch(err) {
        console.log(err)
      }
      break

    case "/api/predictimg":
      try {
        const formData = await req.formData()
        const uuid = formData.get("uuid")
        const img = formData.get("image")
        const imgPath = `images/${uuid}_predict.png`
        await Bun.write(imgPath, img)
        //db.query(`UPDATE stats SET predimg=?1 WHERE uuid=?2`)
        //  .run(imgPath, uuid)
        return new Response("{}")
      } catch(err) {
        console.log(err)
      }
      break

    case "/api/verdict":
      try {
        const json = await req.json()
        const { predictSeq, predictLetter, verdictLetter, uuid } = json
        const res = db.query(`UPDATE stats SET predictSeq=?1, predictLetter=?2, verdictLetter=?3 WHERE uuid=?4`)
          .all(predictSeq, predictLetter, verdictLetter, uuid)
        return new Response("{}")
      } catch(err) {
        console.log(err)
      }
      break

    case "/api/savemodel":
      try {
        const json = await req.json()
        const modelPath = "www/assets/model.json"
        await Bun.write(modelPath, JSON.stringify(json))
        return new Response("OK")
      } catch(err) {
        console.log(err)
      }
      break

    case "/api/loadmodel":
      // load model in server memory
      try {
        const file = Bun.file("www/assets/model.json")
        return new Response(file)
      } catch(err) {
        console.log(err)
      }
      break

    default:
      const filePath = BASE_PATH + url.pathname
      const file = Bun.file(filePath)
      return new Response(file)
    }
  },
  websocket: {
    message(ws, data) {
      ws.publish("shell-game", data)
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
