const mqtt = require("mqtt");
const client = mqtt.connect("mqtt:192.168.1.12");

let root_topic = "/ewasp";

client.on("connect", () => {
    client.subscribe(`${root_topic}/data`, (err) => {
        if (err) {
            console.log("Error subcribing to topic : ", err);
        } else {
            console.log("Subscribed to topic : ")
        }
    });
});

// client.on()
client.on("message", function (topic, message) {
    console.log(
      "Received message on topic:",
      topic,
      " - Message:",
      message.toString()
    );
    const data = JSON.parse(message.toString());
  });
  
  module.exports = client;