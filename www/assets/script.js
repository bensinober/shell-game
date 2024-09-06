///////////////////////
// SHELL GAME JAVASCRIPT
// Game Globals
///////////////////////

const GameModes = ["IDLE","START","STOP","SNAP","TRACK_BALL","TRACK_HIDDEN","TRACK_IDLE","PREDICT","VERDICT"]
var eyesActive = false
var gameMode = GameModes[0]
var imgPos = [-150, 0] // don't know why we need to start negative offset, but hey, javascript
var centroid = {x: 320, y: 240}
var machineScore = 0
var humanScore = 0
var predictLetter = ""
var verdictLetter = ""
var predictSeq = ""
var timerId
var duration
var slideCnt = 0
var uuid
const cmdBuf = new ArrayBuffer(6)
const dvCmd = new DataView(cmdBuf)
dvCmd.setUint8(0, 1) // command
dvCmd.setInt32(2, 0, true) // command length 0, little endian

///////////////////////////////////
// INPUT FROM SHELL GAME BUTTON BOX
///////////////////////////////////

var buttonBoxWriter
const startBtn = 115
const gameABtn = 97
const gameBBtn = 98
const gameCBtn = 99
if ("serial" in navigator) {
  navigator.serial.addEventListener("connect", async (event) => {
    const port = event.target
    console.log("connected port")
    await port.open({ baudRate: 9600 })
    buttonBoxWriter = port.writable.getWriter()
    resetGame()
  })

  navigator.serial.addEventListener("disconnect", async (event) => {
    const port = event.target
    console.log("disconnected serialport")
  })
}

document.getElementById("connectBtn").addEventListener("click", async(evt) => {
  // connect to shell game box
  if ("serial" in navigator) {
    try {
      const filters = [{ usbVendorId: 0x16c0, usbProductId: 0x0487 }]
      const port = await navigator.serial.requestPort({ filters })
      await port.open({ baudRate: 9600 })
      buttonBoxWriter = port.writable.getWriter()
      resetGame()
    } catch(err) {
      console.log(err)
    }
  } else {
    console.log("you need to activate web serial in browser!")
  }
  // connect to eyes
  if ("bluetooth" in navigator) {
    try {
      //Device A4:06:E9:8E:00:0A HMSoft
      // HMSoft uU8ptu87vOOkd/NIwmqtDg== false
      //console.log("here")
      await connectToEyes()
    } catch(err) {
      console.log(err)
    }
  } else {
    console.log("you need to activate web bluetooth api in browser!")
  }
})

document.addEventListener("keypress", (event) => {
  event.preventDefault()
  switch (event.key) {
    case "s":
      if (gameMode === GameModes[0] || gameMode === GameModes[4] || gameMode === GameModes[5] || gameMode === GameModes[6]) {
        document.getElementById("startBtn").click()
        buttonLedOff(startBtn) // s
      } else if (gameMode === GameModes[2]) { // GameMode.STOP
        if (predictLetter === "") {
          document.getElementById("predictBtn").click()
        } else if (verdictLetter === "") {
          document.getElementById("verdictBtn").click()
        } else {
          resetGame()
        }
        buttonLedToggle(startBtn) // s
      } else if (gameMode === GameModes[7]) { // GameMode.PREDICT
        document.getElementById("verdictBtn").click()
        buttonLedToggle(startBtn) // s
      }
      break
    case "a","b","c":
      if (gameMode === GameModes[8]) { // GameMode.VERDICT - override verdict
        verdictLetter = centroidToLetter(centroid)
        document.getElementById("verdictBtn").click()
        resetButtonBox()
        buttonLedToggle(event.key.charCodeAt(0))
        setTimeout(() => {
          resetGame()
        }, 5000)
      }
      break
    default:
      console.log("NOOP")
  }
})

// toggle key led
async function buttonLedToggle(key) {
  console.log("LED TOGGLE", key)
  if (buttonBoxWriter) {
    const data = new Uint8Array([key])
    await buttonBoxWriter.write(data)
    //buttonBoxWriter.releaseLock()
  }
}

// (key - 10) => led off
async function buttonLedOff(key) {
  console.log("LED OFF", key)
  if (buttonBoxWriter) {
    const data = new Uint8Array([key - 10])
    await buttonBoxWriter.write(data)
    //buttonBoxWriter.releaseLock()
  }
}

