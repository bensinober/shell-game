// gameButtonBox.js
import { resetGame } from "./script.js"

///////////////////////////////////
// INPUT FROM SHELL GAME BUTTON BOX
///////////////////////////////////

var buttonBoxWriter
const startBtn = 115
const gameABtn = 97
const gameBBtn = 98
const gameCBtn = 99

// connect to shell game button box
async function connecToButtonBox(evt) {
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
}

// toggle key led
async function buttonLedToggle(key) {
  //console.log("LED TOGGLE", key)
  if (buttonBoxWriter) {
    const data = new Uint8Array([key])
    await buttonBoxWriter.write(data)
    //buttonBoxWriter.releaseLock()
  }
}

// (key - 10) => led off
async function buttonLedOff(key) {
  //console.log("LED OFF", key)
  if (buttonBoxWriter) {
    const data = new Uint8Array([key - 10])
    await buttonBoxWriter.write(data)
    //buttonBoxWriter.releaseLock()
  }
}

// (key + 10) => led on
async function buttonLedOn(key) {
  //console.log("LED ON", key)
  if (buttonBoxWriter) {
    const data = new Uint8Array([key + 10])
    await buttonBoxWriter.write(data)
    //buttonBoxWriter.releaseLock()
  }
}

function resetButtonBox() {
  //console.log("RESET BUTTON BOX")
  if (buttonBoxWriter) {
    for (const b of [gameABtn, gameBBtn, gameCBtn]) {
      buttonLedOff(b)
    }
    buttonLedOn(startBtn)
  }
}

export { buttonBoxWriter, connecToButtonBox, buttonLedToggle, resetButtonBox, buttonLedOn, buttonLedOff }