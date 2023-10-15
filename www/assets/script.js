/* shell game javascript */

const GameModes = ["IDLE","START","STOP","SNAP","TRACK_BALL","TRACK_HIDDEN","TRACK_IDLE","PREDICT","VERDICT"]
var gameMode = GameModes[0]
var imgPos = [-150, 0] // don't know why we need to start negative offset, but hey, javascript

// websockets
const wsCmd = new WebSocket("ws://localhost:8665/ws?channels=commands")
const wsCent = new WebSocket("ws://localhost:8665/ws?channels=centroids")
const wsImg = new WebSocket("ws://localhost:8665/ws?channels=images")
wsCmd.addEventListener("message", event => {
  console.log(event.data)
  const { data } = event
  const cmd = data.getUint8(0)
  const mode = data.getUint8(1)
  gameMode = GameModes[parseInt(mode, 10)]
  document.getElementById("gameMode").innerTEXT = gameMode
})
//wsCent.addEventListener("open", event => wsCent.binaryType = "arraybuffer")
wsCent.addEventListener("message", event => {
  if (event.data.byteLength === 8) {
    const [x, y] = new Int32Array(event.data)
    console.log(event.data)
    const div = document.querySelector(".centroid")
    div.innerHTML = `${x},${y}`
    writeToEyes(x, y)
  }
})
wsImg.addEventListener("message", event => {
  console.log("image", gameMode)
  const slideCanvas = document.getElementById("slideBox")
  const traceCanvas = document.getElementById("traceBox")
  const ctxSlides = slideCanvas.getContext("2d")
  const ctxTrace = traceCanvas.getContext("2d")
  var blob = new Blob([event.data], {type: "image/png"})
  var img = new Image()
  img.onload = function (e) {
    console.log("PNG Loaded")
    ctxSlides.drawImage(img, imgPos[0], imgPos[1], 150, 150)
    if (gameMode = GameModes[7]) {
      ctxTrace.drawImage(img, 450, 450, 450, 450)
    } else {
      ctxTrace.drawImage(img, 0, 0, 450, 450)
    }
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
})


// simple countdown timer
// one game = 18 secs
var timerId
var duration
var slideCnt = 0
const cmdBuf = new ArrayBuffer(6)
const dvCmd = new DataView(cmdBuf)
dvCmd.setUint8(0, 1) // command
dvCmd.setInt32(2, 0, true) // command length 0, little endian

function startTimer() {
  dvCmd.setUint8(1, 6) // GameMode.TRACK_IDLE
  wsCmd.send(new Uint8Array(cmdBuf))
  duration = 18
  slideCnt = 0

  timerId = setInterval(function (evt) {
    if(duration <= 0) {
      clearInterval(timerId)
      document.querySelector(".countdownTimer").innerHTML = "FERDIG!"
    } else {
      document.querySelector(".countdownTimer").innerHTML = "00:" + duration.toString().padStart(2, "0")
      dvCmd.setUint8(1, 3) // GameMode.SNAP
      wsCmd.send(new Uint8Array(cmdBuf))
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
  wsCmd.send(new Uint8Array(cmdBuf))
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
    const x1 = Math.round(Math.abs((640 - x) / 640 * 255)) // invert x-axis
    const y1  =Math.round(Math.abs((640 - y) / 640 * 50)) // invert and compress y-axis
    //const y1 = Math.round(y / 640 * 255)
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