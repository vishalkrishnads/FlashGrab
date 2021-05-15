require('dotenv').config()
const express = require('express');
const ws = require('ws');
const { Builder } = require('selenium-webdriver');
const app = express();
const Purchaser = require('./purchaser')

/*
Here, we initialise a simple ws server with Express as middleware.
So naturally, express will initiate a new webdriver session for each new incoming connection.
But, there's a problem. One CPU thread can't handle multiple webdriver sessions at the same time.
Hence, this creates a bug where more than one clients can't connect at the same time.
Next commit hopes to solve it.
*/

const wsServer = new ws.Server({ noServer: true });
wsServer.on('connection', socket => {
  var driver
  socket.on('message', async (message) => {
    var data = JSON.parse(message)
    if (!data.intermediate) {
      driver = await new Builder().forBrowser('chrome').build()
      purchaser = new Purchaser(driver, data, socket)
      // await purchaser.purchaser()
      try {
        await purchaser.purchaser()
      } catch (error) {
        if (error === "Abort") {
          socket.send(`Aborting purchase`)
          socket.close()
        }
      }
    } else {
      await purchaser.intermediate(data.intermediate)
      socket.close()
    }
  })
  socket.on('close', async() => { await driver.quit() })
});

const server = app.listen(3000);
server.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, socket => {
    wsServer.emit('connection', socket, request);
  });
});