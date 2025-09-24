const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Simple command responses
const commands = {
  'is-secure': 'yes',
  'has-vulnerabilities': 'no',
  'is-production-ready': 'yes',
  'needs-update': 'no',
  'is-compliant': 'yes',
  'has-secrets': 'no',
  'is-monitored': 'yes',
  'has-backup': 'yes'
};

app.get('/', (req, res) => {
  res.json({ 
    message: 'SecureApp Command API', 
    version: '2.1.0',
    environment: process.env.NODE_ENV || 'development',
    availableCommands: Object.keys(commands),
    usage: 'GET /command/{command-name} or POST /command with {"command": "command-name"}',
    formats: {
      json: 'Default JSON format',
      text: 'Plain text format: ?format=text',
      html: 'HTML format: ?format=html'
    },
    examples: [
      'curl http://localhost:3000/command/is-secure',
      'curl http://localhost:3000/command/is-secure?format=text',
      'curl http://localhost:3000/command/is-secure?format=html'
    ]
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Command endpoint - GET method
app.get('/command/:cmd', (req, res) => {
  const command = req.params.cmd;
  const response = commands[command];
  const format = req.query.format || 'json';
  
  if (response) {
    if (format === 'text' || format === 'plain') {
      res.set('Content-Type', 'text/plain');
      res.send(`${command}: ${response}`);
    } else if (format === 'html') {
      res.set('Content-Type', 'text/html');
      const color = response === 'yes' ? 'green' : 'red';
      res.send(`
        <html>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>SecureApp Command Response</h2>
            <p><strong>Command:</strong> ${command}</p>
            <p><strong>Response:</strong> <span style="color: ${color}; font-weight: bold;">${response}</span></p>
            <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
            <hr>
            <p><a href="/commands">View all commands</a></p>
          </body>
        </html>
      `);
    } else {
      res.json({ 
        command: command, 
        response: response,
        timestamp: new Date().toISOString()
      });
    }
  } else {
    res.status(404).json({ 
      error: 'Command not found', 
      availableCommands: Object.keys(commands)
    });
  }
});

// Command endpoint - POST method
app.post('/command', (req, res) => {
  const { command } = req.body;
  
  if (!command) {
    return res.status(400).json({ 
      error: 'Command is required', 
      usage: 'Send {"command": "command-name"}' 
    });
  }
  
  const response = commands[command];
  
  if (response) {
    res.json({ 
      command: command, 
      response: response,
      timestamp: new Date().toISOString()
    });
  } else {
    res.status(404).json({ 
      error: 'Command not found', 
      availableCommands: Object.keys(commands)
    });
  }
});

// List all available commands
app.get('/commands', (req, res) => {
  res.json({ 
    commands: commands,
    count: Object.keys(commands).length
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`SecureApp Command API running on port ${port}`);
  console.log(`Available commands: ${Object.keys(commands).join(', ')}`);
});