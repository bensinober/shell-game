/* shell game javascript */

const GameModes = ["IDLE","START","STOP","SNAP","TRACK_BALL","TRACK_HIDDEN","TRACK_IDLE","PREDICT","VERDICT"]
const eyesActive = false
var gameMode = GameModes[0]
var imgPos = [-150, 0] // don't know why we need to start negative offset, but hey, javascript
var centroid = {x: 320, y: 240}
var predictLetter, verdictLetter
var predictSeq = ""
var timerId
var duration
var slideCnt = 0
const cmdBuf = new ArrayBuffer(6)
const dvCmd = new DataView(cmdBuf)
dvCmd.setUint8(0, 1) // command
dvCmd.setInt32(2, 0, true) // command length 0, little endian

function centroidToLetter(centroid) {
  if (centroid.x < 220) {
    return "A"
  } else if (centroid.x > 421) {
    return "C"
  } else {
    return "B"
  }
}

// INPUT FROM WEBSOCKETS
const ws = new WebSocket("ws://localhost:8665/ws?channels=shell-game")
ws.addEventListener("open", event => ws.binaryType = "arraybuffer")
ws.addEventListener("message", async event => {
  //console.log(`INCOMING: ${event.data}`)
  const dv = new DataView(event.data);
  const cmd = dv.getUint8(0)
  const mode = dv.getUint8(1)
  const len = dv.getInt32(2, true)
  const data = event.data.slice(6)
  const slideCanvas = document.getElementById("slideBox")
  const predictCanvas = document.getElementById("predictBox")
  const ctxSlides = slideCanvas.getContext("2d")
  const ctxTrace = predictCanvas.getContext("2d")
  //console.log(cmd,mode,len, data)
  // Game Mode
  gameMode = GameModes[parseInt(mode, 10)]
  document.getElementById("gameMode").innerHTML = gameMode.toLowerCase()

  switch (cmd) {
  case 0:
    //console.log(`echo cmd res: ${data}`)
    break
  case 1:
    console.log("game mode change")
    break
  case 2:
    // centroid
    console.log("centroid")
    const x = dv.getInt32(6, true)
    const y = dv.getInt32(10, true)
    centroid = {x, y}
    const div = document.querySelector(".centroid")
    div.innerHTML = `${x},${y}`
    if (eyesActive) {
      writeToEyes(x, y)
    }
    break
  case 3:
    console.log("snap")
    // update gameSeq
    predictLetter = centroidToLetter(centroid)
    predictSeq += predictLetter
    var blob = new Blob([data], {type: "image/png"})
    var img = new Image()
    img.onload = function (e) {
      console.log("PNG Loaded")
      ctxSlides.drawImage(img, imgPos[0], imgPos[1], 150, 150)
      window.URL.revokeObjectURL(img.src)
      img = null
    }
    img.onerror = img.onabort = function () {
      img = null
      console.log("error loading image")
      return
    }
    img.src = window.URL.createObjectURL(blob)
    // move canvas image position for next image
    imgPos[0] += 150
    if (imgPos[0] >= 900) {
      imgPos[0] = 0
      imgPos[1] += 150
      if (imgPos[1] >= 450) {
        imgPos[1] = 0
      }
    }
    break
  case 4:
    console.log("dunno")
    break
  case 7:
    console.log("predict")
    // TODO: send to web service here for prediction?
    predictLetter = centroidToLetter(centroid)
    var blob = new Blob([data], {type: "image/png"})
    var img = new Image()
    img.onload = function (e) {
      console.log("PNG Loaded")
      ctxTrace.drawImage(img, 0, 0, 450, 450)
      window.URL.revokeObjectURL(img.src)
      img = null
    }
    img.onerror = img.onabort = function () {
      img = null
      console.log("error loading image")
      return
    }
    img.src = window.URL.createObjectURL(blob)
    break
  case 8:
    console.log("verdict")
    verdictLetter = centroidToLetter(centroid)
    var blob = new Blob([data], {type: "image/png"})
    var img = new Image()
    img.onload = function (e) {
      console.log("PNG Loaded")
      ctxTrace.drawImage(img, 450, 0, 450, 450)
      window.URL.revokeObjectURL(img.src)
      img = null
    }
    img.onerror = img.onabort = function () {
      img = null
      console.log("error loading image")
      return
    }
    img.src = window.URL.createObjectURL(blob)
    break
  case 9:
    console.log("stats")
    var uuid = Math.random().toString(36).slice(-10)
    const slideCanvas = document.getElementById("slideBox")
    const predictCanvas = document.getElementById("predictBox")

    const rect = {
      x: dv.getInt32(6, true),
      y: dv.getInt32(10, true),
      w: dv.getInt32(14, true),
      h: dv.getInt32(18, true),
    }
    const centr = {
      x: dv.getInt32(22, true),
      y: dv.getInt32(26, true)
    }
    const score = dv.getFloat32(30, true)
    await fetch("/api/stats", {
      headers: { "Accept": "application/json", "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({uuid, rect, centr, score})
    })
    await slideCanvas.toBlob(blob => {
      let formData = new FormData()
      formData.append("uuid", uuid)
      formData.append("image", blob, "slide.png")
      fetch("/api/slideimg", { method: "POST", body: formData })
    })
    await predictCanvas.toBlob(blob => {
      let formData = new FormData()
      formData.append("uuid", uuid)
      formData.append("image", blob, "predict.png")
      fetch("/api/predictimg", { method: "POST", body: formData })
    })
    await fetch("/api/verdict", {
      headers: { "Accept": "application/json", "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({predictSeq, predictLetter, verdictLetter, uuid})
    })
    break
  default:
    console.log(`unknow CMD: ${cmd}`)
  }
})

function clearData() {
  const slideCanvas = document.getElementById("slideBox")
  const predictCanvas = document.getElementById("predictBox")
  const ctxSlides = slideCanvas.getContext("2d")
  const ctxTrace = predictCanvas.getContext("2d")
  ctxSlides.clearRect(0, 0, slideCanvas.width, slideCanvas.height)
  ctxTrace.clearRect(0, 0, predictCanvas.width, predictCanvas.height)
  imgPos = [-150, 0] // don't know why we need to start negative offset, but hey, javascript
  centroid = {x: 320, y: 240}
  predictLetter = centroidToLetter(centroid)
  verdictLetter = centroidToLetter(centroid)
  predictSeq = ""
  dvCmd.setUint8(1, 4) // GameMode.TRACK_BALL
  ws.send(new Uint8Array(cmdBuf))
}

// simple countdown timer
function startTimer() {
  clearData()
  duration = 18 // one game = 18 secs
  slideCnt = 0
  timerId = setInterval(function (evt) {
    if(duration <= 0) {
      clearInterval(timerId)
      document.querySelector(".countdownTimer").innerHTML = "FERDIG!"
    } else {
      document.querySelector(".countdownTimer").innerHTML = "00:" + duration.toString().padStart(2, "0")
      dvCmd.setUint8(1, 3) // GameMode.SNAP
      ws.send(new Uint8Array(cmdBuf))
    }
    duration -= 1
    slideCnt += 1
  }, 1000)
}

// button actions
document.getElementById("startBtn").addEventListener("click", startTimer)
document.getElementById("predictBtn").addEventListener("click", function(evt) {
  console.log("PREDICT")
  dvCmd.setUint8(1, 7) // GameMode.PREDICT
  ws.send(new Uint8Array(cmdBuf))
})

document.getElementById("verdictBtn").addEventListener("click", function(evt) {
  console.log("VERDICT")
  dvCmd.setUint8(1, 8) // GameMode.VERDICT
  ws.send(new Uint8Array(cmdBuf))
})
// WEB Bluetooth API
/*
Instead, they provide only one characteristic that emulates a serial port, and everything you write down there, module will send to your controller via TX,
and everything you send from the controller to the module RX, it will send to the connected device. BTW, with a limit of 20 bytes, inherent in any BLE characteristic, by the way.
*/
/*const sendCentBtn = document.getElementById("sendCentBtn")
document.getElementById("sendCentBtn").addEventListener("click", async function(evt) {
  const div = document.querySelector(".centroid")
  const xy = div.innerText.split(",")
  const x = parseInt(xy[0], 10)
  const y = parseInt(xy[1], 10)
  writeToEyes(x, y)
})*/

let btDevice
let btCharacteristic // the btle char device to send centroids to
document.getElementById("eyesBtn").addEventListener("click", async function(evt) {
  //Device A4:06:E9:8E:00:0A HMSoft
  // HMSoft uU8ptu87vOOkd/NIwmqtDg== false
  await connectToEyes()
})

// transpond x, y (640,640) to u8 (255,255)
async function writeToEyes(x, y) {
    const x1 = Math.round(x / 640 * 255)
    //const x1 = Math.round(Math.abs((640 - x) / 640 * 255)) // invert x-axis
    const y1  =Math.round(Math.abs((640 - y) / 640 * 50)) // invert and compress y-axis
    const cmd = new Uint8Array([ 0, 2, x1, y1 ])
    await btCharacteristic.writeValueWithoutResponse(cmd);
    //console.log(`in: (${x}, ${y}) -- written (${x1}, ${y1})`)
}
async function connectToEyes() {
  const serviceUUID = 0xffe0;
  const serialUUID = 0xffe1 //       0000ffe1-0000-1000-8000-00805f9b34fb
  const characteristicUUID = 0xffe1

  try {
    console.log("Requesting Bluetooth Device...")
    //var ble = await navigator.bluetooth.getAvailability()
    const btDevice = await navigator.bluetooth.requestDevice({
      //acceptAllDevices: true,
      filters: [{ services: [serviceUUID] }], // fake service to send raw data as serial
      //filters: [{ name: "HMSoft" }],

    })
    console.log(btDevice, btDevice.name, btDevice.id, btDevice.gatt.connected)

    // BTLE
    const server = await btDevice.gatt.connect()
    const service = await server.getPrimaryService(serviceUUID) // fake service to send data TO
    //const characteristicUuid = 0xffe1                      // fake characteristics/type for notify and read

    let characteristics = await service.getCharacteristics()
    console.log(`Characteristics: ${characteristics.map(c => c.uuid).join('\n' + ' '.repeat(19))}`)
    btCharacteristic = await service.getCharacteristic(serialUUID) //19b10001-e8f2-537e-4f6c-d104768a1214

    // No notifications
    //const notifications = await btCharacteristic.startNotifications()
    //await btCharacteristic.writeValueWithoutResponse(new Uint8Array([ 200, 200  ]))
    //console.log("written!")

  } catch(error)  {
    console.log("Argh! " + error)
  }
}