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
    version: '2.0.0',
    environment: process.env.NODE_ENV || 'development',
    availableCommands: Object.keys(commands),
    usage: 'GET /command/{command-name} or POST /command with {"command": "command-name"}'
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Command endpoint - GET method
app.get('/command/:cmd', (req, res) => {
  const command = req.params.cmd;
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