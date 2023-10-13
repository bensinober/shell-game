/* shell game javascript */
var imgPos = [-150, 0] // don't know why we need to start negative offset, but hey, javascript
var imgCount = 0

// websockets
const wsCmd = new WebSocket("ws://localhost:8665/ws?channels=commands")
const wsCent = new WebSocket("ws://localhost:8665/ws?channels=centroids")
const wsImg = new WebSocket("ws://localhost:8665/ws?channels=images")
wsCent.addEventListener("open", event => wsCent.binaryType = "arraybuffer")
wsCent.addEventListener("message", event => {
  if (event.data.byteLength === 8) {
    const [x, y] = new Int32Array(event.data)
    const div = document.querySelector(".centroid")
    div.innerHTML = `(${x}, ${y})`
  }
})
wsImg.addEventListener("message", event => {
  console.log("image")
  const snapCanvas = document.getElementById("snapBox")
  const imgCanvas = document.getElementById("imageBox")
  const ctxSnap = snapCanvas.getContext("2d")
  const ctxImg = imgCanvas.getContext("2d")
  var blob = new Blob([event.data], {type: "image/png"})
  var img = new Image()
  img.onload = function (e) {
    console.log("PNG Loaded")
    ctxSnap.drawImage(img, imgPos[0], imgPos[1], 150, 150)
    ctxImg.drawImage(img, 0, 0, 640, 450)
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
var imgCnt
const buf = new ArrayBuffer(6)
const dv = new DataView(buf)

function startTimer() {
  dv.setUint8(0, 1) // command
  dv.setUint8(1, 3) // GameMode.SNAP
  dv.setInt32(2, 0, true) // command length, little endian
  const sendCmd = new Uint8Array(buf)
  duration = 18
  imgCnt = 17 // we save the last for after prediction

  timerId = setInterval(function (evt) {
    if(duration <= 0) {
      clearInterval(timerId)
      document.querySelector(".countdownTimer").innerHTML = "FERDIG!"
    } else {
      document.querySelector(".countdownTimer").innerHTML = "00:" + duration.toString().padStart(2, "0")
      if (imgCnt > 0) {
        wsCmd.send(sendCmd)
      }
    }
    duration -= 1
    imgCnt -= 1
  }, 1000)
}

// button actions
document.getElementById("startBtn").addEventListener("click", startTimer)
document.getElementById("predictBtn").addEventListener("click", function(evt) {
  console.log("PREDICT")
  dv.setUint8(0, 1) // command
  dv.setUint8(1, 7) // GameMode.PREDICT
  dv.setInt32(2, 0, true) // command length, little endian
  const sendCmd = new Uint8Array(buf)
  wsCmd.send(sendCmd)
})
