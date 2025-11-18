const http = require('http');
const { URL } = require('url');

function mapLocationFromSensorID(sensorId) {
  switch (sensorId) {
    case '1':
      return 'Living Room';
    case '2':
      return 'Bedroom';
    case '3':
      return 'Kitchen';
    default:
      return 'Unknown';
  }
}

function mapSensorIDFromLocation(location) {
  switch (location) {
    case 'Living Room':
      return '1';
    case 'Bedroom':
      return '2';
    case 'Kitchen':
      return '3';
    default:
      return '0';
  }
}

function randomTemperature() {
  const v = Math.random() * 40 - 5; // [-5 .. 35)
  return Math.round(v * 10) / 10; // one decimal
}

function buildPayload({ location, sensorId }) {
  return {
    value: randomTemperature(),
    unit: 'C',
    timestamp: new Date().toISOString(),
    location,
    status: 'active',
    sensor_id: sensorId,
    sensor_type: 'temperature',
    description: 'Random reading'
  };
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('OK');
    return;
  }

  if (url.pathname === '/temperature') {
    let location = (url.searchParams.get('location') || '').trim();
    let sensorId = (url.searchParams.get('sensorId') || '').trim();

    // If no location is provided, use a default based on sensor ID
    if (location === '') {
      location = mapLocationFromSensorID(sensorId);
    }
    // If no sensor ID is provided, generate one based on location
    if (sensorId === '') {
      sensorId = mapSensorIDFromLocation(location);
    }

    const payload = buildPayload({ location, sensorId });

    const body = Buffer.from(JSON.stringify(payload));
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': body.length
    });
    res.end(body);
    return;
  }

  // GET /temperature/:sensorId
  if (url.pathname.startsWith('/temperature/')) {
    const parts = url.pathname.split('/');
    const sensorId = (parts[2] || '').trim();
    if (!sensorId) {
      res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('sensorId is required');
      return;
    }
    const location = mapLocationFromSensorID(sensorId);
    const payload = buildPayload({ location, sensorId });
    const body = Buffer.from(JSON.stringify(payload));
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': body.length
    });
    res.end(body);
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Not Found');
});

const port = process.env.PORT ? Number(process.env.PORT) : 8081;
server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`temperature-api (Node.js) listening on :${port}`);
});


