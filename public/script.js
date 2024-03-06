const sensorDataElement = document.getElementById("sensor-data");
const evtSource = new EventSource("/messages");
let dataMap = {};

const webcamElement = document.getElementById("webcam");
const cameraSelect = document.getElementById("camera-select");

const armingToggle = document.getElementById("arming-toggle");
const armingStatusElement = document.getElementById("arming-status");

let isArmed = false;

function toggleArming() {
    isArmed = !isArmed; // Toggle the arming state
    armingStatusElement.textContent = isArmed ? "Armed" : "Disarmed";
    updateTable();
}

armingToggle.addEventListener("click", toggleArming);

evtSource.onmessage = function (event) {
    const data = JSON.parse(event.data);
    Object.assign(dataMap, data);

    if (data.arming !== undefined) {
        isArmed = data.arming;
        armingStatusElement.textContent = isArmed ? "Armed" : "Disarmed";
        // Update the table with the arming status
        updateTable();
    }

    updateTable();
};

function updateTable() {
    sensorDataElement.innerHTML = "";

    for (const key in dataMap) {
        if (dataMap.hasOwnProperty(key)) {
            const newRow = `<tr><td>${key}</td><td>${dataMap[key]}</td></tr>`;
            sensorDataElement.innerHTML += newRow;
        }
    }
    const armingRow = `<tr><td>Arming Status</td><td>${isArmed ? "Armed" : "Disarmed"}</td></tr>`;
    sensorDataElement.innerHTML += armingRow;
}

async function switchCamera(deviceId) {
    try {
        if (typeof webcamElement.srcObject !== 'undefined') {
            webcamElement.srcObject = null;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: { exact: deviceId } }
        });

        webcamElement.srcObject = stream;
    } catch (error) {
        console.error('Error accessing webcam:', error);
    }
}

async function populateCameraDropdown() {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        devices.forEach(device => {
            if (device.kind === 'videoinput') {
                const option = document.createElement('option');
                option.text = device.label || `Camera ${cameraSelect.options.length + 1}`;
                option.value = device.deviceId;
                cameraSelect.appendChild(option);
            }
        });
    } catch (error) {
        console.error('Error enumerating devices:', error);
    }
}

cameraSelect.addEventListener('change', event => {
    const selectedDeviceId = event.target.value;
    switchCamera(selectedDeviceId);
});

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
            webcamElement.srcObject = stream;
        })
        .catch(function (error) {
            console.error('Error accessing webcam:', error);
        });

    populateCameraDropdown();
} else {
    console.error('getUserMedia is not supported in this browser');
}

armingToggle.addEventListener('change', event => {
    const isArmed = event.target.checked;
    publishArmingStatus(isArmed);
});

function publishArmingStatus(isArmed) {
    const message = JSON.stringify({ arming: isArmed });
    
    console.log('Publishing arming status:', message);

    client.publish('/ewasp/gcs', message, (err) => {
        if (err) {
            console.error('Error publishing arming status:', err);
        } else {
            console.log('Published arming status:', message);
        }
    });
}