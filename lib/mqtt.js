const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://192.168.100.199");

let root_topic = "/ewasp";

client.on("connect", () => {
    console.log("Connected to MQTT broker");
    client.subscribe(`${root_topic}/data`, (err) => {
        if (err) {
            console.log("Error subscribing to topic:", `${root_topic}/data`, err);
        } else {
            console.log("Subscribed to topic:", `${root_topic}/data`);
        }
    });
    
    // subs to topic '/ewasp/gcs' to receive arm status
    client.subscribe(`${root_topic}/gcs`, (err) => {
        if (err) {
            console.log("Error subscribing to topic:", `${root_topic}/gcs`, err);
        } else {
            console.log("Subscribed to topic:", `${root_topic}/gcs`);
        }
    });
});

module.exports = client;
