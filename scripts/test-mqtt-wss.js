// Verifies a wss:// MQTT websocket endpoint is reachable with a valid TLS
// certificate, using the same mqtt.js client the browser build relies on.
const mqtt = require('mqtt');

const url = process.argv[2] || 'wss://mqtt.biztechro.com/ws';

const options = { connectTimeout: 8000, rejectUnauthorized: true };
if (process.env.MQTT_USERNAME) options.username = process.env.MQTT_USERNAME;
if (process.env.MQTT_PASSWORD) options.password = process.env.MQTT_PASSWORD;

console.log(`Connecting to ${url} ...`);
const client = mqtt.connect(url, options);

const timer = setTimeout(() => {
  console.error('FAILED: timed out waiting for CONNACK.');
  client.end(true);
  process.exit(1);
}, 10000);

client.on('connect', () => {
  clearTimeout(timer);
  console.log('SUCCESS: TLS handshake ok and broker accepted the connection.');
  client.end(true, {}, () => process.exit(0));
});

client.on('error', (err) => {
  clearTimeout(timer);
  console.error('FAILED:', err.message);
  client.end(true);
  process.exit(1);
});