// (key + 10) => led on
async function buttonLedOn(key) {
  console.log("LED ON", key)
  if (buttonBoxWriter) {
    const data = new Uint8Array([key + 10])
    await buttonBoxWriter.write(data)
    //buttonBoxWriter.releaseLock()
  }
}

function resetButtonBox() {
  console.log("RESET BUTTON BOX")
  if (buttonBoxWriter) {
    for (const b of [gameABtn, gameBBtn, gameCBtn]) {
      buttonLedOff(b)
    }
    buttonLedOn(startBtn)
  }
}

function resetGame() {
  resetButtonBox()
  dvCmd.setUint8(1, 0) // GameMode.IDLE
  ws.send(new Uint8Array(cmdBuf))
}

////////////////////////
// INPUT FROM WEBSOCKETS
////////////////////////

function centroidToLetter(centroid) {
  if (centroid.x < 220) {
    return "a"
  } else if (centroid.x > 421) {
    return "c"
  } else {
    return "b"
  }
}

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
    // update gameSeq
    predictSeq += centroidToLetter(centroid)
    var blob = new Blob([data], {type: "image/png"})
    var img = new Image()
    img.onload = function (e) {
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
    let formData = new FormData()
    formData.append("uuid", uuid)
    formData.append("num", slideCnt)
    formData.append("image", blob, "snap.png")
    fetch("/api/snapimg", { method: "POST", body: formData })
    break
  case 4:
    console.log("dunno")
    break
  case 7:
    // TODO: send to web service here for prediction?
    predictLetter = centroidToLetter(centroid)
    var blob = new Blob([data], {type: "image/png"})
    var img = new Image()
    img.onload = function (e) {
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
    if (buttonBoxWriter) {
      resetButtonBox()
      buttonLedOn(predictLetter.charCodeAt(0))
    }
    break
  case 8:
    verdictLetter = centroidToLetter(centroid)
    var blob = new Blob([data], {type: "image/png"})
    var img = new Image()
    img.onload = function (e) {
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
    if (buttonBoxWriter) {
      resetButtonBox()
      buttonLedOn(verdictLetter.charCodeAt(0))
    }
    showResults()
    break
  case 9:
    const slideCanvas = document.getElementById("slideBox")
    const predictCanvas = document.getElementById("predictBox")
    addScore()
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

function genUUID() {
  return Math.random().toString(36).slice(-10)
}

function clearData() {
  const slideCanvas = document.getElementById("slideBox")
  const predictCanvas = document.getElementById("predictBox")
  const ctxSlides = slideCanvas.getContext("2d")
  const ctxTrace = predictCanvas.getContext("2d")
  ctxSlides.clearRect(0, 0, slideCanvas.width, slideCanvas.height)
  ctxTrace.clearRect(0, 0, predictCanvas.width, predictCanvas.height)
  imgPos = [-150, 0] // don't know why we need to start negative offset, but hey, javascript
  centroid = {x: 320, y: 240}
  predictLetter = ""
  verdictLetter = ""
  predictSeq = ""
  uuid = genUUID()
  dvCmd.setUint8(1, 4) // GameMode.TRACK_BALL
  ws.send(new Uint8Array(cmdBuf))
}

function showResults() {
  if (predictLetter === verdictLetter) {
    // SUCCESS
    document.getElementById("overlayImg").src = "/assets/robot-success.png"
    popUpOverlay("hurra!")
  } else {
    // FAILURE
    document.getElementById("overlayImg").src = "/assets/robot-failure.jpg"
    popUpOverlay("fillern!")
  }
}

function showOverlay(text) {
  const overlay = document.getElementById("fullscreenOverlay")
  const img = document.getElementById("overlayImg")
  document.getElementById("overlayText").innerHTML = text
  if (img.src === "") {
    img.classList.add("hidden")
  } else {
    img.classList.remove("hidden")
  }
  overlay.classList.remove("hidden")
  overlay.style.opacity = 1
}

function hideOverlay() {
  const overlay = document.getElementById("fullscreenOverlay")
  overlay.classList.add("hidden")
  overlay.style.opacity = 0
  document.getElementById("overlayImg").src = ""
  document.getElementById("overlayText").innerHTML =""
}

function popUpOverlay(text) {
    showOverlay(text)
    setTimeout(() => {
      hideOverlay()
    }, 3000)
}

/////////////////////////
// BUTTON EVENT LISTENERS
/////////////////////////

// simple countdown timer
document.getElementById("startBtn").addEventListener("click", function(evt) {
  document.getElementById("startBtn").classList.remove("open")
  showOverlay("snurr i vei!")
  clearData()
  duration = 18 // one game = 18 secs
  slideCnt = 0
  timerId = setInterval(function (evt) {
    if(duration <= 0) {
      // FINISHED
      clearInterval(timerId)
      document.querySelector(".countdownTimer").innerHTML = "FERDIG!"
      setTimeout(() => {
        document.querySelector(".countdownTimer").innerHTML = ""
      }, 1000)
      dvCmd.setUint8(1, 2) // GameMode.STOP
      ws.send(new Uint8Array(cmdBuf))
      buttonLedOn(startBtn)
      document.getElementById("predictBtn").classList.add("open")
      hideOverlay()
    } else {
      document.querySelector(".countdownTimer").innerHTML = "00:" + duration.toString().padStart(2, "0")
      dvCmd.setUint8(1, 3) // GameMode.SNAP
      ws.send(new Uint8Array(cmdBuf))
      if (duration < 4) {
        let mySound = new Audio("assets/beep-09.wav")
        mySound.play()
      }
    }
    duration -= 1
    slideCnt += 1
  }, 1000)
})

//document.getElementById("eyesBtn").addEventListener("click", function(evt) {
//  console.log("EYES")
//  popUpOverlay("my eyes see you!")
//})
document.getElementById("predictBtn").addEventListener("click", function(evt) {
  console.log("PREDICT")
  dvCmd.setUint8(1, 7) // GameMode.PREDICT
  ws.send(new Uint8Array(cmdBuf))
  document.getElementById("predictBtn").classList.remove("open")
  document.getElementById("verdictBtn").classList.add("open")
})

document.getElementById("verdictBtn").addEventListener("click", function(evt) {
  console.log("VERDICT")
  dvCmd.setUint8(1, 8) // GameMode.VERDICT
  ws.send(new Uint8Array(cmdBuf))
  document.getElementById("verdictBtn").classList.remove("open")
  document.getElementById("startBtn").classList.add("open")
})

////////////////////
// WEB Bluetooth API
// emulates a serial port
////////////////////

/*
const sendCentBtn = document.getElementById("sendCentBtn")
document.getElementById("sendCentBtn").addEventListener("click", async function(evt) {
  const div = document.querySelector(".centroid")
  const xy = div.innerText.split(",")
  const x = parseInt(xy[0], 10)
  const y = parseInt(xy[1], 10)
  writeToEyes(x, y)
})
*/

var btDevice
var btCharacteristic // the btle char device to send centroids to

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
    //console.log(btDevice, btDevice.name, btDevice.id, btDevice.gatt.connected)

    // BTLE
    const server = await btDevice.gatt.connect()
    const service = await server.getPrimaryService(serviceUUID) // fake service to send data TO
    //const characteristicUuid = 0xffe1                      // fake characteristics/type for notify and read

    let characteristics = await service.getCharacteristics()
    //console.log(`Characteristics: ${characteristics.map(c => c.uuid).join('\n' + ' '.repeat(19))}`)
    btCharacteristic = await service.getCharacteristic(serialUUID) //19b10001-e8f2-537e-4f6c-d104768a1214

    // now activate eyes
    eyesActive = true
    // No notifications
    //const notifications = await btCharacteristic.startNotifications()
    //await btCharacteristic.writeValueWithoutResponse(new Uint8Array([ 200, 200  ]))
    //console.log("written!")

  } catch(error)  {
    console.log("bluetooth connect failure: " + error)
  }
}

function addScore() {
  if (predictLetter === verdictLetter) {
    machineScore += 1
    document.getElementById("machineScore").innerHTML = machineScore
  } else {
    humanScore += 1
    document.getElementById("humanScore").innerHTML = humanScore
  }
}

function calculateScores(data) {
  for (let [time,uuid,boxx,boxy,boxw,boxh,centx,centy,score,seq,pred,verd] of [...data]) {
    if (pred === verd) {
      machineScore += 1
    } else {
      humanScore += 1
    }
  }
  document.getElementById("machineScore").innerHTML = machineScore
  document.getElementById("humanScore").innerHTML = humanScore
}

async function fetchStats() {
  try {
    const res = await fetch("/api/getstats")
    const json = await res.json()
    calculateScores(json)
  } catch(err) {
    console.log("error on loading results", err)
  }
}

window.addEventListener("load", (event) => {
    console.log("page loaded - fetch results")
    fetchStats()
})