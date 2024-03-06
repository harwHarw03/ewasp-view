const mqtt = require("mqtt");

const client = mqtt.connect("mqtt://192.168.1.12");

function generateRandomData() {
    return {
        roll: (Math.random() * 360).toFixed(2),
        pitch: (Math.random() * 360).toFixed(2),
        yaw: (Math.random() * 180).toFixed(2),
        altitude: (Math.random() * 10).toFixed(1),
    };
}

let isArmed = false;

function toggleArming() {
    isArmed = !isArmed;
    client.publish('/ewasp/gcs', JSON.stringify({ arming: isArmed }));
}

client.on("connect", () => {
    console.log("Connected to MQTT broker");

    client.subscribe("/ewasp/gcs", (err) => {
        if (err) {
            console.log("Error subscribing to topic:", "/ewasp/gcs", err);
        } else {
            console.log("Subscribed to topic:", "/ewasp/gcs");
        }
    });

    setInterval(() => {
        const data = generateRandomData();
        client.publish('/ewasp/data', JSON.stringify(data));
        console.log("Sent: " + JSON.stringify(data));
    }, 1000);
});

client.on("message", (topic, message) => {
    console.log("Received message on topic:", topic, " - Message:", message.toString());

    if (topic === "/ewasp/gcs") {
        const data = JSON.parse(message.toString());
        if (data.arming !== undefined) {
            isArmed = data.arming;
            console.log("Arming status:", isArmed ? "Armed" : "Disarmed");
        }
    }
});
