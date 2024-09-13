const express = require('express');
const app = express();
const PORT = 3000;

// Your existing code...

const clients = new Map();
const HEARTBEAT_TIMEOUT = 15000; // 15 seconds timeout for the heartbeat

app.use(express.static('.')); // Serve static files from the current directory
app.use(express.json());

app.post('/heartbeat', (req, res) => {
    const clientId = req.ip; // Using client's IP as an identifier
    console.log(`Received heartbeat from ${clientId} at ${new Date().toISOString()}`);
    clients.set(clientId, Date.now());
    res.sendStatus(200);
});

function monitorHeartbeats() {
    const now = Date.now();
    clients.forEach((lastHeartbeat, clientId) => {
        if (now - lastHeartbeat > HEARTBEAT_TIMEOUT) {
            console.log(`Client ${clientId} missed a heartbeat. Last received at ${new Date(lastHeartbeat).toISOString()}`);
            clients.delete(clientId);
        }
    });
}

setInterval(monitorHeartbeats, 5000);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
