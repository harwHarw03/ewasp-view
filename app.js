const express = require("express");
const app = express();
const mqttClient = require("./lib/mqtt");

app.use(express.static("public"));

app.get("/messages", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");

  const sendMQTTMessage = (message) => {
    res.write(`data: ${message}\n\n`);
  };

  mqttClient.on("message", (topic, message) => {
    sendMQTTMessage(message.toString());
  });

  sendMQTTMessage("SSE connection established");

  req.on("close", () => {
    mqttClient.removeListener("message", sendMQTTMessage);
  });
});

const server = app.listen(3000, () => {
  console.log("Express server listening on port 3000");
});
