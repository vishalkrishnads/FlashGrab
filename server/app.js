require('dotenv').config()
const express = require('express');
const ws = require('ws');
const { Builder } = require('selenium-webdriver');
const app = express();
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const Purchaser = require('./purchaser')

  (async () => {
    if (isMainThread) {
      const wsServer = new ws.Server({ noServer: true });
      wsServer.on('connection', socket => {
        var worker
        socket.on('message', async (message) => {
          var data = JSON.parse(message)
          if (!data.intermediate) {
            worker = new Worker(__filename, { workerData: { data: data } })
          } else {
            worker.postMessage(data.intermediate)
          }
          worker.on("message", incoming => socket.send(incoming.message))
          worker.on('exit', () => {
            try { socket.close() } catch { }
          })
          socket.on('close', () => {
            worker.postMessage('quit')
          })
        })
      });

      const server = app.listen(3000);
      server.on('upgrade', (request, socket, head) => {
        wsServer.handleUpgrade(request, socket, head, socket => {
          wsServer.emit('connection', socket, request);
        });
      });
    }

    //Worker Thread
    else {
      var driver = await new Builder().forBrowser('chrome').build()
      var purchaser = new Purchaser(driver, workerData.data, parentPort)
      // await purchaser.purchaser()
      parentPort.on("message", async (message) => {
        if (message === 'quit') {
          try {
            await driver.quit()
            parentPort.close()
          } catch { }
        }
        else { purchaser.intermediate(message) }
      });
      try {
        await purchaser.purchaser()
      } catch (error) {
        if (error === "Abort") {
          parentPort.postMessage({ "message": `Aborting purchase` })
          await driver.quit()
          parentPort.close()
        }
      }
    }

  })();