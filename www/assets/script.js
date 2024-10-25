///////////////////////
// SHELL GAME JAVASCRIPT
// Game Globals
// Game mode is held in browser
// Game Sequence :
// 0: idle
// 1: spin
// 2: guess
// 3: tell
///////////////////////
import { connectToEyes, writeToEyes, eyesConnected } from "./eyes.js"
import { buttonBoxWriter, connecToButtonBox, buttonLedToggle, resetButtonBox, buttonLedOn, buttonLedOff, startBtnCode } from "./gameButtonBox.js"

const GameModes = ["IDLE","START","STOP","SNAP","TRACK_BALL","TRACK_HIDDEN","TRACK_IDLE","PREDICT","VERDICT", "STATS"]
const GameStates = ["IDLE","SPIN","GUESS","TELL", "KNOW"]
var gameMode = GameModes[0]
var prevMode = GameModes[0]
var imgPos = [-150, 0] // don't know why we need to start negative offset, but hey, javascript
var centroid = {x: 320, y: 240}
var machineScore = 0
var humanScore = 0
var predictLetter = ""
var verdictLetter = ""
var predictSeq = ""
var gameState = 0
var timerId
var duration
var slideCnt = 0
var uuid
const cmdBuf = new ArrayBuffer(6)
const dvCmd = new DataView(cmdBuf)
const eyesBtn = document.querySelector("#eyesBtn")
const eyePredictionDiv = document.querySelector("#eyePrediction")
const modelPredictionDiv = document.querySelector("#modelPrediction")
var eyesActive = false

//dvCmd.setUint8(0, 1) // command
//dvCmd.setInt32(2, 0, true) // command length 0, little endian

// Websocket client
const ws = new WebSocket(`wss://${window.location.host}/ws?channels=shell-game`)
ws.binaryType = "arraybuffer"
ws.addEventListener("message", wsMessageHandler)

const startBtn = document.getElementById("startBtn")

// Keypress either by keyboard or by serial connected shell game box using HID
document.addEventListener("keypress", keypressFunc)

function keypressFunc(evt) {
  evt.preventDefault()
  console.log(evt)
  switch (evt.key) {
    case "s":
      if (gameState === 0) {
        document.getElementById("startBtn").click()
        buttonLedOff(startBtnCode)
      } else if (gameState === 1) {
        document.getElementById("predictBtn").click()
      } else if (gameState === 2) {
        document.getElementById("verdictBtn").click()
      } else if (gameState === 3) {
        sendGameMode(9)
      } else {
        buttonLedToggle(startBtnCode) // s
        resetGame()
      }
      break
    case "a","b","c":
      if (gameMode === GameModes[8]) { // GameMode.VERDICT - override verdict
        verdictLetter = centroidToLetter(centroid)
        document.getElementById("verdictBtn").click()
        resetButtonBox()
        buttonLedToggle(evt.key.charCodeAt(0))
        setTimeout(() => {
          resetGame()
        }, 5000)
      }
      break
    default:
      console.log("NOOP")
  }
}

function startGame() {
  startBtn.classList.remove("down")
  let mySound = new Audio("assets/counter.mp3")
  mySound.play()
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
      sendGameMode(2) // GameMode.STOP
      buttonLedOn(startBtnCode)
      document.getElementById("predictBtn").classList.add("down")
      hideOverlay()
    } else {
      document.querySelector(".countdownTimer").innerHTML = "00:" + duration.toString().padStart(2, "0")
      sendGameMode(3) // GameMode.SNAP
    }
    duration -= 1
    slideCnt += 1
  }, 1000)
}
function resetGame() {
  resetButtonBox()
  dvCmd.setUint8(1, 0) // GameMode.IDLE
  ws.send(new Uint8Array(cmdBuf))
  gameState = 0
  predictLetter = ""
  verdictLetter = ""
  predictSeq = ""
  eyePredictionDiv.innerHTML = ""
  modelPredictionDiv.innerHTML = ""
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

async function wsMessageHandler(evt) {
  /*console.log(`INCOMING: ${evt.data}`)
  if (evt.data === null) { return }
  const buf = new Uint8Array(evt.data).buffer
  console.log(buf.byteLength)
  console.log(buf)
 */
  const dv = new DataView(evt.data)
  const cmd = dv.getUint8(0)
  const mode = dv.getUint8(1)
  const len = dv.getInt32(2, true)
  const data = evt.data.slice(6)
  const slideCanvas = document.getElementById("slideBox")
  const predictCanvas = document.getElementById("predictBox")
  const ctxSlides = slideCanvas.getContext("2d")
  const ctxTrace = predictCanvas.getContext("2d")
  console.log(cmd,GameModes[mode],len, data)
  // Update Game Mode
  prevMode = gameMode
  gameMode = GameModes[parseInt(mode, 10)]
  document.getElementById("gameMode").innerHTML = `${GameStates[gameState].toLowerCase()} - ${gameMode.toLowerCase()}`

  switch (cmd) {
  case 0:
    //console.log(`echo cmd res: ${data}`)
    break
  case 1:
    console.log("game mode change")
    break
  case 2: // centroid received
    const x = dv.getInt32(6, true)
    const y = dv.getInt32(10, true)
    centroid = {x, y}
    const div = document.querySelector(".centroid")
    div.innerHTML = `${x},${y}`
    if (eyesConnected) {
      writeToEyes(x, y)
    }
    break
  case 3: // receive game sequence and snap
    gameState = 1
    predictSeq += centroidToLetter(centroid)
    eyePredictionDiv.innerHTML = predictSeq

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
    console.log("not implemented")
    break
  case 7: // Time up! time for prediction
    gameState = 2
    const res = await fetch(`/api/predictSequence?seq=${predictSeq}`)
    const ltsmPrediction = await res.text()
    predictLetter = centroidToLetter(centroid)
    console.log(`LTSM prediction : ${ltsmPrediction}`)
    console.log(`Camera predictions : ${predictSeq}`)
    eyePredictionDiv.innerHTML = predictSeq
    modelPredictionDiv.innerHTML = ltsmPrediction
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
    gameState = 3
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
    sendGameMode(2)
    showResults()
    break
  case 9:
    gameState = 0
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
}

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
  sendGameMode(4)
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

const sendGameMode = function(mode) {
  dvCmd.setUint8(0, 1) // cmd 1: change GameMode
  dvCmd.setUint8(1, mode)
  dvCmd.setInt32(2, 0, true) // command length 0, little endian
  ws.send(new Uint8Array(cmdBuf))
}

const setSnapContext = function(ctx) {
  ctxSnap = ctx
}

function toggleEyesActive() {
  if (eyesActive === false) {
    dvCmd.setUint8(0, 2) // cmd 2: activate BTLE Eyes
    ws.send(new Uint8Array(cmdBuf))
    eyesBtn.classList.add("down")
    eyesActive = true
  } else {
    dvCmd.setUint8(0, 3) // cmd 3: deactivate BTLE Eyes
    ws.send(new Uint8Array(cmdBuf))
    eyesBtn.classList.remove("down")
    eyesActive = false
  }
}

export { startGame, sendGameMode, clearData, resetGame, setSnapContext, toggleEyesActive, fetchStats, hideOverlay }