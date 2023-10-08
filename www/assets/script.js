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
  const canvas = document.getElementById("imageBox")
  const ctx = canvas.getContext("2d")
  var blob = new Blob([event.data], {type: "image/png"})
  var img = new Image()
  img.onload = function (e) {
    console.log("PNG Loaded")
    ctx.drawImage(img, imgPos[0], imgPos[1], 150, 150)
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

function startTimer() {
  const buf = new ArrayBuffer(10);
  const dv = new DataView(buf, 0, 10)
  dv.setUint8(0, 1) // command
  dv.setUint8(1, 3) // gamemode
  dv.setInt32(2, 4, true) // command length, little endian
  let enc = new TextEncoder()
  let cmd = enc.encode("SNAP")
  const snapCmd = new Uint8Array(buf)
  snapCmd.set(cmd, 6)
  console.log(snapCmd)
  duration = 18
  imgCnt = 17

  timerId = setInterval(function (evt) {
    if(duration <= 0) {
      clearInterval(timerId)
      document.querySelector(".countdownTimer").innerHTML = "FERDIG!"
    } else {
      document.querySelector(".countdownTimer").innerHTML = "00:" + duration.toString().padStart(2, "0")
      if (imgCnt > 0) {
        wsCmd.send(snapCmd)
      }
    }
    duration -= 1
    imgCnt -= 1
  }, 1000)
}

// button actions
document.getElementById("startBtn").addEventListener("click", startTimer)
document.getElementById("snapBtn").addEventListener("click", function(evt) {
  console.log("SNAP")
  wsCmd.send(snapCmd)
})