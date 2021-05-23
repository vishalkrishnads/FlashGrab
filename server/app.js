require('dotenv').config()
const express = require('express');
const ws = require('ws');
const { firefox } = require('playwright');
const app = express();
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const Purchaser = require('./purchaser')
var CryptoJS = require("crypto-js")

async function main() {
  if (isMainThread) {
    const wsServer = new ws.Server({ noServer: true });
    var worker
    wsServer.on('connection', socket => {
      socket.on('message', async (message) => {
        if (message === 'close') {
          try { socket.close() } catch (e) { console.log(e) }
        }
        else {
          try {
            var bytes = CryptoJS.AES.decrypt(message, process.env.KEYS)
            var data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
          } catch {
            socket.send(JSON.stringify({ "message": `Possible security breach detected`, "error": true }))
            socket.close()
          }
          if (!data.intermediate) {
            worker = new Worker(__filename, { workerData: { data: data } })
          } else {
            worker.postMessage(data)
          }
          worker.on("message", incoming => socket.send(JSON.stringify(incoming)))
          worker.on('exit', () => {
            try { socket.close() } catch { }
          })
          socket.on('close', () => {
            try { worker.postMessage('quit') } catch { }
          })
        }
      })
    });

    const server = app.listen(3000);
    server.on('upgrade', (request, socket, head) => {
      wsServer.handleUpgrade(request, socket, head, socket => {
        wsServer.emit('connection', socket, request);
      });
    });
  }

  else {
    var browser = await firefox.launch({ headless: false })
    const page = await browser.newPage();
    var purchaser = new Purchaser(page, workerData.data, parentPort)
    async function quit() {
      await browser.close()
      parentPort.close()
    }
    // await purchaser.purchaser()
    parentPort.on("message", async (message) => {
      if (message === 'quit') {
        try { await quit() } catch { }
      }
      else { 
        await purchaser.intermediate(message)
        await quit()
       }
    });
    try {
      if (await purchaser.purchaser()) { }
      else await quit()
    } catch (error) {
      console.log(error)
      if (error === "Abort") {
        try {
          parentPort.postMessage({ "message": `Aborting purchase`, "error": true })
          await quit()
        } catch { }
      }
    }
  }

}

main()